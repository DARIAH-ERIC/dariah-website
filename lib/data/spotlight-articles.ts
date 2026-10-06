import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import { collectAll } from "#/lib/api/paginate.ts";
import type { SpotlightArticle, SpotlightArticleBase } from "#/lib/api/schemas.ts";

/** Every spotlight article, collected across all pages into one cache entry. */
export async function getSpotlightArticles(): Promise<Array<SpotlightArticleBase>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getSpotlightArticles.cacheTags());

	const result = await collectAll((cursor) => api.getSpotlightArticles.request({ searchParams: { ...cursor } }));

	return result.unwrap();
}

/** A spotlight article by slug, or `null` when there is none. */
export async function getSpotlightArticleBySlug(slug: string): Promise<SpotlightArticle | null> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getSpotlightArticleBySlug.cacheTags());

	const result = await api.getSpotlightArticleBySlug.request({ params: { slug } });

	if (result.isErr() && result.error._tag === "HttpError" && result.error.response.status === 404) {
		return null;
	}

	return result.unwrap().data;
}

/** Every published spotlight article slug, for `generateStaticParams`. */
export async function getSpotlightArticleSlugs(): Promise<Array<string>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getSpotlightArticleSlugs.cacheTags());

	const result = await collectAll((cursor) => api.getSpotlightArticleSlugs.request({ searchParams: cursor }));

	return result.unwrap().map((item) => item.entity.slug);
}
