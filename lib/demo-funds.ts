import type {Fund} from './fund-data';
// Fictional sandbox entries. Never map these identifiers to transaction-provider schemes.
export const demoFunds:Fund[]=[
 {code:'demo-broad-market',name:'Stride Broad Market Index Fund',amc:'Northstar Funds · Fictional',category:'Large Cap',plan:'regular',isin:null,nav:24.783,navDate:'2026-11-02'},
 {code:'demo-flexi',name:'Stride Flexi Equity Fund',amc:'Daybreak Mutual · Fictional',category:'Flexi Cap',plan:'regular',isin:null,nav:38.456,navDate:'2026-11-02'},
 {code:'demo-balanced',name:'Stride Balanced Allocation Fund',amc:'Evergreen Funds · Fictional',category:'Dynamic Asset Allocation or Balanced Advantage',plan:'regular',isin:null,nav:18.942,navDate:'2026-11-02'},
 {code:'demo-liquid',name:'Stride Liquid Reserve Fund',amc:'Northstar Funds · Fictional',category:'Liquid',plan:'regular',isin:null,nav:106.284,navDate:'2026-11-02'},
 {code:'demo-short-duration',name:'Stride Short Duration Fund',amc:'Evergreen Funds · Fictional',category:'Short-Term',plan:'regular',isin:null,nav:21.327,navDate:'2026-11-02'},
 {code:'demo-midcap',name:'Stride Midcap Opportunities Fund',amc:'Daybreak Mutual · Fictional',category:'Mid Cap',plan:'regular',isin:null,nav:42.618,navDate:'2026-11-02'},
];
const extraCategories=[['large-mid','Large and Mid Cap','Large and Mid Cap'],['value-contra','Value/Contra','Value Opportunities'],['small','Small Cap','Small Cap'],['multi','Multi Cap','Multi Cap'],['elss','Tax Saving (ELSS)','ELSS Tax Saver'],['multi-asset','Multi Asset','Multi Asset'],['aggressive','Aggressive Hybrid','Aggressive Hybrid'],['conservative','Conservative Hybrid','Conservative Hybrid'],['equity-savings','Equity Savings','Equity Savings'],['commodities','Commodities','Commodity Strategies'],['opportunities','Opportunities','Opportunities Collection'],['money-market','Money Market','Money Market'],['arbitrage','Arbitrage','Arbitrage'],['banking-psu','Banking and PSU','Banking and PSU Debt'],['corporate-bond','Corporate Bond','Corporate Bond'],['overnight','Overnight','Overnight'],['income-arbitrage','Income Plus Arbitrage Fund of Funds','Income Plus Arbitrage FoF']];
// Explicit sandbox fixtures to make each supplied category navigable. No real scheme data.
extraCategories.forEach(([id,category,title],i)=>demoFunds.push({code:'demo-'+id,name:'Stride '+title+' Fund',amc:['Northstar Funds · Fictional','Daybreak Mutual · Fictional','Evergreen Funds · Fictional'][i%3],category,plan:'regular',isin:null,nav:Number((15.2+i*1.731).toFixed(3)),navDate:'2026-11-02'}));
export const demoBaskets=[
 {id:'foundation',name:'A little breathing room',tag:'FOUNDATIONS',emoji:'🌿',description:'Explore how a liquidity-focused example could look. Your emergency reserve still needs an individual review.',funds:[{code:'demo-liquid',weight:100}],tone:'sage'},
 {id:'balanced',name:'Room to grow',tag:'A LONGER CHAPTER',emoji:'☀️',description:'A sample mix of broad market equity, hybrid and short-duration debt. For exploring the interface only.',funds:[{code:'demo-broad-market',weight:40},{code:'demo-balanced',weight:30},{code:'demo-short-duration',weight:30}],tone:'peach'},
 {id:'long-game',name:'The long game',tag:'FUTURE YOU',emoji:'🏔️',description:'An equity-focused example with broader market and flexi-cap exposure. Losses and overlap would need a real assessment.',funds:[{code:'demo-broad-market',weight:60},{code:'demo-flexi',weight:40}],tone:'lilac'},
];
