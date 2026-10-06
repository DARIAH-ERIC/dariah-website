import { getNewsFeed } from "#/lib/data/feeds.ts";

export async function GET(): Promise<Response> {
	const feed = await getNewsFeed();

	return new Response(feed, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
