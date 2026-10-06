import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import { collectAll, pageCount, pageCursor } from "#/lib/api/paginate.ts";
import type { Opportunity, OpportunityBase } from "#/lib/api/schemas.ts";

/** Items per page of the opportunities list, a website decision, unrelated to the api's page size cap. */
export const opportunitiesPageSize = 10;

export type OpportunityStatus = NonNullable<api.getOpportunities.SearchParams["status"]>[number];

export type OpportunitySource = OpportunityBase["source"]["source"];

export interface ListedOpportunity {
	opportunity: OpportunityBase;
	/** Derived from the opportunity's dates, so an editor only sets the deadline, i.e. `duration.end`. */
	status: OpportunityStatus;
}

export interface OpportunitiesPage {
	items: Array<OpportunityBase>;
	/** 1-based. */
	page: number;
	pages: number;
	total: number;
}

/**
 * One page of the opportunities list, narrowed to one status and one source when given, or `null` when `page` is out of
 * range. See `#/lib/data/news.ts` for the pattern.
 *
 * The api filters by status relative to the time of the request. The items come without their own status, which the
 * page works out at request time with `getOpportunityStatus`, so it agrees with the filter - except just after a
 * deadline, when the cached list may still hold an item which has closed since.
 */
export async function getOpportunitiesPage(params: {
	page: number;
	status?: OpportunityStatus;
	source?: OpportunitySource;
}): Promise<OpportunitiesPage | null> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getOpportunities.cacheTags());

	const { page, status, source } = params;

	if (!Number.isInteger(page) || page < 1) {
		return null;
	}

	const result = await api.getOpportunities.request({
		searchParams: {
			...pageCursor(page, opportunitiesPageSize),
			status: status != null ? [status] : undefined,
			source: source != null ? [source] : undefined,
		},
	});

	const { data, total } = result.unwrap().data;
	const pages = pageCount(total, opportunitiesPageSize);

	if (page > pages) {
		return null;
	}

	return { items: data, page, pages, total };
}

/**
 * Where an opportunity stands on `now`, `YYYY-MM-DD` - today, read at request time, as the api's status filter is: see
 * `getFundingCallStatus`. An opportunity's dates are calendar days stored as UTC midnight, so they are compared as
 * `YYYY-MM-DD`, and the deadline is still open.
 */
export function getOpportunityStatus(opportunity: Pick<OpportunityBase, "duration">, now: string): OpportunityStatus {
	const { start, end } = opportunity.duration;

	if (start.slice(0, 10) > now) {
		return "upcoming";
	}

	if (end != null && end.slice(0, 10) < now) {
		return "closed";
	}

	return "open";
}

/** An opportunity by slug, or `null` when there is none. */
export async function getOpportunityBySlug(slug: string): Promise<Opportunity | null> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getOpportunityBySlug.cacheTags());

	const result = await api.getOpportunityBySlug.request({ params: { slug } });

	if (result.isErr() && result.error._tag === "HttpError" && result.error.response.status === 404) {
		return null;
	}

	return result.unwrap().data;
}

/** Every published opportunity slug, for `generateStaticParams`. */
export async function getOpportunitySlugs(): Promise<Array<string>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getOpportunitySlugs.cacheTags());

	const result = await collectAll((cursor) => api.getOpportunitySlugs.request({ searchParams: cursor }));

	return result.unwrap().map((item) => item.entity.slug);
}
