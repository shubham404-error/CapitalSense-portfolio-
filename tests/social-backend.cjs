const {PGlite}=require('@electric-sql/pglite');
const {readFileSync}=require('node:fs');
const assert=require('node:assert/strict');

const A='11111111-1111-1111-1111-111111111111';
const B='22222222-2222-2222-2222-222222222222';
const C='33333333-3333-3333-3333-333333333333';

(async()=>{
 const db=new PGlite();
 await db.exec(`create schema auth;create role anon;create role authenticated;create role service_role bypassrls;
 create table auth.users(id uuid primary key);
 create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
 grant usage on schema public,auth to anon,authenticated,service_role;
 grant execute on function auth.uid() to authenticated;
 insert into auth.users values ('${A}'),('${B}'),('${C}');`);
 await db.exec(readFileSync('supabase/migrations/202611140001_social_moments.sql','utf8'));

 await db.exec(`set role authenticated;set request.jwt.claim.sub='${A}';
 insert into public.social_profiles(user_id,display_name,username) values ('${A}','Alpha','alpha_user');`);
 await assert.rejects(()=>db.exec(`insert into public.social_profiles(user_id,display_name) values ('${B}','Stolen')`));
 const privateMoment=(await db.query(`insert into public.moments(user_id,author_display_name,caption,audience) values ('${A}','Alpha','Private reflection','private') returning id`)).rows[0].id;
 const friendsMoment=(await db.query(`insert into public.moments(user_id,author_display_name,caption,audience) values ('${A}','Alpha','Friends reflection','connections') returning id`)).rows[0].id;
 const exploreMoment=(await db.query(`insert into public.moments(user_id,author_display_name,caption,audience) values ('${A}','Alpha','Explore reflection','explore') returning id`)).rows[0].id;
 assert.equal((await db.query('select * from public.moments')).rows.length,3);

 await db.exec(`set request.jwt.claim.sub='${B}'`);
 let visible=await db.query('select caption from public.moments order by caption');
 assert.deepEqual(visible.rows.map(row=>row.caption),['Explore reflection']);
 await assert.rejects(()=>db.exec(`insert into public.moments(user_id,author_display_name,caption) values ('${A}','Alpha','Wrong owner')`));
 const requestId=(await db.query(`select public.create_connection_request('${A}') as id`)).rows[0].id;
 await db.exec(`set request.jwt.claim.sub='${A}'`);
 assert.equal((await db.query(`select public.respond_connection('${requestId}',true) as accepted`)).rows[0].accepted,true);
 await db.exec(`set request.jwt.claim.sub='${B}'`);
 visible=await db.query('select caption from public.moments order by caption');
 assert.deepEqual(visible.rows.map(row=>row.caption),['Explore reflection','Friends reflection']);

 await db.exec(`set request.jwt.claim.sub='${C}'`);
 await db.exec(`insert into public.moment_cheers(moment_id,user_id,reaction) values ('${exploreMoment}','${C}','proud')`);
 await db.exec(`insert into public.moment_comments(moment_id,user_id,author_display_name,body) values ('${exploreMoment}','${C}','Charlie','Keep going')`);
 await db.exec(`insert into public.moment_reports(moment_id,reporter_id,reason) values ('${exploreMoment}','${C}','misinformation')`);
 assert.equal((await db.query(`select count(*)::int as total from public.moment_cheers where moment_id='${exploreMoment}'`)).rows[0].total,1);
 await db.exec(`set request.jwt.claim.sub='${A}'`);
 assert.equal((await db.query(`select count(*)::int as total from public.social_notifications where moment_id='${exploreMoment}'`)).rows[0].total,2);
 await db.exec(`insert into public.notification_preferences(user_id,cheers) values ('${A}',false)`);
 await db.exec(`set request.jwt.claim.sub='${C}';delete from public.moment_cheers where moment_id='${exploreMoment}' and user_id='${C}';insert into public.moment_cheers(moment_id,user_id) values ('${exploreMoment}','${C}')`);
 await db.exec(`set request.jwt.claim.sub='${A}'`);
 assert.equal((await db.query(`select count(*)::int as total from public.social_notifications where moment_id='${exploreMoment}'`)).rows[0].total,2);

 await db.exec(`insert into public.user_blocks(blocker_id,blocked_id) values ('${A}','${B}')`);
 await db.exec(`set request.jwt.claim.sub='${B}'`);
 assert.equal((await db.query(`select * from public.moments where user_id='${A}'`)).rows.length,0);
 await assert.rejects(()=>db.exec(`insert into public.moment_cheers(moment_id,user_id) values ('${exploreMoment}','${B}')`));
 await db.exec(`set request.jwt.claim.sub='${A}'`);
 assert.equal((await db.query(`select caption from public.moments where id='${privateMoment}'`)).rows[0].caption,'Private reflection');
 await db.exec(`delete from public.moments where id='${privateMoment}'`);
 assert.equal((await db.query(`select * from public.moments where id='${privateMoment}'`)).rows.length,0);

 await db.exec('reset role;set role anon');
 await assert.rejects(()=>db.query('select * from public.moments'));
 await assert.rejects(()=>db.query('select * from public.social_profiles'));
 await db.close();
 console.log('PASS: Moments enforce private/friends/Explore audiences, connection approval, blocks, reactions, comments, reports, notifications and owner isolation.');
})().catch(error=>{console.error(error);process.exit(1)});
