import { getOffers, OffersServiceError, type Offer } from "@/lib/offers";
import { formatPKR, routeCities, type SearchCriteria } from "@/lib/search";
import { RetryButton } from "@/components/retry-button";
import { SortSelect } from "@/components/sort-select";

const routeZones: Record<string, { short: string }> = {
  KHI: { short: "PKT" }, LHE: { short: "PKT" }, ISB: { short: "PKT" },
  DXB: { short: "GST" }, DOH: { short: "AST" }, LHR: { short: "GMT" },
};

function dateTime(date: string, localTime: string, dayOffset: number, offset: number) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = localTime.split(":").map(Number);
  return new Date(Date.UTC(year, month - 1, day + dayOffset, hour, minute) - offset * 60_000).toISOString();
}

function offsetLabel(offset: number) {
  const sign = offset < 0 ? "−" : "+";
  const absolute = Math.abs(offset);
  return `UTC${sign}${String(Math.floor(absolute / 60)).padStart(2, "0")}:${String(absolute % 60).padStart(2, "0")}`;
}

function duration(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

function FlightCard({ offer, criteria }: { offer: Offer; criteria: SearchCriteria }) {
  const [fromCode, toCode] = offer.route.split("-");
  const from = routeZones[fromCode] ?? routeZones.KHI;
  const to = routeZones[toCode] ?? routeZones.DXB;
  const total = offer.price * (criteria.cabin === "business" ? 3.2 : criteria.cabin === "premium" ? 1.8 : 1) * criteria.pax;
  const fare = Math.round(total);
  return (
    <article className="flight-card">
      <div className="airline-block">
        <div className="airline-mark" aria-hidden="true">{offer.airlineCode}</div>
        <div><strong>{offer.airline}</strong><span>{offer.flightNumber} · {criteria.cabin[0].toUpperCase() + criteria.cabin.slice(1)}</span></div>
      </div>
      <div className="flight-route" aria-label={`${fromCode} to ${toCode}, ${duration(offer.durationMinutes)}, ${offer.stops === 0 ? "nonstop" : "one stop"}`}>
        <div className="time-place">
          <time dateTime={dateTime(criteria.date, offer.departureLocal, 0, offer.departureUtcOffsetMinutes)}>{offer.departureLocal}</time>
          <span>{fromCode}</span>
          <small>{from.short} · {offsetLabel(offer.departureUtcOffsetMinutes)}</small>
        </div>
        <div className="route-line"><span>{duration(offer.durationMinutes)}</span><span className="route-rule" aria-hidden="true"><i /></span><span>{offer.stops === 0 ? "Nonstop" : "1 stop"}</span></div>
        <div className="time-place arrival-place">
          <time dateTime={dateTime(criteria.date, offer.arrivalLocal, offer.arrivalDayOffset, offer.arrivalUtcOffsetMinutes)}>{offer.arrivalLocal}</time>
          <span>{toCode}{offer.arrivalDayOffset ? <sup>+1</sup> : null}</span>
          <small>{to.short} · {offsetLabel(offer.arrivalUtcOffsetMinutes)}</small>
        </div>
      </div>
      <div className="flight-amenities"><span>{offer.baggage}</span><span>{offer.refundable ? "Changes allowed" : "Non-refundable"}</span></div>
      <div className="fare-block"><strong>{formatPKR(fare)}</strong><span>{criteria.pax > 1 ? `for ${criteria.pax} travellers` : "total, incl. taxes"}</span><span className="fare-includes">Sample fare · taxes included</span></div>
    </article>
  );
}

function activeFilterNames(criteria: SearchCriteria) {
  const items: string[] = [];
  if (criteria.stops !== "all") items.push(criteria.stops === "nonstop" ? "nonstop only" : "1 stop");
  if (criteria.airlines.length) items.push(criteria.airlines.join(", "));
  if (criteria.priceMin > 0 || criteria.priceMax < 400000) items.push(`${formatPKR(criteria.priceMin)}–${formatPKR(criteria.priceMax)}`);
  return items;
}

export async function FlightResults({ criteria }: { criteria: SearchCriteria }) {
  let payload;
  try {
    payload = await getOffers(criteria);
  } catch (error) {
    if (!(error instanceof OffersServiceError)) throw error;
    return (
      <section className="state-card error-state" aria-labelledby="error-heading">
        <div className="state-icon" aria-hidden="true">↻</div><p className="eyebrow">Search interrupted</p>
        <h2 id="error-heading">We couldn’t reach every airline just now.</h2>
        <p>Your trip details are still here. Try once more and we’ll ask our partners again.</p>
        <RetryButton />
      </section>
    );
  }

  if (!payload.offers.length) {
    const active = activeFilterNames(criteria);
    const route = routeCities(criteria.route);
    return (
      <section className="state-card empty-state" aria-labelledby="empty-heading">
        <div className="state-icon" aria-hidden="true">⌕</div><p className="eyebrow">No matching flights</p>
        <h2 id="empty-heading">Nothing takes off with these filters.</h2>
        <p>We searched {route.from} to {route.to} for {criteria.date}{active.length ? ` with ${active.join(", ")}` : " with all stops, airlines and prices included"}.</p>
        <a className="primary-link" href={clearFiltersUrl(criteria)}>Clear filters</a>
      </section>
    );
  }

  const route = routeCities(criteria.route);
  return (
    <div className="results-content">
      {payload.failedAirlines.length > 0 && (
        <div className="partial-banner" role="status"><span className="status-dot" aria-hidden="true" /><p><strong>Some prices may still be on their way.</strong> {payload.failedAirlines.join(" and ")} didn’t respond in time. These results are ready to compare.</p></div>
      )}
      <div className="results-toolbar">
        <div><p className="eyebrow">Your journey</p><h2>{route.from} <span aria-hidden="true">→</span> {route.to}</h2></div>
        <SortSelect value={criteria.sort} />
      </div>
      <p className="results-count" role="status" aria-live="polite">{payload.offers.length} flights found · {criteria.date} · {criteria.pax} {criteria.pax === 1 ? "traveller" : "travellers"}</p>
      <ol className="flight-list" aria-label="Flight results">
        {payload.offers.map((offer) => <li key={offer.id}><FlightCard offer={offer} criteria={criteria} /></li>)}
      </ol>
      <p className="data-note">Sample fares for assessment purposes. Final availability and fare rules are confirmed by the airline.</p>
    </div>
  );
}

function clearFiltersUrl(criteria: SearchCriteria) {
  const params = new URLSearchParams({ route: criteria.route, date: criteria.date, pax: String(criteria.pax), cabin: criteria.cabin });
  if (criteria.sort !== "recommended") params.set("sort", criteria.sort);
  return `/air/search?${params.toString()}`;
}
