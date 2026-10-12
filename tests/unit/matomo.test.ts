import { afterEach, describe, expect, test } from "bun:test";

import { getPageViewUrl, isNotFound, trackNotFound } from "#/lib/analytics/matomo.ts";
import { type SearchState, getSearchCommands } from "#/lib/analytics/search.ts";

function url(path: string): string {
	return getPageViewUrl(new URL(path, "https://example.org"));
}

describe("getPageViewUrl", () => {
	test("drops search params", () => {
		expect(url("/resources/resource-catalogue?q=digital&type=software&page=2")).toBe(
			"https://example.org/resources/resource-catalogue",
		);
		expect(url("/search?type=bogus&foo=bar&fbclid=x")).toBe("https://example.org/search");
	});

	test("keeps campaign params", () => {
		expect(url("/news?utm_source=newsletter&foo=bar&mtm_campaign=autumn&PK_KWD=x")).toBe(
			"https://example.org/news?utm_source=newsletter&mtm_campaign=autumn&PK_KWD=x",
		);
	});

	test("drops the hash", () => {
		expect(url("/news/page/2#top")).toBe("https://example.org/news/page/2");
	});
});

describe("getSearchCommands", () => {
	const empty: SearchState = { keyword: "", filters: { type: [] }, page: 1, count: 100 };

	function state(value: Partial<SearchState>): SearchState {
		return { ...empty, ...value };
	}

	test("tracks nothing for the unfiltered first page", () => {
		expect(getSearchCommands("resource-catalogue", null, empty)).toEqual([]);
		expect(getSearchCommands("resource-catalogue", empty, empty)).toEqual([]);
	});

	test("tracks a new keyword as a site search, and as an event, both with the page", () => {
		expect(getSearchCommands("resource-catalogue", empty, state({ keyword: "Digital", count: 3 }))).toEqual([
			{ type: "site-search", keyword: "Digital", category: "resource-catalogue", count: 3 },
			{ type: "event", category: "Site search", action: "resource-catalogue: keyword", name: "digital", value: 3 },
		]);
	});

	test("does not track the same keyword again with other filters", () => {
		const search = state({ keyword: "digital" });
		expect(getSearchCommands("resource-catalogue", search, state({ keyword: "digital", count: 5 }))).toEqual([]);
		expect(
			getSearchCommands(
				"resource-catalogue",
				search,
				state({ keyword: "digital", filters: { type: ["software"] }, count: 1 }),
			),
		).toEqual([
			{ type: "event", category: "Search filter", action: "resource-catalogue: type", name: "software", value: 1 },
		]);
	});

	test("tracks newly selected filter values only", () => {
		const previous = state({ filters: { type: ["software"] } });
		expect(
			getSearchCommands(
				"resource-catalogue",
				previous,
				state({ filters: { type: ["software", "workflow"] }, count: 7 }),
			),
		).toEqual([
			{ type: "event", category: "Search filter", action: "resource-catalogue: type", name: "workflow", value: 7 },
		]);
		expect(getSearchCommands("resource-catalogue", previous, empty)).toEqual([]);
	});

	test("tracks filters set on arrival", () => {
		expect(getSearchCommands("opportunities", null, state({ filters: { status: ["open"] }, count: 4 }))).toEqual([
			{ type: "event", category: "Search filter", action: "opportunities: status", name: "open", value: 4 },
		]);
	});

	test("tracks pages past the first", () => {
		expect(getSearchCommands("resource-catalogue", empty, state({ page: 2 }))).toEqual([
			{ type: "event", category: "Pagination", action: "resource-catalogue: page", name: "2" },
		]);
		expect(getSearchCommands("resource-catalogue", null, state({ page: 3 }))).toEqual([
			{ type: "event", category: "Pagination", action: "resource-catalogue: page", name: "3" },
		]);
		expect(getSearchCommands("resource-catalogue", state({ page: 2 }), empty)).toEqual([]);
	});
});

describe("trackNotFound", () => {
	afterEach(() => {
		Reflect.deleteProperty(globalThis, "window");
		Reflect.deleteProperty(globalThis, "document");
	});

	test("tracks the url not found, and where the user came from, in the title", () => {
		const location = { href: "https://example.org/search?type=bogus", pathname: "/search", search: "?type=bogus" };
		Object.assign(globalThis, {
			window: { location },
			document: { title: "Page not found", referrer: "https://example.com/" },
		});

		trackNotFound(new URL(location.href));

		expect(window._paq).toEqual([
			["setCustomUrl", "https://example.org/search"],
			["setDocumentTitle", "404/URL = %2Fsearch%3Ftype%3Dbogus/From = https%3A%2F%2Fexample.com%2F"],
			["trackPageView"],
		]);
		expect(isNotFound()).toBe(true);

		location.search = "";
		expect(isNotFound()).toBe(false);
	});
});
