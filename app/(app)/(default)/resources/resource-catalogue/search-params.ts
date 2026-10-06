import * as v from "valibot";

import { defineSearchParams } from "#/lib/navigation/search-params.ts";
import { toArray } from "#/lib/navigation/to-array.ts";
import { resourceTypes } from "#/lib/search/collections/resources.ts";

/** A facet selection: one occurrence arrives as a string, repeated ones as an array. */
const SlugsSchema = v.optional(
	v.pipe(v.union([v.string(), v.array(v.string())]), toArray(), v.array(v.pipe(v.string(), v.nonEmpty()))),
	[],
);

/**
 * `q` is the free-text query; `type`, `consortium` and `working-group` are the selected facet values, each of which may
 * be repeated. Values within one facet are combined with `or`, facets with `and`.
 */
export const searchParams = defineSearchParams(
	v.object({
		q: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(200)), ""),
		type: v.optional(
			v.pipe(v.union([v.string(), v.array(v.string())]), toArray(), v.array(v.picklist(resourceTypes))),
			[],
		),
		consortium: SlugsSchema,
		"working-group": SlugsSchema,
		page: v.optional(v.pipe(v.string(), v.regex(/^\d+$/), v.toNumber(), v.safeInteger(), v.minValue(1)), "1"),
	}),
	{
		stringify: ({ q, type, consortium, "working-group": workingGroup, page }) => {
			return {
				q: q.length > 0 ? q : undefined,
				type,
				consortium,
				"working-group": workingGroup,
				page: page === 1 ? undefined : String(page),
			};
		},
	},
);
