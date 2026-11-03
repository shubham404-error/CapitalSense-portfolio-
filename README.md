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

## Photo lenses

The camera composer now includes seven local lenses: Golden Hour, Sunday Film, Bloom Mode, Main Character, After Hours, Dream Postcard and Showing Up. They combine photo colour treatments, frames, emoji stickers, editable context and optional explicitly labelled demo milestone overlays. Default exports include no stats and never show investment amounts.

Open the live camera (explicit permission required), switch front/back, and capture; or use the phone camera/photo library. The portrait frame crops to fill 720×960. Save a JPEG, use native file sharing where supported, or post the rendered image to the session-only feed. This is a photo effects studio, not face-tracked AR. Colour effects depend on browser Canvas filter support; overlays remain local. Native camera capture, front/back selection and share targets vary by device. Photos are not sent to Supabase or Gemini. Save before closing the composer: editing-session photos are cleared on close, and camera tracks stop on capture, closure or hidden tab.

`npm run test:lenses` exercises live camera using Chromium's synthetic camera, seven distinct renders, caption/stat/sticker edits, JPEG export, filtered posting, track cleanup and denied-permission fallback. It does not prove real-device camera availability; test iOS Safari and Android Chrome before wider release.

## Google sign-in

The account sheet supports Continue with Google through Supabase, alongside email links. It checks the project's public provider settings before enabling Google. The account consent checkbox is required for either method. Google returns through Supabase to the same Pages URL, keeping auth and onboarding in the existing backend. Enable the provider with your Google Web OAuth client ID/secret as described in `docs/SUPABASE.md`; no client secret is included in this repository. OAuth cancellation/errors show a retry message and return to Account. `npm run test:google-auth` checks provider discovery, consent, the generated OAuth handoff, email fallback and cancellation using intercepted services; it does not sign into a real Google account.

## Full account page

Profile navigation opens an account dashboard with name, username, optional age/gender, 12 original illustrated avatar assets (all styles open to everyone), or a private compressed photo. It prompts the adaptive swipe check and shows the investor snapshot, separately displayed loss comfort/financial constraints, and actual per-theme response counts. No age/gender-based risk scoring or invented analytics are used.

Apply the additive `202611030001_profiles.sql` migration in Supabase SQL Editor before real profile saving. Existing onboarding is unchanged. `npm run test:profile` checks the editing → photo/avatar → swipe → analytics flow with intercepted Supabase responses. `npm run test:backend` includes private profile access, username/age constraints and profile-summary rules. Live persistence still requires the migration and signed-in acceptance checks.

## Funds and baskets demo

The Funds destination is an interactive sandbox: 23 category tiles, 23 regular-growth examples, three illustrative baskets, search/category/house/plan filters, fund detail sheets, device-local shortlists and monthly SIP previews. Every scheme, fund house, NAV/date and allocation is fictional. Demo identifiers use a `demo-` prefix and cannot be treated as real provider scheme codes. Basket amounts are whole-rupee previews whose allocations sum exactly to the entered amount; the ₹500–₹10,00,000 input range is a UI limit, not a real scheme minimum.

The demo does not fetch live market data, choose investments from the user's profile, create mandates, save an investment plan or move money. No provider credentials are needed for the demo. AssetPlus has been selected for the separate external registration handoff. Provider API documentation, approved fund universe, verified scheme data and suitability review remain prerequisites for live integration. Demo shortlist entries stay on this device, namespaced by account or guest; Clear local demo data removes the current namespace.

`npm run test:funds` checks filtering, plan distinctions, fund details, shortlist persistence, exact basket allocation and validation, SIP preview wording and mobile overflow against the static server. Mobile navigation now includes Funds; learning remains available via Learn the basics.

## Connected guide and social sharing

**AI Guide** is now a visible screen in the sidebar, header and Account. It shows prerequisites, loading, a real server response, actionable connection errors and retry. It calls the deployed Supabase `guide` endpoint; no Gemini key is embedded in the browser. Unsaved answers are not silently sent. Changing user or starting a new check clears previous AI content and cancels an in-flight request.

Post Share opens a dedicated sheet with Instagram Stories, WhatsApp Status, a device share menu, story-image saving, and public post links. Exported JPEGs are 1080×1920, include the selected photo without cropping it, and optionally include the display name. They retain the no-verified-transaction/demo labels. Instagram/WhatsApp Story/Status selection cannot be forced from a website: supported devices use native file sharing, with explicit save-and-upload instructions as fallback. WhatsApp **message**, Facebook and X have genuine link-share URLs once a link is created; nothing posts automatically.

Public links require the additive shared-posts migration in `docs/SUPABASE.md`. A link is generated only after a consented post is saved to Supabase, lasts 30 days, opens without login and can be revoked from Account. Private financial answers, email, age, gender, holdings and contribution amounts are not included in that public record. Story image export works even before this migration is applied. Photos in public links are stored separately from private profile photos. The feed itself remains session-only; this update persists only moments the user explicitly shares.

`npm run test:guide-sharing` covers mocked Gemini success/error, server-only routing, story targets, 9:16 export, public consent, link creation/platform encoding, anonymous viewing, revocation and failed-save behavior. Backend tests verify the actual PostgreSQL permissions and expiry/rate-limit logic. Live signed-in Gemini and real mobile social handoff still need device/account acceptance checks.


## AssetPlus registration handoff

AssetPlus is the selected investment partner. Public onboarding configuration lives in `lib/investment-provider.ts`: `https://www.assetplus.in/mfd/290303`, distributor Shubham Haresh Tejani, ARN-321386 (identity supplied by Capital Sense in the provider screenshots). Keep the distributor link identifier and ARN separate; they are different values.

Funds, Account, Journey and the assessment result open a Stride guide, then the explicit **Open AssetPlus onboarding** link opens a separate tab with `noopener noreferrer` and no referrer. The supplied URL currently redirects to AssetPlus's mobile-web registration. Stride does not embed the provider page, collect PAN/phone/OTP/password, attach profile or fund selections to the URL, submit registration, or reuse the provider's credentials for Supabase authentication. The supplied screenshots' personal contact information is not included in the app.

The guide first lists what to keep handy: PAN/identity, accessible contact details, personal information, address, optional nominee information and bank details. It contains no KYC inputs, upload fields, completion checkboxes or stored progress. It describes the supplied PAN/phone → provider OTP → registration confirmation/app download flow, followed by signing in and selecting Activate account: PAN → Personal → Address → Nominee → Bank → Submit. The address section is described generically because no populated address screen was supplied; additional proof and checks remain conditional on AssetPlus instructions. No personal data from the example screenshots is reproduced. Registration is distinct from completed KYC, verified bank details, mandate setup or a completed investment. Following or returning from the link cannot verify any of these, persist a provider connection or award a contribution/streak. There is deliberately no client-side “mark verified” action. Demo baskets and research shortlists are not passed as live orders.

For account/transaction syncing, obtain AssetPlus's approved integration documentation and access, including supported account linking, signed server callbacks/status APIs, scheme identity, transaction lifecycle and reconciliation. A public distributor link alone is not that integration. Keep credentials server-side and award verified milestones only from reconciled provider confirmations.

Validation: `npm run test:assetplus` against a local build checks entry points, URL/identity, redirect handling, no data transmission, no false completion, return navigation and 320–1440px layouts. Provider registration is mocked; the test must not submit PAN or send a real OTP.

## Launch journey slice

Home now chooses a next action from validated profile answers: start the assessment, review financial constraints/timeline, or prepare for AssetPlus. Journey shows a habit passport with unknown contribution status until provider confirmations exist, and practical reviews for market declines, affordability changes and pauses. These reviews do not place orders or change mandates. `npm run test:launch-journey` checks the foundation-first route and mobile layout. Provider event verification, real circles, automated reminders and production support operations remain separate launch dependencies; the external registration guide cannot supply transaction status.

Manual holdings in Journey are self-reported private Supabase rows with owner-only RLS. Sign-in is required. Apply `supabase/migrations/202611040001_manual_holdings.sql` before publishing this version. Account-specific legacy device entries can be explicitly imported; guest entries are not automatically assigned to an account. Individual deletion is available in Journey; Account includes a private export and a typed-confirmation self-deletion flow. This migration also supplies the authenticated self-deletion function. Deleting a Stride account does not affect AssetPlus investments. Active monthly schedules produce in-app reminders only; no push/email/SMS or verified milestones are created.

Support FAQs and a user-initiated WhatsApp draft point to +91 8850405723, supplied by the operator. Drafts contain only an issue category, not private account data. Sample feed entries and sample circle listings were removed. Personal journals remain session-only unless the user explicitly publishes a revocable shared link; demo fund baskets remain separately labelled previews.
