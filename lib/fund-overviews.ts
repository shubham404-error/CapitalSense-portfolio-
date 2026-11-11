export type FundOverview = {
  benchmark: string;
  benchmarkSource: string;
  factsheetUrl: string;
};
const factsheet = "https://www.amfiindia.com/online-center/download-factsheets";
const amfiBenchmark =
  "https://www.amfiindia.com/otherdata/listofbenchmarkindices";
const entries: Record<string, string> = {
  "research-0cb31d029ee8": "NIFTY 500 TRI",
  "research-3b3667bf1cb1": "BSE 500 TRI",
  "research-7af513580676": "NIFTY LargeMidcap 250 TRI",
  "research-2e19157ba46f": "NIFTY LargeMidcap 250 TRI",
  "research-b75a15eb45c8": "NIFTY LargeMidcap 250 TRI",
  "research-93fadc353597": "NIFTY 500 TRI",
  "research-f2108eee278e": "BSE 500 TRI",
  "research-6cfc01fb7516": "NIFTY Midcap 150 TRI",
  "research-1e4fd3d6b31c": "NIFTY Midcap 150 TRI",
  "research-137ef5344cfc": "NIFTY Midcap 150 TRI",
  "research-920c0549f218": "NIFTY Midcap 150 TRI",
  "research-95eb8a752e70": "NIFTY Midcap 150 TRI",
  "research-44e4fef693c6": "BSE Midcap 150 TRI",
  "research-fe65ef8fea23": "BSE 250 SmallCap TRI",
  "research-aff32dde9ad6": "BSE 250 SmallCap TRI",
  "research-2702d2c4564c": "NIFTY Smallcap 250 TRI",
  "research-7773aadb2770": "NIFTY 500 Multicap 50:25:25 TRI",
  "research-f920401bbea6": "NIFTY 500 Multicap 50:25:25 TRI",
  "research-c624d1e039f4": "NIFTY 500 Multicap 50:25:25 TRI",
  "research-d33e1fe0869c": "BSE 500 TRI",
  "research-066cd6a043a7": "NIFTY 500 TRI",
  "research-2bfe99eeba02": "NIFTY 500 TRI",
};
export const fundOverviews: Record<string, FundOverview> = Object.fromEntries(
  Object.entries(entries).map(([id, benchmark]) => [
    id,
    { benchmark, benchmarkSource: amfiBenchmark, factsheetUrl: factsheet },
  ]),
);
