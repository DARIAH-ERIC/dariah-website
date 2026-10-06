import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import type { SiteMetadata } from "#/lib/api/schemas.ts";

/** Site title, description and social media links. Rendered in the root layout, so part of every route's app shell. */
export async function getSiteMetadata(): Promise<SiteMetadata> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getSiteMetadata.cacheTags());

	const result = await api.getSiteMetadata.request();

	return result.unwrap().data;
}
