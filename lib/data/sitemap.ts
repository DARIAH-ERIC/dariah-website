import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import type { SitemapEntry } from "#/lib/api/schemas.ts";

/**
 * Every website url derived from published content, with the timestamp of its most recent publish. Listing pages which
 * are not backed by content are not included.
 */
export async function getContentSitemapEntries(): Promise<Array<SitemapEntry>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getSitemap.cacheTags());

	const result = await api.getSitemap.request();

	return result.unwrap().data.data;
}
