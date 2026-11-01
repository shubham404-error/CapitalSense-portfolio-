import {NextResponse} from 'next/server';
export async function POST(){return NextResponse.json({error:'The guide has moved to the authenticated Supabase Edge Function.'},{status:410})}
