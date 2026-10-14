import { NextRequest, NextResponse } from "next/server";
import { getOffers, OffersServiceError } from "@/lib/offers";
import { criteriaFromParams } from "@/lib/search";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const criteria = criteriaFromParams({ ...params, route: request.nextUrl.searchParams.has("route") ? params.route : "ALL" });

  try {
    const response = await getOffers(criteria);
    return NextResponse.json(response, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error) {
    if (error instanceof OffersServiceError) {
      return NextResponse.json({ message: "Some airline partners are taking a break. Please try again." }, {
        status: 503,
        headers: { "Cache-Control": "no-store, max-age=0" },
      });
    }
    return NextResponse.json({ message: "We could not complete this search." }, { status: 500 });
  }
}
