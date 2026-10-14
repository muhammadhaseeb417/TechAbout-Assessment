# Caching decision

`/air/flights/karachi-to-dubai` is the only cached page. It contains route-guide copy and static trip-planning notes, so the App Router can revalidate that page hourly (`revalidate = 3600`). A one-hour window keeps editorial changes reasonably fresh without rebuilding the page for every visit.

`/air/search` is dynamic because the URL controls trip details, filters, simulation and sort. Its offer loader reads local synthetic data today, but in a real integration this is date-specific inventory. `/api/offers` is also forced dynamic and sets `Cache-Control: no-store, max-age=0`; fare availability and supplier errors must be fetched again for each search.

If we reversed this, caching offers could show a fare or seat count after its supplier inventory changed, or replay one traveller's route/filter response to another query. Uncaching the guide would not break correctness, but it would repeat work for stable copy and send avoidable load to the app. The revalidation boundary is intentionally page-level: no fare data is imported into the static guide.
