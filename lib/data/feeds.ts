import "server-only";

import { parseDate } from "@internationalized/date";
import type { DateTimeFormatOptions } from "next-intl";
import { getFormatter, getExtracted as getTranslations } from "next-intl/server";
import { cacheLife, cacheTag } from "next/cache";
import { type Channel, type Entry, rss } from "xast-util-feed";
import { toXml } from "xast-util-to-xml";

import { env } from "#/configs/env.config.ts";
import * as api from "#/lib/api/endpoints.ts";
import { collectAll } from "#/lib/api/paginate.ts";
import type { Announcement, EventBase } from "#/lib/api/schemas.ts";
import { announcementHref } from "#/lib/data/announcements.ts";
import { defaultLocale } from "#/lib/i18n/locales.ts";
import { createCalendarFeed } from "#/lib/ics.ts";
import { type Href, href, serializeHref, unsafeHref } from "#/lib/navigation/href.ts";

/** Number of entries in each feed. Feed readers remember what they have seen, so this only has to outlast a poll gap. */
const feedSize = 20;

/** How long the cdn may keep an events feed, so new events show up within the hour without a purge. */
const eventsFeedMaxAgeSeconds = 3600;

/**
 * How often calendar apps are asked to poll the calendar feed: events are announced weeks ahead and rarely change, so a
 * day's delay costs subscribers nothing, unlike the cdn's hour, which only spares the api.
 */
const calendarFeedRefreshIntervalSeconds = 24 * 60 * 60;

/** How far back the calendar feed reaches, so attended events stay in subscribers' calendars for a while. */
const calendarFeedHistoryMonths = 6;

/** Feeds are fetched by readers, not rendered in a request, so the locale is fixed rather than negotiated. */
const locale = defaultLocale;

/** The pathnames of the feeds' route handlers. */
const feedPathnames = {
	news: "/feeds/news.xml",
	events: "/feeds/events.xml",
} as const;

export type FeedName = keyof typeof feedPathnames;

/** The pathname of the calendar feed's route handler, which is not an rss feed, so not one of `feedPathnames`. */
const calendarFeedPathname = "/feeds/events.ics";

async function getFeedTitles(siteTitle: string): Promise<Record<FeedName, string>> {
	const t = await getTranslations({ locale });

	return {
		news: t("{title}: News", { title: siteTitle }),
		events: t("{title}: Events", { title: siteTitle }),
	};
}

export interface FeedLink {
	title: string;
	/** Relative to the site's base url. */
	url: string;
}

/** Every feed, for the `<link rel="alternate">` elements which let browsers and feed readers discover them. */
export async function getFeedLinks(): Promise<Array<FeedLink>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getSiteMetadata.cacheTags());

	const siteMetadataResult = await api.getSiteMetadata.request();
	const titles = await getFeedTitles(siteMetadataResult.unwrap().data.title);

	return [
		{ title: titles.news, url: feedPathnames.news },
		{ title: titles.events, url: feedPathnames.events },
	];
}

/** Route handlers are not part of the generated `Pathname` union, so the feeds' own urls go through `unsafeHref`. */
function absoluteUrl(value: Href): string {
	return new URL(serializeHref(value), env.NEXT_PUBLIC_APP_BASE_URL).href;
}

/** A feed's url, relative, for the visible links to it on the pages it syndicates - see `FeedLink`. */
export function getFeedHref(name: FeedName): Href {
	return unsafeHref(feedPathnames[name], false);
}

/** The calendar feed's url, absolute, for the events pages' menu of ways to subscribe to it - see `SubscribeMenu`. */
export function getCalendarFeedUrl(): string {
	return absoluteUrl(unsafeHref(calendarFeedPathname, false));
}

function serialize(channel: Channel, entries: Array<Entry>): string {
	return toXml(rss(channel, entries));
}

/** The news feed as rss: news, opportunities and funding calls, the same announcements the news page lists. */
export async function getNewsFeed(): Promise<string> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getAnnouncements.cacheTags(), ...api.getSiteMetadata.cacheTags());

	const t = await getTranslations({ locale });

	const [announcementsResult, siteMetadataResult] = await Promise.all([
		api.getAnnouncements.request({ searchParams: { limit: feedSize } }),
		api.getSiteMetadata.request(),
	]);

	const announcements = announcementsResult.unwrap().data.data;
	const siteMetadata = siteMetadataResult.unwrap().data;

	const categories: Record<Announcement["type"], string> = {
		news: t("News"),
		opportunities: t("Opportunities"),
		funding_calls: t("Funding calls"),
	};

	const entries = announcements.map((item): Entry => {
		return {
			title: item.title,
			description: item.summary,
			url: absoluteUrl(announcementHref(item)),
			published: item.publishedAt,
			tags: [categories[item.type]],
		};
	});

	const titles = await getFeedTitles(siteMetadata.title);

	return serialize(
		{
			title: titles.news,
			description: siteMetadata.description,
			url: absoluteUrl(href({ pathname: "/news" })),
			feedUrl: absoluteUrl(unsafeHref(feedPathnames.news, false)),
			lang: locale,
		},
		entries,
	);
}

/**
 * The events feed as rss: the events not yet over on `from`, `YYYY-MM-DD`, soonest first, dated by publication so
 * readers surface newly announced ones. `from` is today, read at request time by the feed's route, so an entry is
 * cached per day, and an event which is over never stays in the feed until the entry is refreshed.
 */
export async function getEventsFeed(from: string): Promise<string> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getEvents.cacheTags(), ...api.getSiteMetadata.cacheTags());

	const format = await getFormatter({ locale });

	const [eventsResult, siteMetadataResult] = await Promise.all([
		api.getEvents.request({ searchParams: { from, limit: feedSize } }),
		api.getSiteMetadata.request(),
	]);

	const events = eventsResult.unwrap().data.data;
	const siteMetadata = siteMetadataResult.unwrap().data;

	/** Event dates are UTC standing in for the event's own timezone, so they are formatted in UTC, not converted. */
	function formatDuration(event: EventBase): string {
		const options: DateTimeFormatOptions = event.isFullDay
			? { dateStyle: "long", timeZone: "UTC" }
			: { dateStyle: "long", timeStyle: "short", timeZone: "UTC" };

		const start = new Date(event.duration.start);

		if (event.duration.end == null) {
			return format.dateTime(start, options);
		}

		return format.dateTimeRange(start, new Date(event.duration.end), options);
	}

	const entries = events.map((event): Entry => {
		const details = [formatDuration(event), event.location].filter((value) => value.length > 0).join(", ");

		return {
			title: event.title,
			description: `${details}\n\n${event.summary}`,
			url: absoluteUrl(href({ pathname: "/events/[slug]", params: { slug: event.entity.slug } })),
			published: event.publishedAt,
		};
	});

	const titles = await getFeedTitles(siteMetadata.title);

	return serialize(
		{
			title: titles.events,
			description: siteMetadata.description,
			url: absoluteUrl(href({ pathname: "/events" })),
			feedUrl: absoluteUrl(unsafeHref(feedPathnames.events, false)),
			lang: locale,
		},
		entries,
	);
}

/** Seconds until the next utc day, when `today()` changes. */
function secondsUntilTomorrow(now: Date): number {
	const tomorrow = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);

	return Math.ceil((tomorrow - now.getTime()) / 1000);
}

/**
 * The `cache-control` header of the events feeds, which list events relative to today. Feed readers and calendar apps
 * poll, so the cdn keeps a response for up to an hour, but never past midnight, utc, so it never lags a day behind.
 */
export function getEventsFeedCacheControl(now: Date): string {
	const maxAge = Math.min(eventsFeedMaxAgeSeconds, secondsUntilTomorrow(now));

	return `public, s-maxage=${String(maxAge)}`;
}

/**
 * The events feed as an icalendar feed for calendar apps to subscribe to: every event not yet over, and those which
 * ended in the last `calendarFeedHistoryMonths`, relative to `today`, `YYYY-MM-DD`. Unlike the rss feed it is not
 * capped, since a calendar app shows exactly what the feed holds and drops whatever is missing from it. `today` is read
 * at request time by the feed's route, so an entry is cached per day.
 */
export async function getEventsCalendarFeed(today: string): Promise<string> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getEvents.cacheTags(), ...api.getSiteMetadata.cacheTags());

	const from = parseDate(today).subtract({ months: calendarFeedHistoryMonths }).toString();

	const [eventsResult, siteMetadataResult] = await Promise.all([
		collectAll((cursor) => api.getEvents.request({ searchParams: { from, ...cursor } })),
		api.getSiteMetadata.request(),
	]);

	const events = eventsResult.unwrap();
	const siteMetadata = siteMetadataResult.unwrap().data;

	const titles = await getFeedTitles(siteMetadata.title);

	return createCalendarFeed({
		name: titles.events,
		description: siteMetadata.description,
		url: absoluteUrl(href({ pathname: "/events" })),
		domain: new URL(env.NEXT_PUBLIC_APP_BASE_URL).hostname,
		refreshInterval: calendarFeedRefreshIntervalSeconds,
		events: events.map((event) => {
			return {
				event,
				url: absoluteUrl(href({ pathname: "/events/[slug]", params: { slug: event.entity.slug } })),
			};
		}),
	});
}
