import "server-only";

import { cacheLife } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import { collectAll } from "#/lib/api/paginate.ts";
import type { Newsletter } from "#/lib/api/schemas.ts";

/**
 * Every newsletter. The api proxies these from the mailing provider, not from the dashboard, so the operation declares
 * no cache tags and nothing expires this entry on demand. The `hours` profile keeps a newly sent issue about an hour
 * behind at most, and, unlike the year-long `content` profile, expires the entry after a day, so a page nobody has
 * visited in a while refetches instead of serving an old archive once.
 */
export async function getNewsletters(): Promise<Array<Newsletter>> {
	"use cache";
	cacheLife("hours");

	const result = await collectAll((cursor) => api.getNewsletters.request({ searchParams: cursor }));

	return result.unwrap();
}
