# Travel.pk flight results assessment

A local-only Next.js App Router flight search prototype. It uses invented fares from `data/offers.json`; it has no supplier credentials, checkout, or production connection.

## Run it in about ten minutes

Requirements: Node.js 20.9+ and npm.

```powershell
npm install
npm run dev
```

Open [http://localhost:3000/air/search](http://localhost:3000/air/search). The project uses Next.js 15, React 19, TypeScript, and no UI or icon package. It works without environment variables. `npm run build` makes a production build; use `npm start` to serve it.

## Try each supplier state

All page URLs below preserve the same trip. The synthetic supplier delay is 1.2–2.5 seconds (slow is fixed at 2.5 seconds). The default is a partial response so a missing supplier is part of the normal experience.

```text
/air/search?route=KHI-DXB&date=2026-11-15&pax=1&cabin=economy&simulate=ok
/air/search?route=KHI-DXB&date=2026-11-15&pax=1&cabin=economy&simulate=slow
/air/search?route=KHI-DXB&date=2026-11-15&pax=1&cabin=economy&simulate=error
/air/search?route=KHI-DXB&date=2026-11-15&pax=1&cabin=economy&simulate=empty
/air/search?route=KHI-DXB&date=2026-11-15&pax=1&cabin=economy&simulate=partial
```

The same trigger can be used directly against the API, for example `/api/offers?route=KHI-DXB&date=2026-11-15&pax=1&cabin=economy&simulate=error`. It responds with JSON; `error` returns HTTP 503. With no `route` parameter, the API returns all 30 local offers; a `route` narrows the sample set. For an empty screen caused by actual applied filters (rather than the simulation), try `&stops=nonstop&airlines=Qatar%20Airways&price=0-50000`. Use the page's **Clear filters** action to reset stops, airline, and price while retaining the trip.

Other URL state keys are `route` (airport codes, e.g. `KHI-DXB`), `date` (`YYYY-MM-DD`), `pax` (1–9), `cabin` (`economy`, `premium`, `business`), `stops` (`all`, `nonstop`, `1stop`), `airlines` (comma-separated exact names), `price` (`minimum-maximum`, PKR per traveller), and `sort` (`recommended`, `price`, `fastest`, `departure`). Search edits, filter apply, sort, refresh, and browser back/forward all read/write this URL state.

## Decisions and trade-offs

- The search route is dynamic. Its server page parses the URL; a Server Component loads offers before returning results, inside Suspense. The skeleton reserves the same result area so the response does not jump when it arrives.
- `lib/offers.ts` is the server-side data boundary shared by the Server Component and `/api/offers`. Both use the same local JSON, delay, filtering and simulation contract. Rendering calls the loader directly instead of making an HTTP request back into the same Next server; the API handler is available for independent clients and manual inspection.
- Search, filters, and sort controls are client components because they handle input and navigation. Flight data, formatting, empty/error/partial states and route guide content are server rendered. The mobile filters use the browser's native `<dialog>` modal behavior for focus containment and Escape handling.
- The checked-in data has 30 invented fares across Gulf, London and domestic routes. Amounts are synthetic PKR, not bookable prices. Premium and business figures apply simple multipliers to the sample economy fare.
- The guide route at `/air/flights/karachi-to-dubai` has an hourly revalidation window; the date-specific search and offer API are always dynamic and uncached. See [CACHING.md](./CACHING.md).

## Evidence and review

- [Walkthrough and keyboard pass](./WALKTHROUGH.md) has the five state screenshots and the keyboard-only review steps.
- [Public page audit](./AUDIT.md) documents evidence from the public Travel.pk Karachi–Dubai route page. The audit is report-only; this app does not patch that site.
- [Assessment form draft](./SUBMISSION.md) has the prepared approach/blocker text and calls out the fields that require your hosted link and actual focused time.
- Run `npm run build` to check the TypeScript/Next production compilation. Run `npm run screenshots` with the app running to regenerate the four state images and record the desktop and mobile keyboard pass. If Chrome is installed elsewhere, set `CHROME_PATH` to its executable. No standalone test suite is included; this timeboxed prototype can be inspected from the deterministic simulation URLs above.

## Gaps and next steps

- Offers, supplier failures, fare rules, timings, and availability are entirely invented. There is no booking, payment, passenger form, supplier adapter, persistence, or backend rate control.
- One-way date and passenger controls are demonstrated; return dates, multi-city, child/infant ages, currency conversion, fare family selection, and live inventory are out of scope.
- The demo's failed-airline set is fixed for reproducibility, and a retry of the forced error drops only `simulate` so it retries in default partial mode. A real retry would call the suppliers again and preserve a request/correlation ID.
- Before production: connect typed supplier adapters with per-supplier deadlines/circuit breakers; measure availability and price variance; add a tested timezone-aware schedule model; add end-to-end accessibility, URL-state, API contract and cache tests; then perform a real-device 3G and screen-reader review.

## Assessment form notes

Use the repository/workspace location as the handoff target if it has been made accessible to TechAbout. No hosted repository or assessment form was configured by this task, so a public work URL and form submission have not been fabricated. Record your own actual focused time before submitting.
