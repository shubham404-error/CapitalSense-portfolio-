const {readFileSync}=require('node:fs');
const assert=require('node:assert/strict');
const ts=require('typescript');
const compiled=ts.transpileModule(readFileSync('lib/expense-tracker.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const moduleUnderTest={exports:{}};
new Function('exports',compiled)(moduleUnderTest.exports);
const {expenseCategories,sanitizeExpenseData,summarizeMonth,builtInSpendingInsight}=moduleUnderTest.exports;

const month='2026-11';
const data=sanitizeExpenseData({expenses:[
 {id:'1',title:'Groceries',amount:2500,date:'2026-11-05',category:expenseCategories[0],account:'Bank',notes:''},
 {id:'2',title:'Electricity',amount:1200,date:'2026-11-06',category:expenseCategories[1],account:'Credit card',notes:'home'},
 {id:'3',title:'Old',amount:999,date:'2026-10-01',category:expenseCategories[0],account:'Cash',notes:''},
 {id:'bad',title:'Future invalid category',amount:20,date:'2026-11-07',category:'Not real',account:'Cash',notes:''},
],budgets:{[month]:{[expenseCategories[0]]:2000,[expenseCategories[1]]:2000}}});
const summary=summarizeMonth(data,month);
assert.equal(data.expenses.length,3);
assert.equal(summary.spent,3700);
assert.equal(summary.budget,4000);
assert.equal(summary.remaining,300);
assert.match(builtInSpendingInsight(data,month),/over its plan/i);
assert.match(builtInSpendingInsight({expenses:[],budgets:{}},month),/log a few expenses/i);
assert.deepEqual(sanitizeExpenseData(null),{expenses:[],budgets:{}});
console.log('PASS: expense storage validation, monthly totals, category budgets and safe built-in insight.');
