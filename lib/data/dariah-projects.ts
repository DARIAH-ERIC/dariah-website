import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import { collectAll } from "#/lib/api/paginate.ts";
import type { DariahProject, DariahProjectBase } from "#/lib/api/schemas.ts";

export type DariahProjectStatus = NonNullable<api.getDariahProjects.SearchParams["status"]>;

/** Every DARIAH project with the given status, one cache entry per status. See `#/lib/data/working-groups.ts`. */
export async function getDariahProjects(status: DariahProjectStatus): Promise<Array<DariahProjectBase>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getDariahProjects.cacheTags());

	const result = await collectAll((cursor) => api.getDariahProjects.request({ searchParams: { ...cursor, status } }));

	return result.unwrap();
}

/** A DARIAH project by slug, or `null` when there is none. */
export async function getDariahProjectBySlug(slug: string): Promise<DariahProject | null> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getDariahProjectBySlug.cacheTags());

	const result = await api.getDariahProjectBySlug.request({ params: { slug } });

	if (result.isErr() && result.error._tag === "HttpError" && result.error.response.status === 404) {
		return null;
	}

	return result.unwrap().data;
}

/** Every published DARIAH project slug, for `generateStaticParams`. */
export async function getDariahProjectSlugs(): Promise<Array<string>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getDariahProjectSlugs.cacheTags());

	const result = await collectAll((cursor) => api.getDariahProjectSlugs.request({ searchParams: cursor }));

	return result.unwrap().map((item) => item.entity.slug);
}
