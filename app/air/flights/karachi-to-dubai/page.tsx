import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Karachi to Dubai flights | Travel.pk",
  description: "Plan a Karachi to Dubai trip and search sample fares in PKR.",
};

export default function KarachiDubaiPage() {
  return (
    <main className="route-guide">
      <header className="site-header"><a className="brand" href="/air/search" aria-label="Travel.pk home"><span className="brand-icon" aria-hidden="true">t</span>travel<span>.pk</span></a><nav aria-label="Main navigation"><a href="/air/search">Flights</a><a href="/air/flights/karachi-to-dubai" aria-current="page">Route guide</a></nav><span className="header-note">PKR · Pakistan</span></header>
      <section className="guide-hero"><div className="page-shell"><p className="eyebrow">Popular route · Pakistan to UAE</p><h1>Karachi <span>→</span> Dubai</h1><p>Compare the journey, then choose the fare that works for you.</p><a className="primary-link" href="/air/search?route=KHI-DXB&date=2026-11-15&pax=1&cabin=economy&simulate=ok">Search sample flights <span aria-hidden="true">↗</span></a></div></section>
      <section className="guide-content page-shell"><div className="guide-main"><p className="eyebrow">Travel notes</p><h2>Make the short hop work for your trip.</h2><p>Karachi to Dubai is a busy Gulf corridor. Compare local departure and arrival times alongside the fare, baggage allowance and change rules that apply to your itinerary.</p><div className="guide-tip-grid"><article><span>01</span><h3>Check the airport</h3><p>This guide is for Dubai International (DXB). Sharjah (SHJ) and Al Maktoum (DWC) are separate airports.</p></article><article><span>02</span><h3>Read the baggage rules</h3><p>Cabin and checked baggage vary by airline and fare. Review the allowance before you compare totals.</p></article><article><span>03</span><h3>Allow for your arrival</h3><p>Use local times to plan immigration, baggage collection and the onward trip to your stay.</p></article></div><h2>Compare the whole journey</h2><p>A low base fare may not include the checked bag you need. Check total trip cost, duration, stopovers, and fare flexibility before booking.</p></div><aside className="guide-aside"><p className="eyebrow">Route at a glance</p><strong>KHI <span>→</span> DXB</strong><p>Nonstop flights take around 3 hours in the air.</p><a href="/air/search?route=KHI-DXB&date=2026-11-15&pax=1&cabin=economy&simulate=ok">Compare sample fares <span aria-hidden="true">↗</span></a></aside></section>
      <footer className="site-footer"><div className="page-shell"><strong>travel.pk</strong><span>Sample route guide. Confirm current details before travel.</span><a href="/air/search">Search flights</a></div></footer>
    </main>
  );
}
