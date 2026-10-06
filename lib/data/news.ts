import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import { collectAll } from "#/lib/api/paginate.ts";
import type { Announcement, NewsItem } from "#/lib/api/schemas.ts";

/**
 * Items per page of the news list, a website decision, unrelated to the api's page size cap.
 *
 * The news list, its featured item and an article's "Latest news" band all draw on the announcements feed - news,
 * opportunities and funding calls in one - rather than on news alone, as the stakeholders asked: opportunities and
 * funding calls are listed on their own pages as well, but are news to the site's readers too.
 */
export const newsPageSize = 10;

export interface NewsPage {
	items: Array<Announcement>;
	/** 1-based. */
	page: number;
	pages: number;
	total: number;
	/**
	 * Whether the featured item leads the page, above the list - only ever on the first page. Without it, the list's
	 * first card is the top of the page, and the largest image above the fold.
	 */
	isFeaturedShown: boolean;
}

function pageCount(total: number): number {
	return Math.max(1, Math.ceil(total / newsPageSize));
}

/**
 * One page of the news list, or `null` when `page` is out of range. Each page is its own cache entry, keyed by the
 * argument; the feed's tags invalidate all of them at once, which is what a new item at the top requires anyway, since
 * it shifts every page.
 *
 * The featured item, which the first page leads with (see `getFeaturedNewsItem`), is left out of the list when it would
 * be listed on that page too - it usually is, being one of the newest - and every later page moves up by one, so each
 * still holds a full page. An older featured item stays where it is: it is not on the page it leads, and finding its
 * place would mean walking the feed. Should the featured item fail to load, the list is left as it is, as the first
 * page then does without it too.
 */
export async function getNewsPage(page: number): Promise<NewsPage | null> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getAnnouncements.cacheTags(), ...api.getFeaturedEntities.cacheTags());

	if (!Number.isInteger(page) || page < 1) {
		return null;
	}

	/** One more than a page, so the first page is still full without the featured item. */
	const head = await getAnnouncements(0, newsPageSize + 1);
	const featured = await getFeaturedNewsItem().catch(() => null);
	const isFeaturedListed = featured != null && head.data.slice(0, newsPageSize).some((item) => item.id === featured.id);

	const total = isFeaturedListed ? head.total - 1 : head.total;
	const pages = pageCount(total);

	if (page > pages) {
		return null;
	}

	if (page === 1) {
		const items = isFeaturedListed ? head.data.filter((item) => item.id !== featured.id) : head.data;

		return { items: items.slice(0, newsPageSize), page, pages, total, isFeaturedShown: featured != null };
	}

	const offset = (page - 1) * newsPageSize + (isFeaturedListed ? 1 : 0);
	const { data } = await getAnnouncements(offset, newsPageSize);

	return { items: data, page, pages, total, isFeaturedShown: false };
}

/** A slice of the announcements feed, shared by the pages of the news list which need it. */
async function getAnnouncements(offset: number, limit: number): Promise<{ data: Array<Announcement>; total: number }> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getAnnouncements.cacheTags());

	const result = await api.getAnnouncements.request({ searchParams: { limit, offset } });

	const { data, total } = result.unwrap().data;

	return { data, total };
}

/** How many announcements an article's "Latest news" band shows. */
export const latestNewsCount = 4;

/**
 * The newest announcements, for an article's "Latest news" band: one more than the band shows, so the article's own
 * item can be left out of it and still leave enough. A single cache entry for every article, rather than one per slug.
 */
export async function getLatestNews(): Promise<Array<Announcement>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getAnnouncements.cacheTags());

	const result = await api.getAnnouncements.request({ searchParams: { limit: latestNewsCount + 1, offset: 0 } });

	return result.unwrap().data.data;
}

/**
 * The announcement the news list leads with: the first featured one, of whichever type - the list is the announcements
 * feed (see `newsPageSize`) - or `null` when none is featured.
 */
export async function getFeaturedNewsItem(): Promise<Announcement | null> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getFeaturedEntities.cacheTags());

	const result = await api.getFeaturedEntities.request();

	return result.unwrap().data.data.news[0] ?? null;
}

/** A news item by slug, or `null` when there is none. */
export async function getNewsItemBySlug(slug: string): Promise<NewsItem | null> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getNewsItemBySlug.cacheTags());

	const result = await api.getNewsItemBySlug.request({ params: { slug } });

	if (result.isErr() && result.error._tag === "HttpError" && result.error.response.status === 404) {
		return null;
	}

	return result.unwrap().data;
}

/** Every published news item slug, for `generateStaticParams`. */
export async function getNewsItemSlugs(): Promise<Array<string>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getNewsItemSlugs.cacheTags());

	const result = await collectAll((cursor) => api.getNewsItemSlugs.request({ searchParams: cursor }));

	return result.unwrap().map((item) => item.entity.slug);
}
