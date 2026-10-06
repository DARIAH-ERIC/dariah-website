import { connection } from "next/server";

import { today } from "#/lib/data/events.ts";
import { getEventsFeed, getEventsFeedCacheControl } from "#/lib/data/feeds.ts";

/** Rendered per request, since the feed lists the events not yet over today - see `getEventsFeed`. */
export async function GET(): Promise<Response> {
	await connection();

	const feed = await getEventsFeed(today());

	return new Response(feed, {
		headers: {
			"cache-control": getEventsFeedCacheControl(new Date()),
			"content-type": "application/rss+xml; charset=utf-8",
		},
	});
}
