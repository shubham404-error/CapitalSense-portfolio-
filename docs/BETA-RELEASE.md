# Beta release status

The implementation is ready for its database migration; it is not yet published or fully live-verified.

## Required database step

Open https://supabase.com/dashboard/project/qmjtmrvrkvmbyfpsapsp/sql/new and run the complete contents of `supabase/migrations/202611040001_manual_holdings.sql` once. It creates private owner-only holdings storage and an authenticated self-account-deletion function. The deletion function only accepts the exact confirmation phrase and removes the currently authenticated account, cascading its linked data. Applying the migration itself does not delete accounts.

The migration has been tested locally for cross-account isolation, invalid SIP rejection, confirmation enforcement and deletion cascade. The live project currently responds PGRST205 for the missing table. This environment has no database-management credential; the browser publishable key cannot apply migrations. Do not put administrator credentials in chat.

After the SQL runs, verify the table and permissions on the live project, then push the app branch to trigger Pages. Check the resulting workflow and published site. Until then, don't claim cloud storage is live.

## Implemented

- Private signed-in holdings with error states, editing, deletion and explicit migration of account-specific older device entries.
- Empty initial feed; no fabricated people, posts or sample circle memberships. New personal journals are explicitly session-only; public links require separate consent.
- AssetPlus preparation/activation guide and troubleshooting, plus WhatsApp support to the operator-approved +91 8850405723. The user reviews and sends the draft; private account data is not attached.
- Account export and exact-phrase permanent deletion. AssetPlus orders and SIP mandates are unaffected by Stride deletion.
- Personalised next step, manual monthly SIP heads-ups, honest unconnected verified passport and practical financial reviews.

## Production acceptance after deployment

Use an actual invited account to check email-link and configured Google sign-in, return URL, profile save, holdings save and second-device reload, edit/delete and upcoming SIP schedules. Check the AssetPlus redirect without submitting another person's identity. Confirm WhatsApp opens the correct recipient with only the selected issue. Test user-owned sharing and revocation. Export test data and use a disposable account for permanent deletion; verify another account remains untouched. Test slow connections and retry messaging.

Browser automation uses Chromium with phone-sized viewports and mocked authenticated Supabase data. It does not establish physical Android/iPhone compatibility or authenticated production success. Check iPhone Safari and Android Chrome before inviting a wider group. Existing public links are not automatically removed merely because demo feed entries were removed.

Provider syncing, verified contributions, push reminders and real circles remain unavailable. Demo baskets stay explicitly separated from the real research list. Beta communication should describe a private habit companion with manual tracking and external AssetPlus investing. Capital Sense must operate the WhatsApp support inbox and handle identity verification and deletion questions privately.
