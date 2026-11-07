const {readFileSync}=require('node:fs');
const assert=require('node:assert/strict');
const ts=require('typescript');
const compiled=ts.transpileModule(readFileSync('lib/rule-guide.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
const moduleUnderTest={exports:{}};
new Function('exports',compiled)(moduleUnderTest.exports);
const {ruleGuideAnswer,ruleGuidePrompts}=moduleUnderTest.exports;

const foundation=['A safety net','Within 1 year','Not started yet','I have expensive debt to address','I need this money back soon'];
const prepared=['Long-term freedom','More than 7 years','More than 6 months of essentials','I have a stable surplus','I could wait if my goal allows'];

assert.equal(ruleGuidePrompts.length,6);
assert.match(ruleGuideAnswer('priority',foundation),/expensive debt/i);
assert.match(ruleGuideAnswer('timeline',foundation),/within one year/i);
assert.match(ruleGuideAnswer('buffer',foundation),/accessible savings/i);
assert.match(ruleGuideAnswer('market-fall',foundation),/deadline or access need/i);
assert.match(ruleGuideAnswer('next-step',foundation),/do not need to proceed to a provider/i);
assert.match(ruleGuideAnswer('next-step',prepared),/AssetPlus preparation page/i);
for(const [id] of ruleGuidePrompts){
 const answer=ruleGuideAnswer(id,prepared);
 assert.match(answer,/educational guidance, not a personalised investment recommendation/i);
 assert.doesNotMatch(answer,/guaranteed|buy this|recommended fund/i);
}
console.log('PASS: built-in guide covers six fixed prompts, prioritises constraints and never presents a recommendation.');
