export type AadiStory = { situation: string; rethink: string; habit: string; question: string };

// Independent fictional snapshots from Aadi's baseline; not a performance timeline.
export const aadiStories: Record<string, AadiStory> = {
  'sip-is-a-method-not-a-product': {
    situation: 'Aadi tells a friend, “I bought a SIP.” He picked the fund from a reel and remembers the monthly amount, but not what the scheme invests in.',
    rethink: 'He separates the payment instruction from the investment. Before automating anything, he checks the scheme’s objective, holdings, risk and costs against his goal.',
    habit: 'Write the goal, intended holding period and reason for choosing the scheme beside every recurring instruction.',
    question: 'Could you explain what your SIP buys without mentioning its monthly amount?',
  },
  'compounding-needs-time': {
    situation: 'A calculator makes Aadi’s future balance look exciting. He starts treating its assumed return as something his investments will deliver every year.',
    rethink: 'He tests lower-return scenarios, allows for inflation, and separates money contributed from investment gains. His savings habit is within his control; the return is not.',
    habit: 'Save a range of scenarios with their assumptions instead of one impressive future number.',
    question: 'Would your plan still be workable if returns were lower than the calculator assumes?',
  },
  'understanding-mutual-fund-risk': {
    situation: 'Aadi sees a Riskometer label and assumes it explains every way a fund could disappoint him. His laptop purchase is only 18 months away.',
    rethink: 'He checks the portfolio, concentration and liquidity as well as the label. Money needed soon deserves a different risk discussion from money he can leave invested for years.',
    habit: 'Write the date he needs the money next to the risks that could get in the way.',
    question: 'What would a decline mean for the date you need this money?',
  },
  'mutual-fund-costs': {
    situation: 'Aadi compares funds by recent returns and barely notices costs. Then he assumes the lowest expense ratio must make a fund the best choice.',
    rethink: 'He compares like-for-like plans and looks at expense ratios, possible exit loads, taxes and fit together. Lower cost matters, but it does not fix an unsuitable portfolio.',
    habit: 'Add a costs-and-exit-conditions row to his research notes before making a choice.',
    question: 'Do you know both the ongoing costs and what could apply when you exit?',
  },
  'portfolio-overlap': {
    situation: 'Aadi has ₹18,000 spread across five funds and calls it diversified. Different names make the portfolio look more varied than it may be.',
    rethink: 'He examines shared holdings, sectors and mandates before adding another fund. Five labels can still leave him exposed to the same companies.',
    habit: 'Give each holding a role and check what a new fund actually adds.',
    question: 'Does your next investment add a different exposure or another version of what you own?',
  },
  'review-without-overreacting': {
    situation: 'Aadi checks his portfolio on the commute, at lunch and before bed. A red day feels like a reason to change something.',
    rethink: 'He separates price movements from changes to his goals, income or a fund’s mandate. He sets a review date and records events that would justify an earlier check.',
    habit: 'Keep a review checklist and a decision log rather than reacting to every notification.',
    question: 'What changed besides the price?',
  },
  'asset-allocation-is-the-real-portfolio': {
    situation: 'Aadi organises his app by fund name, but cannot say which money is for emergencies, the laptop or a longer-term goal.',
    rethink: 'He maps each pot to its purpose and timeframe before deciding which types of assets to investigate. Emergency savings stay separate from goal investments.',
    habit: 'Maintain a one-page map of goals, available money, time horizons and exposures.',
    question: 'Can you connect each part of your portfolio to a purpose?',
  },
  'large-mid-small-cap-are-not-risk-ratings': {
    situation: 'Aadi thinks “large-cap” means safe and a small-cap label means a faster route to his goals. Neither label tells him the whole story.',
    rethink: 'He looks beyond company size to valuations, concentration, liquidity and the scheme’s actual holdings. He asks what a difficult market could mean for his goal.',
    habit: 'Read category definitions and portfolio facts together, rather than using either as a safety rating.',
    question: 'What risks remain after you have read the category name?',
  },
  'emergency-fund-before-investing': {
    situation: 'Aadi has ₹12,000 set aside for emergencies. Against ₹36,000 of monthly essentials, family support and EMI commitments, that is roughly one-third of a month.',
    rethink: 'He lists essential outgoings, considers job and family uncertainty, and works out an accessible reserve target before increasing market-linked commitments.',
    habit: 'Use part of his ₹8,000 monthly saving capacity to build a separate buffer, revisiting the amount as circumstances change.',
    question: 'Which expenses would still need paying if your salary stopped?',
  },
  'market-cycles-and-changing-leadership': {
    situation: 'A sector keeps appearing in Aadi’s feed after a strong run. He is tempted to move his savings towards whatever has just won.',
    rethink: 'He distinguishes a recent performance table from a forward-looking reason to invest. He checks concentration and considers what happens if leadership changes.',
    habit: 'Record why a change fits his plan before acting on a market story.',
    question: 'Would this decision still make sense without the recent return chart?',
  },
  'behavioural-biases-that-shape-investing': {
    situation: 'Aadi saves bullish posts about a fund he already owns and scrolls past the critical ones. A friend’s gains make him feel behind.',
    rethink: 'He notices confirmation bias and comparison pressure. He writes down evidence against his view and separates another person’s results from his own constraints.',
    habit: 'Keep a “what could prove me wrong?” line in every significant investment decision.',
    question: 'What evidence would make you reconsider your current view?',
  },
  'goal-based-investing-start-with-the-number': {
    situation: '“I should save more” becomes more concrete when Aadi names a laptop goal: ₹90,000 in 18 months, before changes in price.',
    rethink: 'With no money earmarked and no assumed investment return, the starting arithmetic is ₹5,000 a month. That leaves ₹3,000 of his ₹8,000 capacity for his buffer and other goals, so he must examine the trade-offs.',
    habit: 'Record the amount, date, existing savings and flexibility of a goal; adjust the target or timeline if the budget is too tight.',
    question: 'What would you change first if the goal and your monthly budget do not fit?',
  },
};
