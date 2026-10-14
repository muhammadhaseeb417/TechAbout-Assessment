"use client";

import { FormEvent, KeyboardEvent as ReactKeyboardEvent, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SearchCriteria } from "@/lib/search";

const airlines = ["Pakistan International Airlines", "flydubai", "Emirates", "Airblue", "SereneAir", "Qatar Airways", "Etihad Airways", "Oman Air", "SalamAir"];

function FilterFields({ criteria, onApply }: { criteria: SearchCriteria; onApply?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams(searchParams.toString());
    params.set("stops", String(form.get("stops")));
    const selectedAirlines = form.getAll("airlines").map(String);
    if (selectedAirlines.length) params.set("airlines", selectedAirlines.join(","));
    else params.delete("airlines");
    const min = Math.max(0, Number(form.get("priceMin")) || 0);
    const max = Math.max(min, Number(form.get("priceMax")) || 400000);
    params.set("price", `${min}-${max}`);
    router.push(`/air/search?${params.toString()}`);
    onApply?.();
  }

  return (
    <form className="filter-form" onSubmit={submit}>
      <fieldset>
        <legend>Stops</legend>
        {["all", "nonstop", "1stop"].map((value) => (
          <label className="check-row" key={value}>
            <input name="stops" type="radio" value={value} defaultChecked={criteria.stops === value} />
            <span>{value === "all" ? "Any number" : value === "nonstop" ? "Nonstop" : "1 stop"}</span>
          </label>
        ))}
      </fieldset>
      <fieldset>
        <legend>Airlines</legend>
        <div className="filter-options">
          {airlines.map((airline, index) => (
            <label className="check-row" key={airline}>
              <input name="airlines" type="checkbox" value={airline} defaultChecked={criteria.airlines.includes(airline)} />
              <span>{airline}</span><span className="airline-count">{Math.max(1, 4 - (index % 5))}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>Price per traveller</legend>
        <div className="price-fields">
          <label><span>Minimum PKR</span><input name="priceMin" type="number" min="0" step="500" defaultValue={criteria.priceMin} /></label>
          <span aria-hidden="true">to</span>
          <label><span>Maximum PKR</span><input name="priceMax" type="number" min="0" step="500" defaultValue={criteria.priceMax === 400000 ? 400000 : criteria.priceMax} /></label>
        </div>
      </fieldset>
      <button className="apply-filters" type="submit">Show flights</button>
    </form>
  );
}

export function SearchFilters({ criteria }: { criteria: SearchCriteria }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("stops");
    params.delete("airlines");
    params.delete("price");
    router.push(`/air/search?${params.toString()}`);
    dialogRef.current?.close();
  }

  function openFilters() {
    dialogRef.current?.showModal();
    dialogRef.current?.querySelector<HTMLElement>(".dialog-close")?.focus();
  }

  function containDialogFocus(event: ReactKeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab" || !dialogRef.current) return;
    const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    )).filter((element) => element.getClientRects().length > 0);
    if (!focusable.length) {
      event.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <>
      <button className="mobile-filter-trigger" type="button" onClick={openFilters}>
        <span aria-hidden="true">☷</span> Filters
      </button>
      <aside className="filters-card desktop-filters" aria-labelledby="filters-heading">
        <div className="filters-heading"><h2 id="filters-heading">Filters</h2><button type="button" className="text-button" onClick={clearFilters}>Clear all</button></div>
        <FilterFields criteria={criteria} />
      </aside>
      <dialog className="filter-dialog" ref={dialogRef} aria-labelledby="mobile-filters-heading" onKeyDown={containDialogFocus} onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current?.close(); }}>
        <div className="dialog-content">
          <div className="filters-heading"><h2 id="mobile-filters-heading">Filters</h2><button className="dialog-close" type="button" onClick={() => dialogRef.current?.close()} aria-label="Close filters">×</button></div>
          <FilterFields criteria={criteria} onApply={() => dialogRef.current?.close()} />
          <button type="button" className="text-button dialog-clear" onClick={clearFilters}>Clear all filters</button>
        </div>
      </dialog>
    </>
  );
}
