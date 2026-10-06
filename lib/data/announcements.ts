import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import type { Announcement } from "#/lib/api/schemas.ts";
import { type Href, href } from "#/lib/navigation/href.ts";

/** Number of announcements the landing page fetches: it shows all four, except in its three-column layout. */
export const latestAnnouncementsCount = 4;

export interface LatestAnnouncement {
	item: Announcement;
	isFeatured: boolean;
}

/**
 * The latest announcements for the landing page: news, opportunities and funding calls in one feed, featured items
 * first, in their configured order, followed by the most recent other announcements.
 */
export async function getLatestAnnouncements(): Promise<Array<LatestAnnouncement>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getAnnouncements.cacheTags(), ...api.getFeaturedEntities.cacheTags());

	const [featuredResult, latestResult] = await Promise.all([
		api.getFeaturedEntities.request(),
		/**
		 * Featured items may be among the latest as well and are dropped from them below. Fillers are only needed when
		 * fewer than `latestAnnouncementsCount` items are featured, so at most `latestAnnouncementsCount - 1` rows are lost
		 * to deduplication; over-fetch by that many.
		 */
		api.getAnnouncements.request({ searchParams: { limit: latestAnnouncementsCount * 2 - 1 } }),
	]);

	const featured = featuredResult.unwrap().data.data.news.slice(0, latestAnnouncementsCount);
	const featuredIds = new Set(featured.map((item) => item.id));

	const latest = latestResult.unwrap().data.data.filter((item) => !featuredIds.has(item.id));

	return [
		...featured.map((item) => {
			return { item, isFeatured: true };
		}),
		...latest.map((item) => {
			return { item, isFeatured: false };
		}),
	].slice(0, latestAnnouncementsCount);
}

/** An announcement's detail page, by its type. */
export function announcementHref(item: Announcement): Href {
	const params = { slug: item.entity.slug };

	switch (item.type) {
		case "news": {
			return href({ pathname: "/news/[slug]", params });
		}

		case "opportunities": {
			return href({ pathname: "/get-involved/opportunities/[slug]", params });
		}

		case "funding_calls": {
			return href({ pathname: "/get-involved/funding-calls/[slug]", params });
		}
	}
}
