import * as v from "valibot";

import { defineSearchParams } from "#/lib/navigation/search-params.ts";

/**
 * The events list walks the timeline away from an anchor date. `anchor` defaults to today, which the page resolves at
 * request time so that the default url stays `/events`; `direction` and `page` count away from it. The filter form
 * submits an empty `anchor` when its date is cleared, which is treated the same as a missing one.
 */
export const searchParams = defineSearchParams(
	v.object({
		anchor: v.optional(
			v.union([
				v.pipe(
					v.literal(""),
					v.transform(() => undefined),
				),
				v.pipe(v.string(), v.isoDate()),
			]),
		),
		direction: v.optional(v.picklist(["upcoming", "past"]), "upcoming"),
		page: v.optional(v.pipe(v.string(), v.regex(/^\d+$/), v.toNumber(), v.safeInteger(), v.minValue(1)), "1"),
	}),
	{
		stringify: ({ anchor, direction, page }) => {
			return {
				anchor,
				direction: direction === "upcoming" ? undefined : direction,
				page: page === 1 ? undefined : String(page),
			};
		},
	},
);
