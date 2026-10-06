import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import { collectAll } from "#/lib/api/paginate.ts";
import type { MemberOrPartner, MemberOrPartnerListItem } from "#/lib/api/schemas.ts";
import { today } from "#/lib/data/events.ts";

/** Every member or partner, collected across all pages into one cache entry. */
export async function getMembersAndPartners(): Promise<Array<MemberOrPartnerListItem>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getMembersAndPartners.cacheTags());

	const result = await collectAll((cursor) => api.getMembersAndPartners.request({ searchParams: { ...cursor } }));

	return result.unwrap();
}

/**
 * A member or partner by slug, or `null` when there is none. A website or social media link whose `duration` has ended
 * is left out, e.g. a consortium's former website: the api keeps it as a record, but it is no longer theirs to link
 * to.
 */
export async function getMemberOrPartnerBySlug(slug: string): Promise<MemberOrPartner | null> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getMemberOrPartnerBySlug.cacheTags());

	const result = await api.getMemberOrPartnerBySlug.request({ params: { slug } });

	if (result.isErr() && result.error._tag === "HttpError" && result.error.response.status === 404) {
		return null;
	}

	const item = result.unwrap().data;
	const cutoff = today();

	return {
		...item,
		socialMedia: item.socialMedia.filter(
			(link) => link.duration?.end == null || link.duration.end.slice(0, 10) >= cutoff,
		),
	};
}

/** Every published member or partner slug, for `generateStaticParams`. */
export async function getMemberOrPartnerSlugs(): Promise<Array<string>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getMemberOrPartnerSlugs.cacheTags());

	const result = await collectAll((cursor) => api.getMemberOrPartnerSlugs.request({ searchParams: cursor }));

	return result.unwrap().map((item) => item.entity.slug);
}
