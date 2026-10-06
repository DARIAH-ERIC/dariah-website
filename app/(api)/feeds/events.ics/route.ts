import { connection } from "next/server";

import { today } from "#/lib/data/events.ts";
import { getEventsCalendarFeed, getEventsFeedCacheControl } from "#/lib/data/feeds.ts";

/**
 * The events as a calendar feed to subscribe to, which replaces the legacy website's `/events/?ical=1`. Rendered per
 * request, since the feed lists events relative to today - see `getEventsCalendarFeed`.
 */
export async function GET(): Promise<Response> {
	await connection();

	const feed = await getEventsCalendarFeed(today());

	return new Response(feed, {
		headers: {
			"cache-control": getEventsFeedCacheControl(new Date()),
			"content-type": "text/calendar; charset=utf-8",
		},
	});
}
