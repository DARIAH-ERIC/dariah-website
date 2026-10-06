import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import { collectAll } from "#/lib/api/paginate.ts";
import type { NationalConsortium } from "#/lib/api/schemas.ts";

/**
 * Every national consortium. The list operation is paginated and caps its page size, so all pages are collected into
 * one cache entry.
 *
 * Cached with the tags the operation reads, until the revalidation webhook delivers one of them; see
 * `#/lib/data/pages.ts` for the rationale of the lifetime and the unwrapping.
 */
export async function getNationalConsortia(): Promise<Array<NationalConsortium>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getNationalConsortia.cacheTags());

	const result = await collectAll((cursor) => api.getNationalConsortia.request({ searchParams: cursor }));

	return result.unwrap();
}
