# Funds integration boundary

The user requested a demo UI first while provider details are pending. This release intentionally uses fictional sandbox schemes. See `lib/demo-funds.ts` for fixture data and `lib/fund-data.ts` for filtering/allocation validation. No live-data fetch, transaction call, real fund recommendation or provider endorsement is implied.

## Prepared UI

- Twenty-three fictional Regular Growth records, clearly labelled sandbox values.
- Three illustrative basket layouts. Allocation examples are not inferred from the investor profile.
- Search, category/fund-house/plan filters, detail sheets and device-local shortlists.
- Whole-rupee monthly amount/date preview with no order, payment or mandate action.
- Empty states, reset controls, invalid-amount handling and responsive navigation.

## Before switching to real data or execution

Obtain the selected provider's authorised API documentation, commercial/technical access and supported customer journey. Collect and approve the limited fund universe with precise identifiers distinguishing AMC, scheme, plan, growth/IDCW and ISIN/provider mapping. Verify riskometer, costs, minimums, exit load, liquidity and source freshness against appropriate scheme/provider documents. Define suitability rules and overlap review, distribution/commission disclosures and complaint handling. Implement authenticated server-side order flows, idempotency and verified payment/provider webhooks. Confirm provider-required KYC and mandate consent.

Never map a `demo-` identifier to a real transaction endpoint. Demo fixture values must not be shown as actual AMFI NAVs or historical performance. Replace fixtures through an explicit reviewed migration, not an automatic best-match search by scheme name. Keep transaction credentials server-side and enter them securely rather than in chat.

## Category navigation supplied by the user

The 23 labels in `lib/fund-categories.ts` are category/collection navigation, not an approved list of schemes. They are grouped for browsing into Equity, Hybrid, Debt & cash and Other strategies. The mixed Value/Contra label and Opportunities collection are retained with a taxonomy note; no claim is made that every label is a standalone regulatory category.

The user's supplied S3 images are downloaded, validated and bundled into the app during deployment. The workflow retains the PNGs in the repository, so later deployments do not depend on the source host. The published UI uses same-origin image paths; local layered artwork is only a last-resort rendering fallback. A failed source download stops deployment rather than pretending the original artwork is present. There is one or more fictional fixture entries per category so the demo can show filtering across the full supplied navigation. None of these fixtures is an actual scheme or a recommendation. Future provider mappings must use reviewed scheme identifiers, not category labels.

## MFAPI research and workbook input

The supplied workbook contains 81 rows, 79 distinct scheme names and 23 categories. The catalogue stages only names/category membership in `config/fund-research.json`. Undated return values, fund sizes, risk labels and minimum amounts from the workbook are not published as current data. The original workbook is not committed. Two scheme names have cross-category membership and are kept once with multiple category tags.

Funds → Explore your 79 scheme names opens the MFAPI research view. Search results show **explicit Regular Plan – Growth only**. Direct, IDCW, dividend distribution and ambiguous plan variants are excluded. Strategy names such as Dividend Yield are not confused with dividend-distribution options. No scheme code is automatically mapped from a name; the user selects the exact result. NAV metadata must match the selected code and identify a Regular Growth option, with a valid dated positive NAV. Stale data is visibly marked. Requests abort when the selected scheme or search changes.

MFAPI is a third-party scheme/NAV data source, not a broker, risk-rating authority, factsheet repository or investment execution service. The browser uses its public API without credentials. The deployment probes its actual search/latest response and CORS headers; this is independent of mocked browser tests. Live provider availability may change.

Factsheet actions point to https://www.amfiindia.com/online-center/download-factsheets and explicitly identify it as a directory. They are not represented as scheme-specific PDF links. Transaction integration still awaits the selected provider's documentation and access.
