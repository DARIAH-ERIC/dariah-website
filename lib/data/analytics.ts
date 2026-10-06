import "server-only";

import { cacheLife } from "next/cache";
import * as v from "valibot";

import { env } from "#/configs/env.config.ts";
import { request } from "#/lib/request/index.ts";

/** How many months the analytics page shows, up to and including the current one. */
export const analyticsMonths = 12;

export interface MonthlyVisits {
	/** `YYYY-MM`, in the time zone of the site in matomo. */
	month: string;
	visits: number;
	/**
	 * `null` when matomo does not process unique visitors for months - see `enable_processing_unique_visitors_month` in
	 * its `config.ini.php`.
	 */
	uniqueVisitors: number | null;
}

/** Matomo answers a failed api call with a `200`, and the error in the body. */
const ErrorResponseSchema = v.object({ result: v.literal("error"), message: v.string() });

const MonthSchema = v.union([
	v.object({ nb_visits: v.number(), nb_uniq_visitors: v.optional(v.number()) }),
	/** A month without visits, including those before the site was added to matomo. */
	v.pipe(
		v.tuple([]),
		v.transform(() => {
			return { nb_visits: 0, nb_uniq_visitors: 0 };
		}),
	),
]);

/** Keyed by `YYYY-MM`. */
const MonthsResponseSchema = v.record(v.pipe(v.string(), v.regex(/^\d{4}-\d{2}$/)), MonthSchema);

/**
 * Visits and unique visitors per month, oldest first, ending with the current month, which is still in progress. `null`
 * when no matomo token or site id is configured.
 *
 * Matomo archives the current month's reports periodically - by default at most every 15 minutes, or on its cron job's
 * schedule - so an hour's cache leaves the numbers about an hour behind at most. Only read at request time: the token
 * is a runtime secret, which throws when read while prerendering.
 *
 * The token is sent in the request body, never in the url, where it would end up in access logs.
 */
export async function getMonthlyVisits(): Promise<Array<MonthlyVisits> | null> {
	"use cache";
	cacheLife("hours");

	const token = env.MATOMO_API_TOKEN;
	const siteId = env.NEXT_PUBLIC_APP_MATOMO_ID;

	if (token == null || siteId == null) {
		return null;
	}

	const url = new URL("./index.php", env.NEXT_PUBLIC_APP_MATOMO_BASE_URL);
	url.search = new URLSearchParams({
		module: "API",
		method: "VisitsSummary.get",
		idSite: String(siteId),
		period: "month",
		date: `last${String(analyticsMonths)}`,
		format: "JSON",
	}).toString();

	const result = await request(url, {
		method: "post",
		body: new URLSearchParams({ token_auth: token }),
		responseType: "json",
	});

	const { data } = result.unwrap();

	const error = v.safeParse(ErrorResponseSchema, data);
	if (error.success) {
		throw new Error(`Matomo api error: ${error.output.message}`);
	}

	return Object.entries(v.parse(MonthsResponseSchema, data))
		.toSorted(([a], [b]) => a.localeCompare(b))
		.map(([month, value]) => {
			return {
				month,
				visits: value.nb_visits,
				uniqueVisitors: value.nb_uniq_visitors ?? null,
			};
		});
}
