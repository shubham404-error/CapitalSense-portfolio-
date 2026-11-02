import {createClient} from '@supabase/supabase-js';
import project from '../config/supabase-public.json';
// Publishable keys are intentionally browser-safe. Never add a service-role key here.
const overrideUrl=process.env.NEXT_PUBLIC_SUPABASE_URL;
const overrideKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const overridden=Boolean(overrideUrl||overrideKey);
const url=overridden?overrideUrl:project.url;
const key=overridden?overrideKey:project.publishableKey;
export const supabase=url&&key?createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}):null;
