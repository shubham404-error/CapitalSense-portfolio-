# Connect a real Supabase backend

The code supports a real Supabase project, but creating these files does not provision or deploy one. No live project or credentials were available during implementation.

## 1. Create your project

1. Open https://supabase.com/dashboard and sign in (GitHub works).
2. Choose New project, select/create an organisation, name it `capitalsense-stride`, and choose a region near your users. Store the database password privately.
3. Wait for the project to finish provisioning.
4. In Connect or Settings → API, copy the Project URL and publishable key (or legacy anon key). Both are public client configuration. Never share the service-role key or database password.

## 2. Install the database

Open SQL Editor → New query. Paste the complete contents of `supabase/migrations/202611020001_backend.sql` and run it once. It creates private onboarding storage, row-level security and a server-only daily AI quota. For future revisions use ordered migrations rather than rerunning this initial migration.

The migration is tested against embedded PostgreSQL with Supabase auth roles stubbed. It still needs execution and verification on your actual Supabase project. No public tables contain financial answers. No service-role key is used by the frontend.

## 3. Configure sign-in

In Authentication → URL Configuration:

- Site URL: `https://shubham404-error.github.io/CapitalSense-portfolio-/stride/`
- Add that exact URL to Redirect URLs.
- For local testing, also allow `http://localhost:3000/`.

Keep email confirmation enabled and configure the email provider/templates. The app uses `signInWithOtp` with an email magic link, not a password form. Supabase's default email sender is limited and is unsuitable for general onboarding: configure a custom SMTP provider, verify its sender domain, and test delivery to an address outside the project organisation before inviting testers. Set auth rate limits and CAPTCHA appropriate to your rollout.

## 4. Connect the Pages frontend

In the GitHub repository: Settings → Secrets and variables → Actions → Variables, add:

- `NEXT_PUBLIC_SUPABASE_URL`: the project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: the publishable key (legacy anon key also works as this value).

Rerun **Deploy Capital Sense and Stride demo** from Actions. These two values are intentionally public and are embedded in the browser bundle. **Never put a service-role or Gemini key into a NEXT_PUBLIC variable.** For local development place the same two settings in ignored `.env.local` and restart the app.

## 5. Deploy the Gemini function

The function code is `supabase/functions/guide/index.ts`. It can be deployed using the Supabase CLI from this checkout:

```sh
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
supabase functions deploy guide --no-verify-jwt
```

Use either SQL Editor or `db push` for the initial migration; if using SQL Editor, reconcile the migration history before later CLI migrations. Interactive login and project credentials belong in your terminal/secure settings, not chat. Alternatively create a `guide` Edge Function through Supabase's dashboard editor and paste the function source. Disable the gateway's legacy JWT verification for this function; it independently validates every user's bearer token with Supabase Auth before any data access or model call.

In Edge Functions → Secrets, set:

- `GEMINI_API_KEY`: a fresh key (rotate the key previously shared in chat).
- `GEMINI_MODEL`: the exact API model ID enabled in your Google project. Requested model: `gemini-3.5-flash-lite`; availability is **not verified**. Do not assume a display name is a valid model identifier.
- `ALLOWED_ORIGINS`: `https://shubham404-error.github.io` (origins do not include paths). Add `http://localhost:3000` separated by a comma only if local testing is wanted.

Supabase supplies `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` inside its Edge runtime; do not copy the service-role key into frontend configuration. This function uses it only to consume a quota for the already authenticated user. User answers are fetched with that user's own token under RLS.

## What a user experiences

Explore → optional vibe check → sign up/sign in by email link → return to the app → complete practical questions → explicitly consent and save → private answers load on later visits. Editing local answers does not update the database until Save is chosen again. Email-link return does not auto-upload a guest's data. Gemini uses the last saved financial answers, after an explicit request, and never receives photos, names, amounts or swipe preferences. Ten attempts per user per database day are allowed; provider failures after quota consumption also count.

Settings provides deletion of saved onboarding. This does not delete the Auth account or email. Sign-out is in Account. Account deletion/retention requests currently require operator handling through Supabase; document and staff that process before collecting real users' data.

The social feed, photos and circle previews remain session-only demo features. No investment transactions, provider KYC, fund recommendations or real contribution streaks are enabled. Supabase auth is not investment KYC.

## Required live acceptance checks

Before inviting testers: sign up and click a real email link; refresh and sign out/in; save and reload onboarding; use a second account to confirm isolation; delete saved answers; confirm allowed redirects; request a Gemini explanation; verify unauthenticated requests are rejected and quotas enforced. These live checks could not run without a project. Add a privacy notice, review retention and subprocessors, configure email delivery, and complete security/compliance review before public customer onboarding.

## Connected project

The frontend now defaults to the public project configuration in `config/supabase-public.json`. The publishable key is intentionally browser-visible; it grants no service-role privileges. GitHub Actions Variables are optional overrides. If overriding, supply URL and key together to avoid mixing projects. The new workflow runs read-only public endpoint checks and includes their results in the deployment job title/summary. Those checks do not create accounts, send email, store answers or call Gemini.

For browser smoke/mobile checks against this configured frontend, set `SUPABASE_CONNECTED=true`. Authentication-specific tests still use intercepted responses with the explicit fake test project described in README. Live sign-in requires a real inbox: never share session tokens or magic links in chat.

## Enable Continue with Google

The app checks Supabase's public Auth settings and enables its Google button only when the provider is enabled. Email-link login remains available. User profiles and private onboarding stay in Supabase; Firebase is not needed.

1. In Supabase open Authentication → Sign In / Providers → Google. Copy the OAuth callback URL. For this project it is `https://qmjtmrvrkvmbyfpsapsp.supabase.co/auth/v1/callback`.
2. In Google Cloud Console / Google Auth Platform, choose a project, configure branding/audience and create an OAuth client of type **Web application**. If the app is in testing, add the intended Google accounts as test users where required.
3. Add `https://shubham404-error.github.io` as an authorised JavaScript origin, and the exact **Supabase callback URL above** as an authorised redirect URI. The Google redirect URI is not the GitHub Pages app URL.
4. Copy the Google client ID and client secret into the Google provider settings in Supabase. Enable the provider and save. Keep the client secret in Supabase; never paste it into chat or browser configuration.
5. Keep `https://shubham404-error.github.io/CapitalSense-portfolio-/stride/` in Supabase's allowed Redirect URLs. This is where Supabase returns the user after Google completes.
6. Refresh the app, open Sign in, confirm the age/account checkbox and choose Continue with Google. Test account selection, cancellation, successful return, refresh, sign-out and retrieval of existing saved answers. Use the same verified email as your existing account and check that your saved onboarding appears; do not delete old accounts to work around a duplicate-identity issue.

Google OAuth uses only the standard identity scopes requested by Supabase; Stride does not request Gmail or Drive access. No real Google OAuth round-trip can be validated until a web client is configured in the Google project and enabled in Supabase.
