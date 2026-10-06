import "server-only";

import { cacheLife } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import { collectAll } from "#/lib/api/paginate.ts";
import type { Newsletter } from "#/lib/api/schemas.ts";

/**
 * Every newsletter. The api proxies these from the mailing provider, not from the dashboard, so the operation declares
 * no cache tags and nothing expires this entry on demand: only the daily refresh of the `content` profile does.
 */
export async function getNewsletters(): Promise<Array<Newsletter>> {
	"use cache";
	cacheLife("content");

	const result = await collectAll((cursor) => api.getNewsletters.request({ searchParams: cursor }));

	return result.unwrap();
}
