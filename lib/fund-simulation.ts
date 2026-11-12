import type { NavHistory, NavPoint } from "./mfapi";

export type SimulationMode = "sip" | "lumpsum";
export type SimulationPoint = { date: string; invested: number; value: number };
export type SimulationCashflow = { date: string; amount: number };
export type SimulationResult = {
  startDate: string;
  endDate: string;
  invested: number;
  value: number;
  gain: number;
  absolute: number;
  cagr: number | null;
  xirr: number | null;
  points: SimulationPoint[];
  cashflows: SimulationCashflow[];
  instalments: number;
};

const DAY = 86400000;
const iso = (date: Date) => date.toISOString().slice(0, 10);
const moveMonths = (date: string, months: number) => {
  const d = new Date(date + "T00:00:00Z"),
    day = d.getUTCDate();
  d.setUTCDate(1);
  d.setUTCMonth(d.getUTCMonth() + months);
  d.setUTCDate(
    Math.min(
      day,
      new Date(
        Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0),
      ).getUTCDate(),
    ),
  );
  return iso(d);
};
const onOrAfter = (points: NavPoint[], date: string) =>
  points.find((point) => point.date >= date);

export function xirr(cashflows: { date: string; amount: number }[]) {
  if (
    cashflows.length < 2 ||
    !cashflows.some((x) => x.amount < 0) ||
    !cashflows.some((x) => x.amount > 0)
  )
    return null;
  const start = Date.parse(cashflows[0].date + "T00:00:00Z");
  const value = (rate: number) =>
    cashflows.reduce(
      (sum, item) =>
        sum +
        item.amount /
          Math.pow(
            1 + rate,
            (Date.parse(item.date + "T00:00:00Z") - start) / (365.25 * DAY),
          ),
      0,
    );
  let low = -0.9999,
    high = 10,
    vl = value(low),
    vh = value(high);
  while (vl * vh > 0 && high < 1e6) {
    high *= 2;
    vh = value(high);
  }
  if (!Number.isFinite(vl) || !Number.isFinite(vh) || vl * vh > 0) return null;
  for (let i = 0; i < 160; i++) {
    const mid = (low + high) / 2,
      vm = value(mid);
    if (Math.abs(vm) < 0.0001) return mid * 100;
    if (vl * vm <= 0) {
      high = mid;
      vh = vm;
    } else {
      low = mid;
      vl = vm;
    }
  }
  return ((low + high) / 2) * 100;
}

export function simulateHistory(
  history: NavHistory,
  {
    mode,
    amount,
    months,
    annualStepUp = 0,
  }: {
    mode: SimulationMode;
    amount: number;
    months: number;
    annualStepUp?: number;
  },
): SimulationResult | null {
  const points = [...history.points].sort((a, b) =>
    a.date.localeCompare(b.date),
  );
  if (points.length < 2 || amount <= 0) return null;
  const end = points.at(-1)!;
  const target = moveMonths(end.date, -months);
  const start = onOrAfter(points, target);
  if (!start || start.date === end.date) return null;
  let units = 0,
    invested = 0,
    instalments = 0;
  const flows: { date: string; amount: number }[] = [];
  const purchases: { date: string; amount: number; units: number }[] = [];
  if (mode === "lumpsum") {
    units = amount / start.nav;
    invested = amount;
    instalments = 1;
    flows.push({ date: start.date, amount: -amount });
    purchases.push({ date: start.date, amount, units });
  } else {
    let scheduled = start.date,
      index = 0;
    while (scheduled <= end.date) {
      const nav = onOrAfter(points, scheduled);
      if (!nav || nav.date > end.date) break;
      const contribution =
        amount * Math.pow(1 + annualStepUp / 100, Math.floor(index / 12));
      const bought = contribution / nav.nav;
      units += bought;
      invested += contribution;
      instalments++;
      flows.push({ date: nav.date, amount: -contribution });
      purchases.push({ date: nav.date, amount: contribution, units: bought });
      scheduled = moveMonths(scheduled, 1);
      index++;
    }
  }
  const series: SimulationPoint[] = [];
  let runningUnits = 0,
    runningInvested = 0,
    purchaseIndex = 0,
    lastMonth = "";
  for (const point of points.filter((point) => point.date >= start.date)) {
    while (
      purchaseIndex < purchases.length &&
      purchases[purchaseIndex].date <= point.date
    ) {
      runningUnits += purchases[purchaseIndex].units;
      runningInvested += purchases[purchaseIndex].amount;
      purchaseIndex++;
    }
    const month = point.date.slice(0, 7);
    if (month !== lastMonth || point.date === end.date) {
      series.push({
        date: point.date,
        invested: runningInvested,
        value: runningUnits * point.nav,
      });
      lastMonth = month;
    } else
      series[series.length - 1] = {
        date: point.date,
        invested: runningInvested,
        value: runningUnits * point.nav,
      };
  }
  const value = units * end.nav,
    gain = value - invested,
    years = (Date.parse(end.date) - Date.parse(start.date)) / (365.25 * DAY),
    absolute = (value / invested - 1) * 100;
  flows.push({ date: end.date, amount: value });
  return {
    startDate: start.date,
    endDate: end.date,
    invested,
    value,
    gain,
    absolute,
    cagr:
      mode === "lumpsum" && years > 0
        ? (Math.pow(value / invested, 1 / years) - 1) * 100
        : null,
    xirr: mode === "sip" ? xirr(flows) : null,
    points: series,
    cashflows: flows,
    instalments,
  };
}
