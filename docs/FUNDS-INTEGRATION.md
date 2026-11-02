# Funds integration boundary

The user requested a demo UI first while provider details are pending. This release intentionally uses fictional sandbox schemes. See `lib/demo-funds.ts` for fixture data and `lib/fund-data.ts` for filtering/allocation validation. No live-data fetch, transaction call, real fund recommendation or provider endorsement is implied.

## Prepared UI

- Twenty-five fictional growth-plan records (23 regular, two direct), clearly labelled sandbox values.
- Three illustrative basket layouts. Allocation examples are not inferred from the investor profile.
- Search, category/fund-house/plan filters, detail sheets and device-local shortlists.
- Whole-rupee monthly amount/date preview with no order, payment or mandate action.
- Empty states, reset controls, invalid-amount handling and responsive navigation.

## Before switching to real data or execution

Obtain the selected provider's authorised API documentation, commercial/technical access and supported customer journey. Collect and approve the limited fund universe with precise identifiers distinguishing AMC, scheme, plan, growth/IDCW and ISIN/provider mapping. Verify riskometer, costs, minimums, exit load, liquidity and source freshness against appropriate scheme/provider documents. Define suitability rules and overlap review, distribution/commission disclosures and complaint handling. Implement authenticated server-side order flows, idempotency and verified payment/provider webhooks. Confirm provider-required KYC and mandate consent.

Never map a `demo-` identifier to a real transaction endpoint. Demo fixture values must not be shown as actual AMFI NAVs or historical performance. Replace fixtures through an explicit reviewed migration, not an automatic best-match search by scheme name. Keep transaction credentials server-side and enter them securely rather than in chat.

## Category navigation supplied by the user

The 23 labels in `lib/fund-categories.ts` are category/collection navigation, not an approved list of schemes. They are grouped for browsing into Equity, Hybrid, Debt & cash and Other strategies. The mixed Value/Contra label and Opportunities collection are retained with a taxonomy note; no claim is made that every label is a standalone regulatory category.

The user's supplied S3 images are referenced with no-referrer image requests; local layered artwork is the fallback if an image cannot load. There is one or more fictional fixture entries per category so the demo can show filtering across the full supplied navigation. None of these fixtures is an actual scheme or a recommendation. Future provider mappings must use reviewed scheme identifiers, not category labels.
