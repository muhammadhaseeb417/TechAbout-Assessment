"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const routes = [
  ["KHI-DXB", "Karachi", "Dubai"],
  ["LHE-DXB", "Lahore", "Dubai"],
  ["KHI-DOH", "Karachi", "Doha"],
  ["ISB-LHR", "Islamabad", "London"],
  ["KHI-LHE", "Karachi", "Lahore"],
  ["LHE-ISB", "Lahore", "Islamabad"],
  ["ISB-KHI", "Islamabad", "Karachi"],
  ["KHI-LHR", "Karachi", "London"],
];

type Props = { route: string; date: string; pax: number; cabin: string };

export function SearchBar({ route: initialRoute, date: initialDate, pax: initialPax, cabin: initialCabin }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [route, setRoute] = useState(initialRoute);
  const [date, setDate] = useState(initialDate);
  const [pax, setPax] = useState(initialPax);
  const [cabin, setCabin] = useState(initialCabin);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set("route", route);
    params.set("date", date);
    params.set("pax", String(pax));
    params.set("cabin", cabin);
    router.push(`/air/search?${params.toString()}`);
  }

  return (
    <form className="search-form" onSubmit={submit} aria-label="Flight search">
      <label className="search-field route-field">
        <span>Route</span>
        <select value={route} onChange={(event) => setRoute(event.target.value)}>
          {routes.map(([value, from, to]) => <option key={value} value={value}>{from} ({value.split("-")[0]}) → {to} ({value.split("-")[1]})</option>)}
        </select>
      </label>
      <label className="search-field">
        <span>Departure</span>
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
      </label>
      <label className="search-field small-field">
        <span>Travellers</span>
        <select value={pax} onChange={(event) => setPax(Number(event.target.value))}>
          {Array.from({ length: 9 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1} {index === 0 ? "traveller" : "travellers"}</option>)}
        </select>
      </label>
      <label className="search-field small-field">
        <span>Cabin</span>
        <select value={cabin} onChange={(event) => setCabin(event.target.value)}>
          <option value="economy">Economy</option><option value="premium">Premium</option><option value="business">Business</option>
        </select>
      </label>
      <button className="search-submit" type="submit"><span aria-hidden="true">⌕</span> Search flights</button>
    </form>
  );
}
