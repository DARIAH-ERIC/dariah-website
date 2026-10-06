import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import { collectAll } from "#/lib/api/paginate.ts";
import type { Person } from "#/lib/api/schemas.ts";

/** A person by slug, or `null` when there is none. */
export async function getPersonBySlug(slug: string): Promise<Person | null> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getPersonBySlug.cacheTags());

	const result = await api.getPersonBySlug.request({ params: { slug } });

	if (result.isErr() && result.error._tag === "HttpError" && result.error.response.status === 404) {
		return null;
	}

	return result.unwrap().data;
}

/** Every published person slug, for `generateStaticParams`. */
export async function getPersonSlugs(): Promise<Array<string>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getPersonSlugs.cacheTags());

	const result = await collectAll((cursor) => api.getPersonSlugs.request({ searchParams: cursor }));

	return result.unwrap().map((item) => item.entity.slug);
}
