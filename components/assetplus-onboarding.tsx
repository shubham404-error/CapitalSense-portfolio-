'use client';
import OnboardingHelp from './onboarding-help';
import {ArrowLeft,ArrowRight,ArrowUpRight,Check,ExternalLink,Fingerprint,KeyRound,Lock,ShieldCheck,Smartphone,UserRound,MapPin,Users,Landmark,ChevronDown} from 'lucide-react';
import {investmentProvider as provider} from '../lib/investment-provider';

export function AssetPlusEntry({onOpen}:{onOpen:()=>void}) {
  return <section className="assetplus-entry" aria-label="AssetPlus onboarding">
    <span className="assetplus-entry-icon"><ArrowUpRight size={23}/></span>
    <div><small>YOUR INVESTMENT PARTNER / ASSETPLUS</small><h3>A real next step for future you.</h3><p>Register with Capital Sense’s distributor on AssetPlus. Your PAN and OTP stay on their platform.</p><button className="text-button" onClick={onOpen}>Set up with AssetPlus <ArrowRight size={15}/></button></div>
  </section>;
}

const preparation = [
  {title:'PAN & identity',icon:Fingerprint,copy:'Your PAN, name as on PAN, date of birth and applicable tax status.'},
  {title:'Phone & email',icon:Smartphone,copy:'Access to your phone for the AssetPlus OTP, your email address, and who each contact belongs to.'},
  {title:'Personal details',icon:UserRound,copy:'Place of birth, occupation, income range, marital status and any declarations AssetPlus asks you to make.'},
  {title:'Address',icon:MapPin,copy:'Your address details. Keep supporting proof available if AssetPlus requests it.'},
  {title:'Nominee',icon:Users,copy:'If adding a nominee: their name, date of birth and relationship. Review the nomination options shown by AssetPlus.'},
  {title:'Bank account',icon:Landmark,copy:'Account number, IFSC and account type for the bank account you will use. Follow any ownership-verification instructions there.'},
];
const activation = [
  {title:'PAN',copy:'Confirm your identity and PAN details. Complete tax status, income, occupation and political-exposure declarations as requested.'},
  {title:'Personal',copy:'Confirm your phone and email, who they belong to, place of birth and the other personal details requested.'},
  {title:'Address',copy:'Complete the address section using the information AssetPlus asks for. Upload proof there if required.'},
  {title:'Nominee',copy:'Review the nomination options. If you add a nominee, enter their details and check them carefully.'},
  {title:'Bank',copy:'Enter and re-enter your account number, then provide IFSC and account type. Complete the verification steps AssetPlus requests.'},
  {title:'Submit',copy:'Review your entries and the required declarations, then submit to AssetPlus. Follow any further verification requests and check the activation status there.'},
];

export default function AssetPlusOnboarding({back,account,funds}:{back:()=>void;account:()=>void;funds:()=>void}) {
  return <div className="assetplus-page">
    <button className="text-button assetplus-back" onClick={back}><ArrowLeft size={15}/>Back to Stride</button>
    <div className="assetplus-heading"><div><span className="eyebrow">STRIDE × ASSETPLUS / YOUR NEXT CHAPTER</span><h1>Your next step,<br/><em>with AssetPlus.</em></h1><p>A little preparation makes the next step easier. Keep your details handy, then complete registration and activation on AssetPlus.</p></div><span className="assetplus-partner-pill"><ExternalLink size={13}/>External onboarding</span></div>
    <section className="assetplus-preparation" aria-labelledby="assetplus-preparation-title"><div className="assetplus-section-heading"><span className="eyebrow">BEFORE YOU OPEN ASSETPLUS</span><h2 id="assetplus-preparation-title">Keep these details handy.</h2><p>This is a preparation checklist. Enter your details on AssetPlus when asked; there is nothing to fill in or upload here.</p></div><ul>{preparation.map(({title,icon:Icon,copy})=><li key={title}><span><Icon size={20}/></span><div><h3>{title}</h3><p>{copy}</p></div></li>)}</ul><div className="assetplus-preparation-note"><Lock size={15}/><p>Your KYC and bank details are not collected or stored by this Stride guide. Keep your OTP private and enter it only on AssetPlus.</p></div></section>
    <div className="assetplus-layout"><div className="assetplus-main">
      <section className="assetplus-steps" aria-labelledby="assetplus-steps-title"><div className="assetplus-section-heading"><span className="eyebrow">PART 1 / REGISTRATION</span><h2 id="assetplus-steps-title">Three steps. Your own pace.</h2><p>Based on the registration flow shared by Capital Sense. AssetPlus may update its screens.</p></div>
        <ol>
          <li><span className="assetplus-step-number">01</span><div><span className="assetplus-step-icon"><Fingerprint size={22}/></span><h3>Start on AssetPlus</h3><p>Check the distributor details, choose your client type, and enter your PAN and phone number. Review AssetPlus’s Terms & Conditions and Privacy Policy before agreeing.</p><small>Enter these details only on AssetPlus.</small></div></li>
          <li><span className="assetplus-step-number">02</span><div><span className="assetplus-step-icon"><KeyRound size={22}/></span><h3>Verify your phone</h3><p>Enter the OTP sent by AssetPlus on its verification screen. If it doesn’t arrive, use the resend option when it becomes available.</p><small>Never share your OTP with anyone, including support.</small></div></li>
          <li><span className="assetplus-step-number">03</span><div><span className="assetplus-step-icon"><Smartphone size={22}/></span><h3>Open AssetPlus and sign in.</h3><p>After registration, use AssetPlus’s “Open / Download App” button. Sign in there, then choose “Activate account” to continue with the KYC and account setup steps below.</p><small>Review your security settings and update your password in AssetPlus.</small></div></li>
        </ol>
      </section>
      <section className="assetplus-activation" aria-labelledby="assetplus-activation-title"><div className="assetplus-section-heading"><span className="eyebrow">PART 2 / ACCOUNT ACTIVATION</span><h2 id="assetplus-activation-title">Sign in. Then activate your account.</h2><p>On AssetPlus, choose <strong>Activate account</strong>. Its setup flow has the following sections. Open a step below for a quick guide.</p></div><ol>{activation.map((step,i)=><li key={step.title}><details><summary><span>{String(i+1).padStart(2,'0')}</span><b>{step.title}</b><ChevronDown size={16}/></summary><p>{step.copy}</p></details></li>)}</ol><p className="assetplus-activation-note">These are instructions, not a record of your progress. AssetPlus may adapt the steps to your account. Activation and any remaining investment or mandate requirements must be confirmed there.</p></section>
      <section className="assetplus-boundary"><ShieldCheck size={22}/><div><h3>Registration is a beginning.</h3><p>A registration confirmation does not by itself confirm KYC approval, a bank mandate or an investment. AssetPlus will show the next steps for your account.</p></div></section>
      <OnboardingHelp/><section className="assetplus-return"><span className="eyebrow">ALREADY BACK FROM ASSETPLUS?</span><h2>Keep your journey going.</h2><p>Stride cannot read your AssetPlus registration or investment status yet. Opening the link does not create a verified SIP or add to your streak here.</p><div><button className="secondary" onClick={account}>Review my Stride profile <ArrowRight size={15}/></button><button className="text-button" onClick={funds}>Keep researching funds <ArrowRight size={15}/></button></div></section>
    </div><aside className="assetplus-side">
      <section className="assetplus-handoff"><div className="assetplus-handoff-art" aria-hidden="true"><span>ONE SMALL STEP</span><ArrowUpRight size={88}/><i/><i/><i/></div><div className="assetplus-handoff-body"><span className="eyebrow">YOUR ONBOARDING LINK</span><h2>Continue with<br/>{' '}AssetPlus.</h2><dl><div><dt>Mutual fund distributor</dt><dd>{provider.distributorName}</dd></div><div><dt>AMFI registration number</dt><dd>ARN-{provider.arn}</dd></div></dl><a className="primary wide" href={provider.onboardingUrl} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">Open AssetPlus onboarding <ExternalLink size={17}/></a><span className="assetplus-link-caption">assetplus.in · Opens in a new tab</span><p>The link may redirect to AssetPlus’s mobile web onboarding. Confirm the distributor name and ARN on their page before proceeding.</p></div></section>
      <section className="assetplus-private"><Lock size={18}/><div><h3>Your details stay where they belong.</h3><p>Stride does not collect your PAN, phone number, OTP or AssetPlus password in this flow. Your Stride account and AssetPlus account are separate.</p></div></section>
      <details className="assetplus-faq"><summary>What happens to my fund shortlist?</summary><p>Your Stride research, profile and demo basket are not sent through this link. Choose and review investments separately on AssetPlus; a shortlisted fund is not an order or a recommendation.</p></details>
      <details className="assetplus-faq"><summary>Why isn’t my registration marked complete here?</summary><p>This is an external onboarding link. Stride has no provider confirmation or account connection yet, so we won’t guess your KYC, investment or streak status.</p></details>
      <p className="assetplus-disclosure">Mutual fund distribution through {provider.distributorName}, ARN-{provider.arn}, as shown in the registration flow supplied by Capital Sense. Regular-plan distribution may involve commissions. Review applicable costs, terms and disclosures on AssetPlus. Mutual fund investments are subject to market risks. Read all scheme related documents carefully.</p>
    </aside></div>
    <div className="assetplus-bottom-note"><Check size={15}/><span>Your pace. Your choice. You can keep exploring Stride before registering.</span></div>
  </div>;
}
