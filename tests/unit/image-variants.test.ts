import { describe, expect, test } from "bun:test";

import { getCoverScale, scaleSizes } from "#/lib/images/variants.ts";

describe("cover scale", () => {
	test("is the ratio by which a wider source overflows its box", () => {
		expect(getCoverScale({ width: 2500, height: 625 }, 2)).toBe(2);
		expect(getCoverScale({ width: 1600, height: 900 }, 3 / 2)).toBe(1.19);
	});

	test("is 1 for a source as wide as its box or narrower", () => {
		expect(getCoverScale({ width: 1200, height: 600 }, 2)).toBe(1);
		expect(getCoverScale({ width: 600, height: 900 }, 2)).toBe(1);
	});

	test("is 1 for a source of unknown dimensions", () => {
		expect(getCoverScale({ width: 2500, height: null }, 2)).toBe(1);
		expect(getCoverScale({ width: null, height: 625 }, 2)).toBe(1);
		expect(getCoverScale({ width: 2500, height: 0 }, 2)).toBe(1);
	});
});

describe("scaled sizes", () => {
	test("scales a single width", () => {
		expect(scaleSizes("20rem", 2)).toBe("calc(20rem * 2)");
	});

	test("scales every entry's width, and leaves its media condition alone", () => {
		expect(scaleSizes("(min-width: 120rem) 23rem, (min-width: 40rem) 45vw, 90vw", 1.5)).toBe(
			"(min-width: 120rem) calc(23rem * 1.5), (min-width: 40rem) calc(45vw * 1.5), calc(90vw * 1.5)",
		);
	});

	test("keeps a width with commas or spaces of its own whole", () => {
		expect(scaleSizes("(min-width: 48rem) min(90vw, 104rem), calc(100vw - 3rem)", 2)).toBe(
			"(min-width: 48rem) calc(min(90vw, 104rem) * 2), calc(calc(100vw - 3rem) * 2)",
		);
	});

	test("returns the sizes untouched at a scale of 1", () => {
		expect(scaleSizes("(min-width: 40rem) 45vw, 90vw", 1)).toBe("(min-width: 40rem) 45vw, 90vw");
	});
});
