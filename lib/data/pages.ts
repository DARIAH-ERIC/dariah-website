import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import type { PageSlug } from "#/lib/api/page-slugs.ts";
import type { Page } from "#/lib/api/schemas.ts";

/**
 * The content of a page managed in the knowledge base, by slug, or `null` when no page has that slug.
 *
 * Cached until the revalidation webhook delivers one of the tags the operation reads - see `x-cache-tags` in the
 * openapi document, exposed as `cacheTags()` on every generated endpoint - so the lifetime is the long-lived `content`
 * profile from `next.config.ts`. The api keeps the tags narrow on purpose, and may leave out related data which is fine
 * to be stale for a while; a change there is picked up by the profile's daily background refresh instead.
 *
 * The result is unwrapped inside the cache boundary, because a `Result` is not serializable; a failed request throws,
 * which leaves no entry behind, and fails a prerender instead of baking an error into the static shell.
 *
 * The slug is narrowed to the pages known at build time - see `scripts/pages/generate.ts` - so a route asking for a
 * page which has since been renamed or deleted fails the build. The knowledge base can still change between builds,
 * hence `null` remains a possible result.
 */
export async function getPageBySlug(slug: PageSlug): Promise<Page | null> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getPageBySlug.cacheTags());

	const result = await api.getPageBySlug.request({ params: { slug } });

	if (result.isErr() && result.error._tag === "HttpError" && result.error.response.status === 404) {
		return null;
	}

	return result.unwrap().data;
}
