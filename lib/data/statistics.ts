import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import type { GetStatistics } from "#/lib/api/schemas.ts";

/** Network statistics, i.e. counts of member countries, partner institutions and working groups. */
export async function getStatistics(): Promise<GetStatistics> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getStatistics.cacheTags());

	const result = await api.getStatistics.request();

	return result.unwrap().data;
}
