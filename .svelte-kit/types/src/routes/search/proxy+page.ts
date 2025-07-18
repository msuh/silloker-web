// @ts-nocheck
import { goto } from '$app/navigation';
import { searchBarState, searchResult } from '$lib/states/search.svelte';
import { fromURLParams, type SearchableRecord } from '$lib/types/search';
import type { PageLoad } from './$types';

export const load = async ({ fetch, url }: Parameters<PageLoad>[0]) => {
  const searchRecord: SearchableRecord = fromURLParams(url.searchParams);
  if (!searchRecord.keywords) goto("/"); // Send to home if empty query

  const res = await fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ searchRecord, page: 0, size: 10 }),
  });

  if (!res.ok) throw new Error(await res.text());

  const result = await res.json();
  console.log(result);

  // Preserves $state reactivity
  Object.assign(searchResult, result);
  Object.assign(searchBarState, searchRecord);
};
