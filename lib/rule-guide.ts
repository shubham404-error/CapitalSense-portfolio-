export type RuleGuidePrompt='priority'|'timeline'|'buffer'|'affordability'|'market-fall'|'next-step';

export const ruleGuidePrompts:[RuleGuidePrompt,string][]=[
 ['priority','What should I focus on first?'],
 ['timeline','Is my timeline suitable for investing?'],
 ['buffer','Should I build my emergency fund first?'],
 ['affordability','Can I comfortably start investing?'],
 ['market-fall','How should I think about a market fall?'],
 ['next-step','What can I do next?'],
];

let currentAnswers:string[]=[];
export function setRuleGuideAnswers(answers:string[]){currentAnswers=[...answers]}
export function getRuleGuideAnswers(){return currentAnswers}

const ending='This is educational guidance, not a personalised investment recommendation.';

export function ruleGuideAnswer(prompt:RuleGuidePrompt,answers:string[]){
 const [goal='',timeline='',buffer='',affordability='',fall='']=answers;
 const weakBuffer=buffer==='Not started yet'||buffer==='Less than 3 months of essentials';
 const debt=affordability==='I have expensive debt to address';
 const variable=affordability==='My income varies a lot';
 const uncertain=affordability==='I’m not sure yet';
 const short=timeline==='Within 1 year';
 const medium=timeline==='1–3 years';
 let text='';
 if(prompt==='priority'){
  if(debt)text='Your answer about expensive debt is the clearest priority. Review its cost and repayment plan before adding market risk.';
  else if(weakBuffer)text='Your accessible emergency savings need attention first. A stronger buffer can reduce the chance that an unexpected expense forces you to sell an investment.';
  else if(variable||uncertain)text='Start by clarifying what remains after essentials and irregular expenses. A repeatable surplus matters more than choosing an ambitious amount.';
  else if(short)text='Your need for the money within one year is the main constraint. Access and capital stability matter more than your comfort with market falls.';
  else text=`Your foundations appear ready for a fuller review. Keep the goal${goal?` (${goal.toLowerCase()})`:''}, timeline, existing holdings and ability to bear losses together before choosing a product.`;
 }
 if(prompt==='timeline'){
  if(short)text='Money needed within one year generally has very little time to recover from a market decline. Treat access and stability as the priority and avoid assuming willingness to wait can extend a real deadline.';
  else if(medium)text='A one-to-three-year horizon is still relatively short for volatile assets. Match any option to the exact date, flexibility and consequence of a loss rather than relying on an investor label.';
  else text=`Your ${timeline.toLowerCase()} answer leaves more time for review, but time alone does not make an investment suitable. Your emergency savings, obligations and loss capacity still matter.`;
 }
 if(prompt==='buffer'){
  if(weakBuffer)text=`You selected “${buffer}”. Consider building accessible savings for essential surprises before depending on market investments. The right buffer size depends on your expenses, dependants and income stability.`;
  else text=`You selected “${buffer}”. That is a useful foundation, but confirm the money is accessible and separate from the goal you plan to invest for.`;
 }
 if(prompt==='affordability'){
  if(debt)text='Expensive debt can consume a dependable return through interest costs. Compare its cost and repayment needs before committing money that may be difficult to access.';
  else if(variable)text='With variable income, base a contribution on a conservative month and keep room for essential expenses. A flexible or paused contribution is better than one that creates pressure.';
  else if(uncertain)text='Do not guess at affordability. Review income, essentials, debt payments, near-term expenses and emergency savings first; the remainder—not a promotional minimum—is the useful starting point.';
  else text='A stable surplus is a positive starting point, not an instruction to invest all of it. Keep room for essentials, near-term goals and unexpected expenses before deciding an amount.';
 }
 if(prompt==='market-fall'){
  if(short||fall==='I need this money back soon')text='Your deadline or access need matters more than confidence during a fall. If a loss would disrupt the goal, that risk needs to be addressed before investing.';
  else if(fall==='I’d be worried and want help')text='Concern during a fall is understandable. Decide in advance who you would consult, what facts you would review and how your goal and timeline would guide the decision.';
  else text='Being willing to wait can help behaviourally, but it does not prove financial capacity for loss. Review whether your goal, cash buffer and obligations would still be safe after a decline.';
 }
 if(prompt==='next-step'){
  if(debt||weakBuffer||variable||uncertain)text='Review your financial foundations in My plan, then update your saved answers when your position changes. You do not need to proceed to a provider yet.';
  else if(short||medium)text='Use Learn & research to understand time horizon, liquidity and volatility. If you review a product, compare its access rules and risk with the exact date you need the money.';
  else text='Continue to Learn & research, review scheme documents and costs, and use the AssetPlus preparation page only when you are ready. Stride will not place an order or confirm provider activity.';
 }
 return `${text} ${ending}`;
}
