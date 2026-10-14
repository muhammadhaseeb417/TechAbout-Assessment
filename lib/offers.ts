import offers from "@/data/offers.json";
import type { SearchCriteria } from "@/lib/search";

export type Offer = (typeof offers)[number];
export type OffersResponse = {
  offers: Offer[];
  failedAirlines: string[];
  simulate: string;
};

export class OffersServiceError extends Error {
  status = 503;

  constructor() {
    super("Our airline partners did not respond in time.");
    this.name = "OffersServiceError";
  }
}

const defaultFailedAirlines = ["Oman Air", "Etihad Airways"];
const cabinMultipliers: Record<string, number> = { economy: 1, premium: 1.8, business: 3.2 };

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function selectedOffers(criteria: SearchCriteria): Offer[] {
  const airlineNames = new Set(criteria.airlines);
  const cabinMultiplier = cabinMultipliers[criteria.cabin] ?? 1;
  const all = offers
    .filter((offer) => criteria.route === "ALL" || offer.route === criteria.route)
    .filter((offer) => criteria.stops === "all" || (criteria.stops === "nonstop" ? offer.stops === 0 : offer.stops === 1))
    .filter((offer) => airlineNames.size === 0 || airlineNames.has(offer.airline))
    .filter((offer) => offer.price * cabinMultiplier >= criteria.priceMin && offer.price * cabinMultiplier <= criteria.priceMax);

  if (criteria.sort === "price") return all.sort((a, b) => a.price - b.price);
  if (criteria.sort === "fastest") return all.sort((a, b) => a.durationMinutes - b.durationMinutes);
  if (criteria.sort === "departure") return all.sort((a, b) => a.departureLocal.localeCompare(b.departureLocal));
  return all.sort((a, b) => Number(a.stops > 0) - Number(b.stops > 0) || a.price - b.price);
}

export async function getOffers(criteria: SearchCriteria): Promise<OffersResponse> {
  if (criteria.simulate === "slow") await wait(2500);
  else await wait(criteria.simulate === "ok" ? 1200 : 1200 + Math.floor(Math.random() * 1301));

  if (criteria.simulate === "error") throw new OffersServiceError();
  if (criteria.simulate === "empty") return { offers: [], failedAirlines: [], simulate: criteria.simulate };

  const matched = selectedOffers(criteria);
  return {
    offers: matched,
    failedAirlines: criteria.simulate === "ok" ? [] : defaultFailedAirlines,
    simulate: criteria.simulate,
  };
}
