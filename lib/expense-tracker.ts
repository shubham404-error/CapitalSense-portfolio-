export const expenseCategories = ['🍴 Food','💡 Bills','🚌 Transportation','🍿 Entertainment','🛒 Shopping','❤️‍🩹 Health','🎁 Gifts','📦 Other'] as const;
export const expenseAccounts = ['Cash','Credit card','Savings','Bank','Other'] as const;

export type ExpenseCategory=(typeof expenseCategories)[number];
export type ExpenseAccount=(typeof expenseAccounts)[number];
export type Expense={id:string;title:string;amount:number;date:string;category:ExpenseCategory;account:ExpenseAccount;notes:string};
export type ExpenseTrackerData={expenses:Expense[];budgets:Record<string,Partial<Record<ExpenseCategory,number>>>};
export const emptyExpenseData=():ExpenseTrackerData=>({expenses:[],budgets:{}});
export const monthKey=(date:string)=>/^\d{4}-\d{2}/.test(date)?date.slice(0,7):'';

export function summarizeMonth(data:ExpenseTrackerData,month:string){
 const expenses=data.expenses.filter(item=>monthKey(item.date)===month);
 const byCategory=Object.fromEntries(expenseCategories.map(category=>[category,0])) as Record<ExpenseCategory,number>;
 for(const item of expenses)byCategory[item.category]+=item.amount;
 const spent=expenses.reduce((sum,item)=>sum+item.amount,0);
 const budget=expenseCategories.reduce((sum,category)=>sum+(data.budgets[month]?.[category]||0),0);
 return {expenses,byCategory,spent,budget,remaining:budget-spent};
}

export function builtInSpendingInsight(data:ExpenseTrackerData,month:string){
 const summary=summarizeMonth(data,month);
 if(!summary.expenses.length)return 'Log a few expenses and Stride will highlight where this month’s money is going.';
 const top=expenseCategories.map(category=>({category,spent:summary.byCategory[category],budget:data.budgets[month]?.[category]||0})).sort((a,b)=>b.spent-a.spent)[0];
 if(summary.budget===0)return `${top.category} is your largest category so far at ${Math.round(top.spent/summary.spent*100)}% of tracked spending. Add category budgets to see what is left.`;
 const over=expenseCategories.map(category=>({category,spent:summary.byCategory[category],budget:data.budgets[month]?.[category]||0})).filter(item=>item.budget>0&&item.spent>item.budget).sort((a,b)=>(b.spent-b.budget)-(a.spent-a.budget))[0];
 if(over)return `${over.category} is over its plan by ${new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(over.spent-over.budget)}. Review recent entries before changing the rest of your plan.`;
 const used=Math.round(summary.spent/summary.budget*100);
 return `${top.category} is your largest category. You have used ${used}% of this month’s total plan, with ${new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(Math.max(0,summary.remaining))} remaining.`;
}

export function sanitizeExpenseData(value:unknown):ExpenseTrackerData{
 if(!value||typeof value!=='object')return emptyExpenseData();
 const raw=value as {expenses?:unknown;budgets?:unknown};
 const expenses=Array.isArray(raw.expenses)?raw.expenses.filter((item):item is Expense=>{
  if(!item||typeof item!=='object')return false;
  const entry=item as Partial<Expense>;
  return typeof entry.id==='string'&&typeof entry.title==='string'&&entry.title.length<=80&&typeof entry.amount==='number'&&Number.isFinite(entry.amount)&&entry.amount>0&&typeof entry.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(entry.date)&&expenseCategories.includes(entry.category as ExpenseCategory)&&expenseAccounts.includes(entry.account as ExpenseAccount)&&typeof entry.notes==='string'&&entry.notes.length<=200;
 }).slice(0,500):[];
 const budgets:ExpenseTrackerData['budgets']={};
 if(raw.budgets&&typeof raw.budgets==='object')for(const [month,categoryValues] of Object.entries(raw.budgets as Record<string,unknown>)){
  if(!/^\d{4}-\d{2}$/.test(month)||!categoryValues||typeof categoryValues!=='object')continue;
  const clean:Partial<Record<ExpenseCategory,number>>={};
  for(const category of expenseCategories){const amount=(categoryValues as Record<string,unknown>)[category];if(typeof amount==='number'&&Number.isFinite(amount)&&amount>=0&&amount<=100000000)clean[category]=amount}
  budgets[month]=clean;
 }
 return {expenses,budgets};
}
