import { describe, expect, test } from "bun:test";

import { searchParams as events } from "#/app/(app)/(default)/events/search-params.ts";
import { searchParams as opportunities } from "#/app/(app)/(default)/get-involved/opportunities/search-params.ts";

describe.each([opportunities])("paginated content URLs", (codec) => {
	test("normalizes pages and omits the default from generated links", () => {
		expect(codec.parse({})).toEqual({ page: 1 });
		expect(codec.parse({ page: "002", utm_source: "newsletter" })).toEqual({ page: 2 });
		expect(codec.encode({ page: 1 }).query).toBe("");
		expect(codec.encode({ page: 2 }).query).toBe("page=2");
	});

	test("rejects malformed, repeated, and unsafe page numbers", () => {
		for (const page of ["", "0", "-1", "1.5", "2abc", "1e2", "9007199254740992", ["1", "2"]]) {
			expect(codec.safeParse({ page }).success).toBeFalse();
		}
	});
});

describe("events timeline URLs", () => {
	test("normalizes the walk and omits defaults from generated links", () => {
		expect(events.parse({})).toEqual({ direction: "upcoming", page: 1 });
		expect(events.parse({ anchor: "2026-10-08", direction: "past", page: "002" })).toEqual({
			anchor: "2026-10-08",
			direction: "past",
			page: 2,
		});
		expect(events.encode({ direction: "upcoming", page: 1 }).query).toBe("");
		expect(events.encode(events.parse({ anchor: "" })).query).toBe("");
		expect(events.encode({ anchor: "2026-10-08", direction: "past", page: 2 }).query).toBe(
			"anchor=2026-10-08&direction=past&page=2",
		);
	});

	/** The filter form submits an empty anchor when its date is cleared, which is treated as a missing one. */
	test("treats an empty anchor as missing", () => {
		expect(events.parse({ anchor: "" })).toEqual(events.parse({}));
	});

	test("rejects malformed anchors, directions, and page numbers", () => {
		for (const anchor of ["2026-10", "2026-13-01", "08.10.2026", ["2026-10-08", "2026-10-09"]]) {
			expect(events.safeParse({ anchor }).success).toBeFalse();
		}
		for (const direction of ["", "future", ["upcoming", "past"]]) {
			expect(events.safeParse({ direction }).success).toBeFalse();
		}
		for (const page of ["", "0", "-1", "1.5", "2abc", "1e2", "9007199254740992", ["1", "2"]]) {
			expect(events.safeParse({ page }).success).toBeFalse();
		}
	});
});
