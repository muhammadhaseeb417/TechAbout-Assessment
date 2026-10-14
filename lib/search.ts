export type SearchParams = Record<string, string | string[] | undefined>;

export type SearchCriteria = {
  route: string;
  date: string;
  pax: number;
  cabin: string;
  stops: string;
  airlines: string[];
  priceMin: number;
  priceMax: number;
  sort: string;
  simulate: string;
};

const knownSimulations = new Set(["ok", "slow", "error", "empty", "partial"]);

export function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function criteriaFromParams(params: SearchParams): SearchCriteria {
  const price = first(params.price)?.split("-").map(Number) ?? [];
  const rawPax = Number(first(params.pax) ?? 1);
  const today = new Date().toISOString().slice(0, 10);
  const simulate = first(params.simulate) ?? "partial";

  return {
    route: (first(params.route) ?? "KHI-DXB").toUpperCase(),
    date: first(params.date) ?? today,
    pax: Number.isFinite(rawPax) ? Math.min(9, Math.max(1, rawPax)) : 1,
    cabin: first(params.cabin) ?? "economy",
    stops: first(params.stops) ?? "all",
    airlines: (first(params.airlines) ?? "").split(",").filter(Boolean),
    priceMin: Number.isFinite(price[0]) ? price[0] : 0,
    priceMax: Number.isFinite(price[1]) ? price[1] : 400000,
    sort: first(params.sort) ?? "recommended",
    simulate: knownSimulations.has(simulate) ? simulate : "partial",
  };
}

export function criteriaKey(criteria: SearchCriteria): string {
  return [criteria.route, criteria.date, criteria.pax, criteria.cabin, criteria.stops, criteria.airlines.join(","), criteria.priceMin, criteria.priceMax, criteria.sort].join("|");
}

export function formatPKR(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    currencyDisplay: "code",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function routeCities(route: string): { from: string; to: string; fromCode: string; toCode: string } {
  const [fromCode = "KHI", toCode = "DXB"] = route.split("-");
  const cities: Record<string, string> = {
    KHI: "Karachi", LHE: "Lahore", ISB: "Islamabad", DXB: "Dubai", LHR: "London", DOH: "Doha",
  };
  return { from: cities[fromCode] ?? fromCode, to: cities[toCode] ?? toCode, fromCode, toCode };
}
