# Stride / Capital Sense

Orange, responsive investing-habit web app on `feature/sip-social-app`. Existing public website: `feature/website-v1`. Demo: https://shubham404-error.github.io/CapitalSense-portfolio-/stride/

## Develop

Node.js 24, npm 11+:

```sh
npm ci
npm run dev
```

Validate with `npm run typecheck`, `npm run test:backend`, `npm run build`. Run production with `npm start`. Fonts, icons and landscape artwork are bundled locally.

## Supabase onboarding

**[Step-by-step project creation and deployment guide](docs/SUPABASE.md).** Creating code does not provision a project. Configure the public project URL and publishable key in `.env.local` locally, or GitHub Actions repository Variables for Pages. Never expose service-role keys or Gemini credentials in browser code.

Implemented: email-link signup/signin, persisted Supabase session, consented private onboarding saves, restoration and deletion, signout, row-level access controls and an authenticated Gemini Edge Function with an atomic daily quota. Without project configuration the Account screen explains setup is pending; it does not pretend to create accounts.

The user can explore and take the vibe check before signing in. An email link creates/authenticates their account. After signing in they complete and explicitly save onboarding. Supabase auth is separate from investment KYC. Financial onboarding is never uploaded automatically. Saved answers are private; a banner lets returning users review them. Requesting Gemini sends the last saved financial answers, not photos, amounts, names or swipe choices. The requested model `gemini-3.5-flash-lite` still requires API availability verification.

## UI and prototype scope

Feed reactions/bookmarks, session-only photo posts (5 MB limit), circle previews, private journey and learning screens, amount-free PNG milestone cards and native file sharing. Share destinations depend on the browser/device; direct Instagram/Facebook publishing and photos in exported cards are not implemented.

The vibe check has up to 20 scenario cards, with swipe/button controls, skipping and early finish. After five, a deterministic heuristic stops if at least four responses cover planning, community and clarity with no within-theme disagreement. This is a prototype preference heuristic, not a validated personality or risk assessment. A separate practical questionnaire follows. No actual fund basket is recommended without approved data and full suitability rules.

Social posts/circles are still demo-only and disappear on reload. Sample people and milestones are fictional. No real investments, mandates, verified contribution streaks or provider KYC are enabled. Choose and contract ZFunds/AssetPlus, verify APIs, approve fund selection and allocation logic, and complete compliance/security/privacy reviews before customer transactions. The operator's ARN/EUIN and commission disclosures must be verified before launch.

## Tests

- `npm run test:backend`: real embedded PostgreSQL tests for RLS, cross-user denial, deletion and quota; mocked Edge handler tests for auth, origin, quota and provider behavior.
- `npm run test:smoke`: with an unconfigured app server running, checks UI, both adaptive onboarding paths, pointer swipe, posts, card downloads and mobile overflow. Uses `/usr/bin/chromium` by default; override `CHROMIUM_PATH` and `BASE_URL` as needed.
- `npm run test:auth`: contract test for configured Supabase frontend using intercepted HTTP responses. Build with `NEXT_PUBLIC_SUPABASE_URL=https://stride-test.supabase.co` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_test_only`, serve at `BASE_URL`, then run. Fake test configuration is never committed as production configuration.

Live email delivery, real-project migrations, real-user RLS and actual Gemini calls are not verified without a Supabase project. Required live checks are in the guide.

## Pages deployment

`PAGES_BASE_PATH=/CapitalSense-portfolio-/stride npm run build:pages` creates `out/`. It temporarily excludes `app/api` and restores it in a finally block. Do not run a concurrent dev/build command. Pages uses Supabase directly for auth/data/Edge Functions; it needs no Gemini key in its build.

The deployment workflow builds `feature/website-v1` at the repository root and Stride under `/stride/`. Settings → Pages must use GitHub Actions. Pushing the website branch's independent deployment workflow can overwrite this combined artifact; rerun the Stride workflow afterward or consolidate publication for ongoing development.

Account deletion/retention requests currently require operator handling in Supabase. Deleting saved onboarding does not delete the Auth account. Configure SMTP, privacy notice and account-deletion handling before inviting real users.

## Mobile design and retention analysis

Mobile uses a centred camera action, camera/library selection, preview/removal, bottom-sheet dialogs, sticky header, safe-area navigation and larger controls. `npm run test:mobile` validates camera input, photo handling and overflow at 320–430px widths against a running unconfigured server. Browser capture support depends on the device.

See [the comparative product analysis](docs/PRODUCT-RETENTION.md) for Strava/Instagram/Tinder/YouTube patterns, hypotheses and proposed measurements. Official-source fetches were blocked by network policy; this is not a completed evidence-backed retention study. A finite feed deliberately provides a stopping point. No retention experiments have run.
