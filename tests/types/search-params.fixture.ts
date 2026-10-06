import * as v from "valibot";

import { defineSearchParams } from "#/lib/navigation/search-params.ts";
import { toArray } from "#/lib/navigation/to-array.ts";

export const postListSearchParams = defineSearchParams(
	v.object({
		page: v.optional(v.pipe(v.string(), v.toNumber(), v.integer(), v.minValue(1))),
		q: v.optional(v.pipe(v.string(), v.trim(), v.nonEmpty())),
		tag: v.optional(v.pipe(v.union([v.string(), v.array(v.string())]), toArray(), v.nonEmpty())),
	}),
);

export const postDetailSearchParams = defineSearchParams(
	v.object({
		view: v.optional(v.picklist(["preview", "published"])),
	}),
);
