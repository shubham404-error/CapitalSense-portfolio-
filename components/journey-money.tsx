import ExpenseTracker from './expense-tracker';
import ManualHoldings from './manual-holdings';

export default function JourneyMoney(props:{owner:string;signIn:()=>void}){
 return <><ExpenseTracker owner={props.owner}/><ManualHoldings {...props}/></>;
}
