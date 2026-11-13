import ExpenseTracker from './expense-tracker';
import ManualHoldings from './manual-holdings';

export function JourneySpending(props:{owner:string;signIn:()=>void}){
 return <ExpenseTracker owner={props.owner} signIn={props.signIn}/>;
}

export function JourneyInvestments(props:{owner:string;signIn:()=>void}){
 return <ManualHoldings {...props}/>;
}

export default function JourneyMoney(props:{owner:string;signIn:()=>void}){
 return <><ExpenseTracker owner={props.owner} signIn={props.signIn}/><ManualHoldings {...props}/></>;
}
