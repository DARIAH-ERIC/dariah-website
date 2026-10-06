import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import { collectAll } from "#/lib/api/paginate.ts";
import type { GovernanceBody, GovernanceBodyBase } from "#/lib/api/schemas.ts";

const minorWords = new Set(["a", "an", "and", "as", "at", "by", "for", "in", "of", "on", "or", "the", "to"]);

/**
 * A body's name in title case, as the proper name it is: the api has some in sentence case ("Joint research
 * committee"). Only first letters are raised, so acronyms stay as they are, and short words stay lower case after the
 * first.
 */
function toTitleCase(name: string): string {
	return name.replaceAll(/\p{L}+/gu, (word, offset: number) => {
		if (offset > 0 && minorWords.has(word)) {
			return word;
		}

		return word.charAt(0).toUpperCase() + word.slice(1);
	});
}

/** Every governance body, collected across all pages into one cache entry. */
export async function getGovernanceBodies(): Promise<Array<GovernanceBodyBase>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getGovernanceBodies.cacheTags());

	const result = await collectAll((cursor) => api.getGovernanceBodies.request({ searchParams: { ...cursor } }));

	return result.unwrap().map((item) => Object.assign(item, { name: toTitleCase(item.name) }));
}

/** A governance body by slug, or `null` when there is none. */
export async function getGovernanceBodyBySlug(slug: string): Promise<GovernanceBody | null> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getGovernanceBodyBySlug.cacheTags());

	const result = await api.getGovernanceBodyBySlug.request({ params: { slug } });

	if (result.isErr() && result.error._tag === "HttpError" && result.error.response.status === 404) {
		return null;
	}

	const item = result.unwrap().data;

	return Object.assign(item, { name: toTitleCase(item.name) });
}

/** Every published governance body slug, for `generateStaticParams`. */
export async function getGovernanceBodySlugs(): Promise<Array<string>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getGovernanceBodySlugs.cacheTags());

	const result = await collectAll((cursor) => api.getGovernanceBodySlugs.request({ searchParams: cursor }));

	return result.unwrap().map((item) => item.entity.slug);
}
