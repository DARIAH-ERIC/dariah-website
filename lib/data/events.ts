import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import { collectAll, pageCount, pageCursor } from "#/lib/api/paginate.ts";
import type { Event, EventBase } from "#/lib/api/schemas.ts";

/** Items per page of the events list, a website decision, unrelated to the api's page size cap. */
export const eventsPageSize = 10;

/** Which side of the anchor date the events list walks. */
export type EventsDirection = "upcoming" | "past";

export interface EventsPage {
	/** The date the timeline is split at, `YYYY-MM-DD`. */
	anchor: string;
	direction: EventsDirection;
	/** In chronological order regardless of `direction`, so the pages read as one timeline. */
	items: Array<EventBase>;
	/** 1-based, counted away from the anchor. */
	page: number;
	pages: number;
	total: number;
	/** Whether the other side of the anchor has any events, i.e. whether page 1 links across to it. */
	hasOpposite: boolean;
}

/**
 * Today's calendar date, `YYYY-MM-DD`. Event dates are UTC standing in for local time, so the day is taken in UTC as
 * well.
 */
export function today(): string {
	return new Date().toISOString().slice(0, 10);
}

/**
 * One page of the events list, walking away from `anchor` in `direction`, or `null` when `page` is out of range. The
 * api splits the timeline at the anchor so an event spanning it is `upcoming` only, and the two sides never overlap;
 * see `#/lib/data/news.ts` for the caching pattern. The anchor is part of the cache key, so it must be a resolved date,
 * not "today"; the caller resolves the default.
 */
export async function getEventsPage(params: {
	anchor: string;
	direction: EventsDirection;
	page: number;
}): Promise<EventsPage | null> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getEvents.cacheTags());

	const { anchor, direction, page } = params;

	if (!Number.isInteger(page) || page < 1) {
		return null;
	}

	const opposite: EventsDirection = direction === "upcoming" ? "past" : "upcoming";

	const [result, oppositeResult] = await Promise.all([
		api.getEvents.request({ searchParams: { anchor, direction, ...pageCursor(page, eventsPageSize) } }),
		/** Only page 1 links across the anchor, so only it needs to know whether the other side is empty. */
		page === 1 ? api.getEvents.request({ searchParams: { anchor, direction: opposite, limit: 1 } }) : null,
	]);

	const { data, total } = result.unwrap().data;
	const pages = pageCount(total, eventsPageSize);

	if (page > pages) {
		return null;
	}

	const hasOpposite = oppositeResult != null ? oppositeResult.unwrap().data.total > 0 : false;
	const items = direction === "past" ? data.toReversed() : data;

	return { anchor, direction, items, page, pages, total, hasOpposite };
}

/**
 * Every event overlapping the days `from` to `until`, both `YYYY-MM-DD` and inclusive, in chronological order - e.g.
 * the weeks a calendar month spans.
 */
export async function getEventsInRange(from: string, until: string): Promise<Array<EventBase>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getEvents.cacheTags());

	const result = await collectAll((cursor) => api.getEvents.request({ searchParams: { from, until, ...cursor } }));

	return result.unwrap();
}

/** Number of upcoming events the landing page fetches: it shows all four, except in its three-column layout. */
export const upcomingEventsCount = 4;

export interface UpcomingEvent {
	event: EventBase;
	/** Whether the event has already started, by the same cutoff as the list. */
	isOngoing: boolean;
}

/**
 * The upcoming events for the landing page: featured events first, in their configured order, followed by the soonest
 * other events. Featured events are configured by hand and the api does not check their dates, so those already over
 * are dropped here, by the same day-granular rule the api applies to `from`. The cutoff is the day the entry was cached
 * on, which the daily background refresh keeps close enough to today.
 */
export async function getUpcomingEvents(): Promise<Array<UpcomingEvent>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getEvents.cacheTags(), ...api.getFeaturedEntities.cacheTags());

	const cutoff = today();

	const [featuredResult, upcomingResult] = await Promise.all([
		api.getFeaturedEntities.request(),
		/**
		 * Featured events may occupy the top of the upcoming list as well and are dropped from it below. Fillers are only
		 * needed when fewer than `upcomingEventsCount` events are featured, so at most `upcomingEventsCount - 1` rows are
		 * lost to deduplication; over-fetch by that many.
		 */
		api.getEvents.request({ searchParams: { from: cutoff, limit: upcomingEventsCount * 2 - 1 } }),
	]);

	const featured = featuredResult
		.unwrap()
		.data.data.events.filter((event) => (event.duration.end ?? event.duration.start).slice(0, 10) >= cutoff)
		.slice(0, upcomingEventsCount);
	const featuredIds = new Set(featured.map((event) => event.id));

	const upcoming = upcomingResult.unwrap().data.data.filter((event) => !featuredIds.has(event.id));

	return [...featured, ...upcoming].slice(0, upcomingEventsCount).map((event) => {
		return { event, isOngoing: event.duration.start.slice(0, 10) <= cutoff };
	});
}

/** Where an event stands relative to a day, `YYYY-MM-DD`. */
export type EventStatus = "upcoming" | "ongoing" | "past";

/** By calendar day, as the api splits the timeline: an event is ongoing on its first and its last day. */
export function getEventStatus(event: Pick<EventBase, "duration">, now: string): EventStatus {
	if (event.duration.start.slice(0, 10) > now) {
		return "upcoming";
	}

	if ((event.duration.end ?? event.duration.start).slice(0, 10) >= now) {
		return "ongoing";
	}

	return "past";
}

export interface AdjacentEvents {
	previous: EventBase | null;
	next: EventBase | null;
}

/** Orders events by start, then by id, so events starting at the same time still follow each other. */
function compareEvents(a: Pick<EventBase, "duration" | "id">, b: Pick<EventBase, "duration" | "id">): number {
	if (a.duration.start !== b.duration.start) {
		return a.duration.start < b.duration.start ? -1 : 1;
	}

	return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

/**
 * The events either side of `event`, by start - the order the events list walks. The api filters by calendar day, so
 * each side is fetched from the event's own start day inclusive, and the event itself and the other events on the wrong
 * side of it that day are dropped here. The next one is looked for among the events not yet over on the start day,
 * which includes long-running ones that started earlier; one page of those is plenty.
 */
export async function getAdjacentEvents(event: Pick<EventBase, "duration" | "id">): Promise<AdjacentEvents> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getEvents.cacheTags());

	const day = event.duration.start.slice(0, 10);

	const [previousResult, nextResult] = await Promise.all([
		api.getEvents.request({ searchParams: { until: day, limit: api.maxPageSize } }),
		api.getEvents.request({ searchParams: { anchor: day, direction: "upcoming", limit: api.maxPageSize } }),
	]);

	const previous = previousResult
		.unwrap()
		.data.data.filter((other) => compareEvents(other, event) < 0)
		.reduce<EventBase | null>(
			(latest, other) => (latest == null || compareEvents(other, latest) > 0 ? other : latest),
			null,
		);
	const next = nextResult
		.unwrap()
		.data.data.filter((other) => compareEvents(other, event) > 0)
		.reduce<EventBase | null>(
			(soonest, other) => (soonest == null || compareEvents(other, soonest) < 0 ? other : soonest),
			null,
		);

	return { previous, next };
}

/** A event by slug, or `null` when there is none. */
export async function getEventBySlug(slug: string): Promise<Event | null> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getEventBySlug.cacheTags());

	const result = await api.getEventBySlug.request({ params: { slug } });

	if (result.isErr() && result.error._tag === "HttpError" && result.error.response.status === 404) {
		return null;
	}

	return result.unwrap().data;
}

/** Every published event slug, for `generateStaticParams`. */
export async function getEventSlugs(): Promise<Array<string>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getEventSlugs.cacheTags());

	const result = await collectAll((cursor) => api.getEventSlugs.request({ searchParams: cursor }));

	return result.unwrap().map((item) => item.entity.slug);
}
