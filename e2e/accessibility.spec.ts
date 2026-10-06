import type { APIRequestContext, Page } from "@playwright/test";
import axe from "axe-core";
import type { Pathname } from "next";

import { config } from "#/configs/axe.config.ts";
import { expect, test } from "#/e2e/lib/test.ts";

/** Where to find a url to audit for a route with dynamic segments. */
type Sample =
	/** The first matching url in the sitemap. */
	| { from: "sitemap" }
	/** The first matching link on a page, for routes the sitemap does not list. */
	| { from: "page"; pathname: Pathname };

/**
 * How each route is audited: one without dynamic segments at its pathname, followed by the search string given, and one
 * with dynamic segments at a single sample url, as its pages share one template. `null` skips the route. Exhaustive, so
 * a new route fails type checking until it has been decided on here.
 */
const routes = {
	"/": "",
	"/about/dariah-in-a-nutshell": "",
	"/about/documents": "",
	"/about/impact-case-studies": "",
	"/about/impact-case-studies/[slug]": { from: "sitemap" },
	"/about/impact-case-studies/page/[page]": { from: "page", pathname: "/about/impact-case-studies" },
	"/about/organisation-and-governance": "",
	"/about/organisation-and-governance/[slug]": { from: "page", pathname: "/about/organisation-and-governance" },
	"/about/strategy": "",
	/** Without a matomo token, as in ci, only its notice that analytics are not configured. */
	"/analytics": "",
	"/events": "",
	"/events/[slug]": { from: "sitemap" },
	"/events/calendar": "",
	"/get-involved/funding-calls": "",
	"/get-involved/funding-calls/[slug]": { from: "sitemap" },
	"/get-involved/funding-calls/page/[page]": { from: "page", pathname: "/get-involved/funding-calls" },
	"/get-involved/join-dariah": "",
	"/get-involved/opportunities": "",
	"/get-involved/opportunities/[slug]": { from: "sitemap" },
	"/network/members-and-partners": "",
	"/network/members-and-partners/[slug]": { from: "sitemap" },
	"/network/partnerships-and-collaborations": "",
	"/network/regional-hubs": "",
	"/network/working-groups": "",
	"/network/working-groups/[slug]": { from: "sitemap" },
	"/network/working-groups/inactive": "",
	"/news": "",
	"/news/[slug]": { from: "sitemap" },
	"/news/page/[page]": { from: "page", pathname: "/news" },
	"/newsletters": "",
	"/persons/[slug]": { from: "sitemap" },
	"/privacy-and-legal/accessibility-declaration": "",
	"/privacy-and-legal/legal-notice": "",
	"/projects": "",
	"/projects/[slug]": { from: "sitemap" },
	"/projects/inactive": "",
	"/resources/dariah-campus": "",
	"/resources/resource-catalogue": "",
	"/resources/ssh-open-marketplace": "",
	"/resources/transformations": "",
	/** With a query, so the results are audited as well as the form. */
	"/search": "?q=dariah",
	/** An internal tool, only served when enabled. */
	"/search-benchmark": null,
	"/spotlight": "",
	"/spotlight/[slug]": { from: "sitemap" },
} satisfies Record<Pathname, string | Sample | null>;

/**
 * The success criteria the accessibility declaration is measured against - wcag 2.2, levels a and aa - and axe's best
 * practices, which go beyond them, e.g. that all content is inside a landmark.
 */
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22a", "wcag22aa", "best-practice"];

/**
 * Rules axe leaves out of a tag selection even when their tags match, because it also tags them `experimental` - which
 * it excludes by default - but which test a success criterion the declaration covers: all of axe's experimental wcag
 * rules. Lighthouse runs the first.
 */
const experimentalRules = {
	/** Wcag 2.5.3, label in name: a link named by `aria-labelledby` has to keep its visible text in its name. */
	"label-content-name-mismatch": { enabled: true },
	/** Wcag 1.3.1, info and relationships: a bold or large paragraph which should be a heading, e.g. in rich text. */
	"p-as-heading": { enabled: true },
	/** Wcag 1.3.1: every data cell of a large table has a header. */
	"td-has-header": { enabled: true },
	/** Wcag 1.3.1: a table's caption is a `<caption>`, not a first row spanning it. */
	"table-fake-caption": { enabled: true },
	/** Wcag 1.3.4, orientation: no media query locks the page to portrait or landscape. */
	"css-orientation-lock": { enabled: true },
};

/** Matches the pathnames of a route with dynamic segments, e.g. `/news/[slug]`. */
function toPattern(route: string): RegExp {
	const source = route
		.split(/\[[^\]]+\]/)
		.map((part) => part.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`))
		.join("[^/]+");

	return new RegExp(`^${source}$`);
}

/** The sitemap is the same for every test, so each worker fetches it once. */
let sitemapPathnames: Promise<Array<string>> | undefined;

function getSitemapPathnames(request: APIRequestContext): Promise<Array<string>> {
	sitemapPathnames ??= request.get("/sitemap.xml").then(async (response) => {
		if (!response.ok()) {
			throw new Error(`Failed to fetch the sitemap: ${String(response.status())}.`);
		}

		const xml = await response.text();

		return Array.from(xml.matchAll(/<loc>(?<loc>[^<]+)<\/loc>/g), (match) => new URL(match.groups!.loc!).pathname);
	});

	return sitemapPathnames;
}

async function getUrl(route: string, target: string | Sample, page: Page, request: APIRequestContext): Promise<string> {
	if (typeof target === "string") {
		return route + target;
	}

	let pathnames: Array<string>;

	if (target.from === "sitemap") {
		pathnames = await getSitemapPathnames(request);
	} else {
		await page.goto(target.pathname);
		pathnames = await page
			.getByRole("link")
			.evaluateAll((links) => links.map((link) => new URL((link as HTMLAnchorElement).href).pathname));
	}

	const pattern = toPattern(route);
	const sample = pathnames.find((pathname) => pattern.test(pathname));

	if (sample == null) {
		throw new Error(`Found no url to audit ${route} at.`);
	}

	return sample;
}

/** Axe-core, as `addScriptTag` puts it on `window`. */
type Axe = typeof axe;

/** Each violated rule, with the elements violating it, in a form which reads well in a failed assertion's diff. */
async function getViolations(page: Page): Promise<Array<Record<string, unknown>>> {
	await page.addScriptTag({ content: axe.source });

	const violations = await page.evaluate(
		async ({ config, experimentalRules, tags }) => {
			const { axe: runner } = window as unknown as { axe: Axe };
			runner.configure(config);
			/** The next.js dev tools are not part of the page. */
			const results = await runner.run(
				{ exclude: [["nextjs-portal"]] },
				{ runOnly: { type: "tag", values: tags }, rules: experimentalRules },
			);

			return results.violations;
		},
		{ config, experimentalRules, tags },
	);

	return violations.map((violation) => {
		return {
			rule: violation.id,
			impact: violation.impact,
			help: violation.help,
			helpUrl: violation.helpUrl,
			/** Each element's selector, with what is wrong with it, e.g. the contrast ratio and colours it has. */
			elements: violation.nodes.map((node) => {
				const messages = [...node.any, ...node.all, ...node.none].map((check) => check.message);

				return `${node.target.join(" ")}: ${messages.join(" ")}`;
			}),
		};
	});
}

test.describe("accessibility", () => {
	for (const [route, target] of Object.entries(routes)) {
		if (target == null) {
			continue;
		}

		test(`${route} has no detectable accessibility violations`, async ({ page, request }) => {
			const url = await getUrl(route, target, page, request);

			await page.goto(url);
			/** Every suspense fallback has been replaced, so the page's content is audited, not its skeletons. */
			await expect(page.getByText(/^Loading\b.*…$/)).toHaveCount(0, { timeout: 15_000 });

			expect(await getViolations(page), `Accessibility violations at ${url}`).toStrictEqual([]);
		});
	}
});
