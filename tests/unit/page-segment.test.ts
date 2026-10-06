import { describe, expect, test } from "bun:test";

import { pageSegmentParams, parsePageSegment } from "#/lib/navigation/page-segment.ts";

describe("paginated list page segments", () => {
	test("parses later pages, with a single url each", () => {
		expect(parsePageSegment("2")).toBe(2);
		expect(parsePageSegment("69")).toBe(69);

		for (const segment of ["", "0", "1", "01", "02", "-2", "1.5", "2abc", "1e2", "9007199254740992"]) {
			expect(parsePageSegment(segment)).toBeNull();
		}
	});

	test("lists every later page, and never none", () => {
		expect(pageSegmentParams(3)).toEqual([{ page: "2" }, { page: "3" }]);
		expect(pageSegmentParams(1)).toEqual([{ page: "2" }]);
	});
});
