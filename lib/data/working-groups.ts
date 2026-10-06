import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import { collectAll } from "#/lib/api/paginate.ts";
import type { WorkingGroup, WorkingGroupBase } from "#/lib/api/schemas.ts";

export type WorkingGroupStatus = NonNullable<api.getWorkingGroups.SearchParams["status"]>;

/**
 * Every working group with the given status. The list operation is paginated and caps its page size, so all pages are
 * collected into one cache entry per status - the entry is keyed by the argument.
 *
 * Cached with the tags the operation reads, until the revalidation webhook delivers one of them; see
 * `#/lib/data/pages.ts` for the rationale of the lifetime and the unwrapping.
 */
export async function getWorkingGroups(status: WorkingGroupStatus): Promise<Array<WorkingGroupBase>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getWorkingGroups.cacheTags());

	const result = await collectAll((cursor) => api.getWorkingGroups.request({ searchParams: { ...cursor, status } }));

	return result.unwrap();
}

/** A working group by slug, or `null` when there is none. */
export async function getWorkingGroupBySlug(slug: string): Promise<WorkingGroup | null> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getWorkingGroupBySlug.cacheTags());

	const result = await api.getWorkingGroupBySlug.request({ params: { slug } });

	if (result.isErr() && result.error._tag === "HttpError" && result.error.response.status === 404) {
		return null;
	}

	return result.unwrap().data;
}

/** Every published working group slug, for `generateStaticParams`. */
export async function getWorkingGroupSlugs(): Promise<Array<string>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getWorkingGroupSlugs.cacheTags());

	const result = await collectAll((cursor) => api.getWorkingGroupSlugs.request({ searchParams: cursor }));

	return result.unwrap().map((item) => item.entity.slug);
}
