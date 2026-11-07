import type {SupabaseClient} from '@supabase/supabase-js';

export type GuideFailureKind='unavailable'|'account';

export class GuideRequestError extends Error{
 readonly kind:GuideFailureKind;
 readonly status?:number;
 constructor(message:string,kind:GuideFailureKind,status?:number){super(message);this.name='GuideRequestError';this.kind=kind;this.status=status}
}

export function isGuideUnavailable(error:unknown){
 return error instanceof GuideRequestError&&error.kind==='unavailable';
}

export async function requestGuide(client:SupabaseClient,signal?:AbortSignal){
 try{
  const {data,error}=await client.functions.invoke('guide',{body:{},signal,timeout:30000});
  if(error){
   let status:number|undefined;
   let code='';
   let message='Could not reach the AI guide. Please check your connection and try again.';
   if(error.context instanceof Response){
    status=error.context.status;
    const payload=await error.context.json().catch(()=>null);
    code=typeof payload?.code==='string'?payload.code:'';
    message=typeof payload?.error==='string'?payload.error:status===401?'Your session has expired. Sign in again.':status===400?'Save a complete starting point before using the guide.':`The guide returned HTTP ${status}.`;
   }
   const unavailable=code==='AI_UNAVAILABLE'||status===404||status===502||status===503||typeof status==='undefined';
   throw new GuideRequestError(message,unavailable?'unavailable':'account',status);
  }
  if(data?.error){
   const unavailable=data?.code==='AI_UNAVAILABLE';
   throw new GuideRequestError(String(data.error),unavailable?'unavailable':'account');
  }
  if(typeof data?.text!=='string'||!data.text.trim())throw new GuideRequestError('The AI provider returned an empty answer.','unavailable',502);
  return data.text;
 }catch(error){
  if(error instanceof GuideRequestError)throw error;
  if(error instanceof DOMException&&error.name==='AbortError')throw error;
  throw new GuideRequestError('The AI service could not be reached.','unavailable');
 }
}
