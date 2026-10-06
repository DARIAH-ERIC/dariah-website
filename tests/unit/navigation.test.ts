import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

// oxlint-disable-next-line no-restricted-imports -- This regression test intentionally exercises the patched Next.js generator.
import {
	type RouteTypesManifest,
	createRouteTypesManifest,
} from "next/dist/server/lib/router-utils/route-types-utils.js";
// oxlint-disable-next-line no-restricted-imports -- This regression test intentionally exercises the patched Next.js generator.
import { generateNavigationTypesFile } from "next/dist/server/lib/router-utils/typegen.js";
import * as v from "valibot";

import { type InternalHref, href, serializeHref } from "#/lib/navigation/href.ts";
import { defineSearchParams } from "#/lib/navigation/search-params.ts";
import { toArray } from "#/lib/navigation/to-array.ts";

const testSearchParams = defineSearchParams(
	v.object({
		page: v.optional(v.pipe(v.string(), v.toNumber(), v.integer(), v.minValue(1))),
		q: v.optional(v.pipe(v.string(), v.trim(), v.nonEmpty())),
		tag: v.optional(v.pipe(v.union([v.string(), v.array(v.string())]), toArray(), v.nonEmpty())),
	}),
);

function internalHref(value: unknown): InternalHref {
	return value as InternalHref;
}

describe("href", () => {
	test("serializes dynamic route parameters as encoded path segments", () => {
		const value = internalHref({
			pathname: "/posts/[id]",
			params: { id: "a post/with a slash" },
		});

		expect(serializeHref(value)).toBe("/posts/a%20post%2Fwith%20a%20slash");
	});

	test("serializes required and optional catch-all parameters", () => {
		const required = internalHref({
			pathname: "/docs/[...parts]",
			params: { parts: ["routing", "dynamic segments"] },
		});
		const omitted = internalHref({ pathname: "/archive/[[...parts]]" });
		const present = internalHref({
			pathname: "/archive/[[...parts]]",
			params: { parts: ["2026", "August"] },
		});

		expect(serializeHref(required)).toBe("/docs/routing/dynamic%20segments");
		expect(serializeHref(omitted)).toBe("/archive");
		expect(serializeHref(present)).toBe("/archive/2026/August");
	});

	test("normalizes and allowlists external URLs", () => {
		expect(serializeHref(href({ url: "https://example.com/docs" }))).toBe("https://example.com/docs");
		expect(serializeHref(href({ url: "mailto:info@example.com" }))).toBe("mailto:info@example.com");
		expect(() => href({ url: new URL("javascript:alert(1)") })).toThrow("Unsupported URL protocol");
	});

	test("serializes validated search params before an encoded hash", () => {
		const value = internalHref({
			hash: "matching results",
			pathname: "/posts",
			searchParams: testSearchParams.encode({ page: 2, q: "  digital humanities  ", tag: ["events", "training"] }),
		});

		expect(serializeHref(value)).toBe("/posts?page=2&q=digital+humanities&tag=events&tag=training#matching%20results");
	});

	test("rejects malformed internal hashes", () => {
		expect(() => href({ hash: "#results", pathname: "/" })).toThrow("omit the leading #");
		expect(() => href({ hash: "", pathname: "/" })).toThrow("non-empty");
	});

	test("rejects missing required parameters at runtime", () => {
		const missingSegment = internalHref({ pathname: "/posts/[id]", params: {} });
		const emptyCatchAll = internalHref({ pathname: "/docs/[...parts]", params: { parts: [] } });

		expect(() => serializeHref(missingSegment)).toThrow('Expected route parameter "id"');
		expect(() => serializeHref(emptyCatchAll)).toThrow('Expected catch-all parameter "parts"');
	});
});

describe("search params", () => {
	test("parses single and repeated values into domain values", () => {
		expect(testSearchParams.parse({ page: "2", q: "  history  ", tag: "events" })).toEqual({
			page: 2,
			q: "history",
			tag: ["events"],
		});
		expect(testSearchParams.parse(new URLSearchParams("tag=events&tag=training"))).toEqual({
			tag: ["events", "training"],
		});
	});

	test("returns Valibot issues for invalid user input", () => {
		const result = testSearchParams.safeParse({ page: "0" });

		expect(result.success).toBeFalse();
	});

	test("validates and canonicalizes values while encoding", () => {
		const encoded = testSearchParams.encode({
			page: 2,
			q: "  history  ",
			tag: ["events", "training"],
		});

		expect(encoded.query).toBe("page=2&q=history&tag=events&tag=training");
		expect(() => testSearchParams.encode({ page: Number.NaN })).toThrow("finite");
		expect(() => testSearchParams.encode({ tag: [] })).toThrow();
	});

	test("supports custom serialization for non-primitive domain values", () => {
		const dateSearchParams = defineSearchParams(
			v.object({
				on: v.pipe(
					v.string(),
					v.isoDate(),
					v.transform((value) => new Date(`${value}T00:00:00.000Z`)),
				),
			}),
			{
				stringify(value) {
					return { on: value.on.toISOString().slice(0, 10) };
				},
			},
		);

		expect(dateSearchParams.encode({ on: new Date("2026-08-25T00:00:00.000Z") }).query).toBe("on=2026-08-25");
	});
});

describe("Next.js navigation type generation", () => {
	test("discovers a search-params.ts sibling for an app page", async () => {
		const directory = await mkdtemp(path.join(tmpdir(), "navigation-search-params-"));
		const pageDirectory = path.join(directory, "app", "posts");
		const pagePath = path.join(pageDirectory, "page.tsx");
		const searchParamsPath = path.join(pageDirectory, "search-params.ts");

		try {
			await mkdir(pageDirectory, { recursive: true });
			await Promise.all([writeFile(pagePath, "export default function Page() {}"), writeFile(searchParamsPath, "")]);

			const manifest = await createRouteTypesManifest({
				appRouteHandlers: [],
				appRoutes: [{ filePath: pagePath, route: "/posts" }],
				dir: directory,
				layoutRoutes: [],
				pageApiRoutes: [],
				pageRoutes: [],
				slots: [],
				validatorFilePath: path.join(directory, ".next", "types", "validator.ts"),
			});

			expect(manifest.navigationSearchParams).toEqual({ "/posts": searchParamsPath });
		} finally {
			await rm(directory, { force: true, recursive: true });
		}
	});

	test("rejects multiple sibling codecs for the same normalized route", async () => {
		const directory = await mkdtemp(path.join(tmpdir(), "navigation-search-params-conflict-"));
		const firstDirectory = path.join(directory, "app", "(first)", "posts");
		const secondDirectory = path.join(directory, "app", "(second)", "posts");
		const firstPagePath = path.join(firstDirectory, "page.tsx");
		const secondPagePath = path.join(secondDirectory, "page.tsx");

		try {
			await Promise.all([mkdir(firstDirectory, { recursive: true }), mkdir(secondDirectory, { recursive: true })]);
			await Promise.all([
				writeFile(firstPagePath, "export default function Page() {}"),
				writeFile(path.join(firstDirectory, "search-params.ts"), ""),
				writeFile(secondPagePath, "export default function Page() {}"),
				writeFile(path.join(secondDirectory, "search-params.ts"), ""),
			]);

			const manifest = createRouteTypesManifest({
				appRouteHandlers: [],
				appRoutes: [
					{ filePath: firstPagePath, route: "/posts" },
					{ filePath: secondPagePath, route: "/posts" },
				],
				dir: directory,
				layoutRoutes: [],
				pageApiRoutes: [],
				pageRoutes: [],
				slots: [],
				validatorFilePath: path.join(directory, ".next", "types", "validator.ts"),
			});

			let cause: unknown;

			try {
				await manifest;
			} catch (error) {
				cause = error;
			}

			expect(cause).toBeInstanceOf(Error);
			expect((cause as Error).message).toContain("Multiple search-params.ts files");
		} finally {
			await rm(directory, { force: true, recursive: true });
		}
	});

	test("reuses the generated navigable route map from the active route-types file", () => {
		const manifest: RouteTypesManifest = {
			appPagePaths: new Set(),
			appRouteHandlers: new Set(),
			appRouteHandlerRoutes: {
				"/api/posts": { groups: {}, path: "/api/posts" },
			},
			appRoutes: {
				"/[locale]/posts/[id]": {
					groups: {
						id: { optional: false, pos: 2, repeat: false },
						locale: { optional: false, pos: 1, repeat: false },
					},
					path: "/[locale]/posts/[id]",
				},
			},
			filePathToRoute: new Map(),
			layoutPaths: new Set(),
			layoutRoutes: {
				"/[locale]": { groups: {}, path: "/[locale]", slots: [] },
			},
			navigationSearchParams: {
				"/[locale]/posts/[id]": "/project/app/[locale]/posts/[id]/search-params.ts",
			},
			pageApiRoutes: new Set(),
			pageRoutes: {},
			pagesRouterPagePaths: new Set(),
			redirectRoutes: {
				"/old-posts": { groups: {}, path: "/old-posts" },
			},
			rewriteRoutes: {
				"/articles": { groups: {}, path: "/articles" },
			},
			rootParams: new Map(),
		};

		const generated = generateNavigationTypesFile(
			manifest,
			"/project/.next/types/navigation.d.ts",
			"/project/.next/dev/types/routes.d.ts",
		);

		expect(generated).toContain(
			'import type { AppRoutes, PageRoutes, ParamMap, RewriteRoutes } from "../dev/types/routes.js"',
		);
		expect(generated).toContain(
			"interface NavigationRouteRegistry extends Pick<ParamMap, AppRoutes | PageRoutes | RewriteRoutes>",
		);
		expect(generated).not.toContain('"id": string');
		expect(generated).toContain(
			'"/[locale]/posts/[id]": typeof import("../../app/[locale]/posts/[id]/search-params.js").searchParams',
		);

		const buildGenerated = generateNavigationTypesFile(
			manifest,
			"/project/.next/types/navigation.d.ts",
			"/project/.next/types/routes.d.ts",
		);

		expect(buildGenerated).toContain(
			'import type { AppRoutes, PageRoutes, ParamMap, RewriteRoutes } from "./routes.js"',
		);
	});
});
