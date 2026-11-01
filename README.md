# Stride / Capital Sense

An orange, responsive investing-habit web app prototype. Work is on `feature/sip-social-app`; the existing `feature/website-v1` site is untouched.

## Run

Node.js 24, npm 11 or later. From this checkout:

```sh
npm ci
npm run dev
```

Production: `npm run typecheck`, `npm run build`, then `npm start` (port 3000). Fonts, icons and the illustrated landscape are bundled locally.

## What works

Feed reactions/bookmarks, session-only photo posts (5 MB limit), circle previews, journey and learning screens, local demo profile, local questionnaire storage and data deletion, downloadable PNG milestone cards, native file sharing when supported. Photos are not included in exported cards yet. Native share destinations depend on the browser/device; there is no direct Instagram/Facebook publishing API integration.

Onboarding starts with up to 20 scenario cards. Swipe, use the buttons, skip, or finish at any point. After five cards, a deterministic prototype heuristic stops when at least four responses cover planning, community and clarity, with no disagreement within each theme. Mixed answers continue up to 20. This heuristic is not a validated psychological instrument, AI confidence score, risk assessment or suitability conclusion. Recap preferences can be edited. Five practical financial questions follow separately; no fund baskets are recommended without an approved universe and full suitability rules.

## Gemini (optional, server only)

Copy `.env.example` to `.env.local` and supply `GEMINI_API_KEY` securely. Never commit real keys or use `NEXT_PUBLIC_` for them. Default model: `gemini-2.5-flash`; configurable via `GEMINI_MODEL`. Set `GEMINI_DEMO_ENABLED=true` only in controlled development. Restart after changing environment variables.

The endpoint sends the five financial questionnaire answers, not photos, names, contribution amounts or swipe preferences. It requests educational explanations only and has no approved fund universe. No live model call was tested because no key was supplied. Before public enablement add real authentication, durable per-user rate limiting, consent, retention controls, approved data grounding, output validation and provider review. Same-origin checks alone do not prevent API abuse.

## Browser checks

Start the production server, then run `npm run test:smoke`. Uses installed `/usr/bin/chromium`; override `CHROMIUM_PATH` for another browser executable and `BASE_URL` for another local server. Test writes screenshots and a PNG card under `/tmp`. It covers the five-card early finish, actual pointer swipe, mixed-answer continuation to 20 cards, practical assessment, missing-key handling, a post, export and mobile circle interaction. The missing-key test assumes Gemini is unconfigured.

## Before real customers or transactions

This is a functional UI prototype, not a launch-ready financial service. Authentication is a clearly labelled local demo profile, not a secure account. There is no shared database, real community, KYC collection, payment mandate or investment execution. Sample people and achievements are fictional. Posting cannot verify a contribution or earn a real streak.

Choose and contract a provider (ZFunds or AssetPlus), verify API/white-label capabilities and webhook security, integrate secure authentication and provider-required KYC, document the curated fund universe and reviewed allocation rules, verify operator ARN/EUIN and compensation disclosures, and complete compliance/privacy/security/accessibility review. Do not collect PAN, identity documents or money through this prototype. No registration identifier or fund data has been invented.
