import * as v from "valibot";

import { defineSearchParams } from "#/lib/navigation/search-params.ts";

/**
 * The calendar shows one month, `YYYY-MM`. It defaults to the current month, which the page resolves at request time.
 * The filter form's date input submits a whole day, `YYYY-MM-DD`, which selects its month, and an empty value when it
 * is cleared, which is treated the same as a missing one.
 */
export const searchParams = defineSearchParams(
	v.object({
		month: v.optional(
			v.union([
				v.pipe(
					v.literal(""),
					v.transform(() => undefined),
				),
				v.pipe(v.string(), v.regex(/^\d{4}-(?:0[1-9]|1[0-2])$/)),
				v.pipe(
					v.string(),
					v.isoDate(),
					v.transform((date) => date.slice(0, 7)),
				),
			]),
		),
	}),
);
