import { Suspense } from "react";
import { SearchBar } from "@/components/search-bar";
import { SearchFilters } from "@/components/search-filters";
import { FlightResults } from "@/components/flight-results";
import { criteriaFromParams, criteriaKey, type SearchParams } from "@/lib/search";

export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const criteria = criteriaFromParams(await searchParams);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="/air/search" aria-label="Travel.pk home"><span className="brand-icon" aria-hidden="true">t</span>travel<span>.pk</span></a>
        <nav aria-label="Main navigation"><a href="/air/search" aria-current="page">Flights</a><a href="/air/flights/karachi-to-dubai">Explore</a><a href="#support">Support</a></nav>
        <div className="header-note"><span className="header-dot" aria-hidden="true" /> Sample fares in PKR</div>
      </header>

      <section className="search-hero">
        <div className="page-shell">
          <div className="breadcrumb"><a href="/air/search">Flights</a><span aria-hidden="true">/</span><span>Search results</span></div>
          <div className="hero-heading"><div><p className="eyebrow">Find your way there</p><h1>Good trips start<br className="desktop-break" /> with a clear choice.</h1></div><p>Compare the full journey — fare, flight time and what’s included — before you choose.</p></div>
          <SearchBar key={`${criteria.route}|${criteria.date}|${criteria.pax}|${criteria.cabin}`} route={criteria.route} date={criteria.date} pax={criteria.pax} cabin={criteria.cabin} />
          <div className="trust-row"><span>● Fares shown in PKR</span><span>● Local departure times</span><span>● Compare baggage upfront</span></div>
        </div>
      </section>

      <section className="results-section page-shell" aria-label="Flight search results">
        <SearchFilters key={criteriaKey(criteria)} criteria={criteria} />
        <div className="results-column">
          <Suspense fallback={<ResultsSkeleton />}><FlightResults criteria={criteria} /></Suspense>
        </div>
      </section>
      <footer className="site-footer" id="support"><div className="page-shell"><strong>travel.pk</strong><span>Designed for better journeys from Pakistan.</span><a href="mailto:hello@example.test">Need help with your trip?</a></div></footer>
    </main>
  );
}

function ResultsSkeleton() {
  return <div className="results-skeleton" role="status" aria-label="Loading flight results">
    <div className="skeleton-heading"><span /><span /></div>
    <div className="skeleton-card"><span /><span /><span /><span /></div>
    <div className="skeleton-card"><span /><span /><span /><span /></div>
    <p className="sr-only">Checking current sample fares from airline partners…</p>
  </div>;
}
