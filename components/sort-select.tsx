"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SortSelect({ value }: { value: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <label className="sort-control">
      <span>Sort by</span>
      <select value={value} onChange={(event) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", event.target.value);
        router.push(`/air/search?${params.toString()}`);
      }}>
        <option value="recommended">Recommended</option><option value="price">Lowest price</option><option value="fastest">Fastest</option><option value="departure">Departure time</option>
      </select>
    </label>
  );
}
