import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import { collectAll, pageCount, pageCursor } from "#/lib/api/paginate.ts";
import type { FundingCall, FundingCallBase } from "#/lib/api/schemas.ts";

/** Items per page of the funding calls list, a website decision, unrelated to the api's page size cap. */
export const fundingCallsPageSize = 10;

/** Labelled as an opportunity's: a call is `open`, i.e. accepts applications, from its first day to its last. */
export type FundingCallStatus = "upcoming" | "open" | "closed";

export interface FundingCallsPage {
	items: Array<FundingCallBase>;
	/** 1-based. */
	page: number;
	pages: number;
	total: number;
}

/**
 * One page of the funding calls list, or `null` when `page` is out of range. See `#/lib/data/news.ts` for the pattern.
 * Without the calls' status, which depends on the day - see `getFundingCallStatus`.
 */
export async function getFundingCallsPage(page: number): Promise<FundingCallsPage | null> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getFundingCalls.cacheTags());

	if (!Number.isInteger(page) || page < 1) {
		return null;
	}

	const result = await api.getFundingCalls.request({ searchParams: pageCursor(page, fundingCallsPageSize) });

	const { data, total } = result.unwrap().data;
	const pages = pageCount(total, fundingCallsPageSize);

	if (page > pages) {
		return null;
	}

	return { items: data, page, pages, total };
}

/**
 * Where a call stands on `now`, `YYYY-MM-DD` - today, read at request time, not inside a cached function: a cached day
 * would keep a call whose deadline has passed open until the entry is refreshed, which the `content` profile does at
 * most daily, and on a rarely visited page, later still. A call's dates are calendar days stored as UTC midnight, so
 * they are compared as `YYYY-MM-DD`, and the end day is still open. A call without an end stays open.
 */
export function getFundingCallStatus(call: Pick<FundingCallBase, "duration">, now: string): FundingCallStatus {
	if (call.duration.start.slice(0, 10) > now) {
		return "upcoming";
	}

	if (call.duration.end == null || call.duration.end.slice(0, 10) >= now) {
		return "open";
	}

	return "closed";
}

/** A funding call by slug, or `null` when there is none. */
export async function getFundingCallBySlug(slug: string): Promise<FundingCall | null> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getFundingCallBySlug.cacheTags());

	const result = await api.getFundingCallBySlug.request({ params: { slug } });

	if (result.isErr() && result.error._tag === "HttpError" && result.error.response.status === 404) {
		return null;
	}

	return result.unwrap().data;
}

/** Every published funding call slug, for `generateStaticParams`. */
export async function getFundingCallSlugs(): Promise<Array<string>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getFundingCallSlugs.cacheTags());

	const result = await collectAll((cursor) => api.getFundingCallSlugs.request({ searchParams: cursor }));

	return result.unwrap().map((item) => item.entity.slug);
}
