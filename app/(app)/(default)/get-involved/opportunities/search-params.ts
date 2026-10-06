import * as v from "valibot";

import type { OpportunitySource, OpportunityStatus } from "#/lib/data/opportunities.ts";
import { defineSearchParams } from "#/lib/navigation/search-params.ts";

/** In the order the filter lists them. */
export const opportunityStatuses = ["open", "upcoming", "closed"] as const satisfies ReadonlyArray<OpportunityStatus>;

export const opportunitySources = ["dariah", "external"] as const satisfies ReadonlyArray<OpportunitySource>;

/** One value of a filter, where the form's empty value, "all", is treated the same as a missing param. */
function filter<const T extends ReadonlyArray<string>>(values: T) {
	return v.optional(
		v.union([
			v.pipe(
				v.literal(""),
				v.transform(() => undefined),
			),
			v.picklist(values),
		]),
	);
}

/** `status` and `source` each narrow the list to one value; a missing one lists all of them. */
export const searchParams = defineSearchParams(
	v.object({
		status: filter(opportunityStatuses),
		source: filter(opportunitySources),
		page: v.optional(v.pipe(v.string(), v.regex(/^\d+$/), v.toNumber(), v.safeInteger(), v.minValue(1)), "1"),
	}),
	{
		stringify: ({ status, source, page }) => {
			return { status, source, page: page === 1 ? undefined : String(page) };
		},
	},
);
