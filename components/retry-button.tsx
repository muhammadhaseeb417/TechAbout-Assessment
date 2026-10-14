"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function RetryButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  return <button className="primary-button" type="button" onClick={() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("simulate");
    router.push(`/air/search?${params.toString()}`);
  }}>Retry search</button>;
}
