import type {SupabaseClient} from '@supabase/supabase-js';
export async function requestGuide(client:SupabaseClient,signal?:AbortSignal){
 const {data,error}=await client.functions.invoke('guide',{body:{},signal,timeout:30000});
 if(error){let message='Could not reach Gemini’s server function. Please check your connection and try again.';
  if(error.context instanceof Response){const status=error.context.status;const payload=await error.context.json().catch(()=>null);message=typeof payload?.error==='string'?payload.error:status===401?'Your session has expired. Sign in again.':status===404?'The guide function is not deployed to this project.':`The guide returned HTTP ${status}. Please retry later.`;
   if(status===503)message+=' Capital Sense needs to finish configuring this service. Your saved answers are still safe. (503)';
   if(status===502)message+=' The AI provider did not return an answer. Try again later; your saved profile has not changed. (502)';
  }
  throw Error(message);
 }
 if(data?.error)throw Error(String(data.error));
 if(typeof data?.text!=='string'||!data.text.trim())throw Error('Gemini returned an empty explanation. No answer has been generated.');
 return data.text;
}
