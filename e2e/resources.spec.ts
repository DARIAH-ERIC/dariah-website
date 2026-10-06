import { instant } from "@next/playwright";
import type { Locator, Page } from "@playwright/test";

import { waitForHydration } from "#/e2e/lib/hydration.ts";
import { expect, test } from "#/e2e/lib/test.ts";

/**
 * Runs against the search fixtures, see `#/e2e/fixtures/search.ts`: "stemmatology" matches five resources of four
 * types, in the national consortia `e2e-austria` and `e2e-croatia` and the working group `e2e-wg-texts`; "papyrology"
 * matches 22 publications, more than the 20 on a page of results.
 */

function getResults(page: Page): Locator {
	return page.getByRole("main").getByRole("article");
}

function getFacet(page: Page, name: string): Locator {
	return page.getByRole("group", { name });
}

test.describe("/resources/resource-catalogue", () => {
	test("commits the static shell instantly, streaming the resources list behind it", async ({ page, baseURL }) => {
		await instant(
			page,
			async () => {
				await page.goto("/resources/resource-catalogue");

				await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
				await expect(page.getByText("Loading resources…")).toBeVisible();
			},
			{ baseURL },
		);

		await expect(page.getByText("Loading resources…")).toBeHidden();
	});
});

test.describe("/resources/resource-catalogue search", () => {
	/** From `lg` up, the facets are a column beside the results. */
	test.use({ viewport: { width: 1280, height: 900 } });

	test("lists the results for the query in the url, with each facet's counts", async ({ page }) => {
		await page.goto("/resources/resource-catalogue?q=stemmatology");

		await expect(page.getByRole("searchbox", { name: "Search resources" })).toHaveValue("stemmatology");
		await expect(page.getByRole("heading", { level: 2, name: "5 results" })).toBeVisible();
		await expect(getResults(page)).toHaveCount(5);

		const types = getFacet(page, "Resource type");
		await expect(types.getByRole("checkbox", { name: "Publication (2)" })).not.toBeChecked();
		await expect(types.getByRole("checkbox", { name: "Service (1)" })).toBeVisible();
		await expect(types.getByRole("checkbox", { name: "Software (1)" })).toBeVisible();
		await expect(types.getByRole("checkbox", { name: "Training material (1)" })).toBeVisible();

		/** Slugs the api does not know are shown as they are. */
		const consortia = getFacet(page, "National consortium");
		await expect(consortia.getByRole("checkbox", { name: "e2e-austria (3)" })).toBeVisible();
		await expect(consortia.getByRole("checkbox", { name: "e2e-croatia (2)" })).toBeVisible();
		await expect(getFacet(page, "Working group").getByRole("checkbox", { name: "e2e-wg-texts (2)" })).toBeVisible();
	});

	test("links each resource to where it lives, and marks core services", async ({ page }) => {
		await page.goto("/resources/resource-catalogue?q=stemmatology");

		/** The resource's own link comes first, the page on its ingest source otherwise. */
		await expect(
			getResults(page)
				.filter({ hasText: "Stemmatology handbook" })
				.getByRole("link", { name: /^Go to resource/ }),
		).toHaveAttribute("href", "https://zenodo.org/records/e2e-stemmatology-handbook");
		await expect(
			getResults(page)
				.filter({ hasText: "Stemmatology toolkit" })
				.getByRole("link", { name: /^Go to resource/ }),
		).toHaveAttribute("href", "https://marketplace.sshopencloud.eu/tool-or-service/e2e-stemmatology-toolkit");

		await expect(getResults(page).filter({ hasText: "Stemmatology service" })).toContainText("Core service");
		await expect(getResults(page).filter({ hasText: "Stemmatology toolkit" })).not.toContainText("Core service");
	});

	test("filters by a facet as it is ticked, keeping that facet's own counts", async ({ page }) => {
		await page.goto("/resources/resource-catalogue?q=stemmatology");

		const publication = getFacet(page, "Resource type").getByRole("checkbox", { name: /^Publication\b/ });
		await waitForHydration(publication);
		await publication.check();

		await expect(page).toHaveURL("/resources/resource-catalogue?q=stemmatology&type=publication");
		await expect(page.getByRole("heading", { level: 2, name: "2 results" })).toBeVisible();
		await expect(getResults(page)).toHaveCount(2);

		/** Values within a facet are combined with `or`, so the other types still count their matches. */
		await expect(getFacet(page, "Resource type").getByRole("checkbox", { name: "Software (1)" })).toBeVisible();
		/** Other facets count within the selection. */
		const consortia = getFacet(page, "National consortium");
		await expect(consortia.getByRole("checkbox", { name: "e2e-austria (2)" })).toBeVisible();
		await expect(consortia.getByRole("checkbox", { name: "e2e-croatia (1)" })).toBeVisible();

		await getFacet(page, "Resource type")
			.getByRole("checkbox", { name: /^Software\b/ })
			.check();

		await expect(page).toHaveURL("/resources/resource-catalogue?q=stemmatology&type=publication&type=software");
		await expect(getResults(page)).toHaveCount(3);

		await getFacet(page, "Resource type")
			.getByRole("checkbox", { name: /^Publication\b/ })
			.uncheck();
		await getFacet(page, "Resource type")
			.getByRole("checkbox", { name: /^Software\b/ })
			.uncheck();

		await expect(page).toHaveURL("/resources/resource-catalogue?q=stemmatology");
		await expect(getResults(page)).toHaveCount(5);
	});

	test("combines facets with `and`", async ({ page }) => {
		await page.goto("/resources/resource-catalogue?q=stemmatology&type=publication&consortium=e2e-croatia");

		await expect(getFacet(page, "Resource type").getByRole("checkbox", { name: /^Publication\b/ })).toBeChecked();
		await expect(getFacet(page, "National consortium").getByRole("checkbox", { name: /^e2e-croatia\b/ })).toBeChecked();
		await expect(page.getByRole("heading", { level: 2, name: "1 result" })).toBeVisible();
		await expect(getResults(page)).toContainText("Stemmatology reader");
	});

	test("keeps the selection when the query changes", async ({ page }) => {
		await page.goto("/resources/resource-catalogue?type=software");

		const searchbox = page.getByRole("searchbox", { name: "Search resources" });
		await waitForHydration(searchbox);
		await searchbox.fill("stemmatology");

		await expect(page).toHaveURL("/resources/resource-catalogue?q=stemmatology&type=software", { timeout: 15_000 });
		await expect(getResults(page)).toHaveCount(1);
		await expect(getResults(page)).toContainText("Stemmatology toolkit");
	});

	test("offers to clear the filters when nothing matches them, keeping the query", async ({ page }) => {
		await page.goto("/resources/resource-catalogue?q=stemmatology&type=workflow");

		await expect(page.getByRole("heading", { level: 2, name: "0 results" })).toBeVisible();
		/** A selected value without matches is still listed, so it can be unchecked. */
		await expect(getFacet(page, "Resource type").getByRole("checkbox", { name: "Workflow (0)" })).toBeChecked();

		const clear = page.getByRole("link", { name: "Clear filters" });
		await expect(clear).toHaveAttribute("href", "/resources/resource-catalogue?q=stemmatology");

		await clear.click();

		await expect(page).toHaveURL("/resources/resource-catalogue?q=stemmatology");
		await expect(getResults(page)).toHaveCount(5);
		await expect(getFacet(page, "Resource type").getByRole("checkbox", { name: /^Workflow\b/ })).toBeHidden();
	});

	test("pages through the results", async ({ page }) => {
		await page.goto("/resources/resource-catalogue?q=papyrology");

		await expect(page.getByRole("heading", { level: 2, name: "22 results" })).toBeVisible();
		await expect(getResults(page)).toHaveCount(20);
		await expect(getResults(page).first()).toContainText("Papyrology working paper 22");

		await page.getByRole("navigation", { name: "Pagination" }).getByRole("link", { name: "Next page" }).click();

		await expect(page).toHaveURL("/resources/resource-catalogue?q=papyrology&page=2");
		await expect(getResults(page)).toHaveCount(2);
		await expect(getResults(page).last()).toContainText("Papyrology working paper 01");
	});

	test("answers an unknown resource type with the not-found page", async ({ page }) => {
		await page.goto("/resources/resource-catalogue?type=unknown");

		await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
	});
});

/** Opens the filters dialog, which only exists below `lg`, once its button has been hydrated. */
async function openFilters(page: Page): Promise<Locator> {
	const button = page.getByRole("button", { name: /^Show filters\b/ });
	await waitForHydration(button);
	await button.click();

	return page.getByRole("dialog", { name: "Filters" });
}

/** Whether the page's scrolling is locked, as it is behind the filters dialog. */
function isScrollLocked(page: Page): Promise<boolean> {
	return page.evaluate(() => document.documentElement.style.overflow === "hidden");
}

test.describe("/resources/resource-catalogue filters on small screens", () => {
	/** Below `lg`, the facets are in a dialog. */
	test.use({ viewport: { width: 390, height: 844 } });

	test("opens the filters in a dialog, focusing its heading and locking the page's scrolling", async ({ page }) => {
		await page.goto("/resources/resource-catalogue?q=stemmatology");

		await expect(getFacet(page, "Resource type")).toBeHidden();

		const dialog = await openFilters(page);

		await expect(dialog).toBeVisible();
		await expect(dialog.getByRole("heading", { name: "Filters" })).toBeFocused();
		await expect.poll(() => isScrollLocked(page)).toBe(true);

		/** The resource type is open to start with, the other facets only on request. */
		await expect(dialog.getByRole("button", { name: "Resource type" })).toHaveAttribute("aria-expanded", "true");
		await expect(dialog.getByRole("checkbox", { name: "Publication (2)" })).toBeVisible();

		const consortia = dialog.getByRole("button", { name: "National consortium" });
		await expect(consortia).toHaveAttribute("aria-expanded", "false");
		await expect(dialog.getByRole("checkbox", { name: /^e2e-austria\b/ })).toBeHidden();

		await consortia.click();

		await expect(consortia).toHaveAttribute("aria-expanded", "true");
		await expect(dialog.getByRole("checkbox", { name: "e2e-austria (3)" })).toBeVisible();
	});

	test("applies a filter at once, and moves focus to the results on “See results”", async ({ page }) => {
		await page.goto("/resources/resource-catalogue?q=stemmatology");

		const dialog = await openFilters(page);
		await dialog.getByRole("checkbox", { name: /^Software\b/ }).check();

		await expect(page).toHaveURL("/resources/resource-catalogue?q=stemmatology&type=software");
		/** The rest of the page is inert while the dialog is open, so the dialog announces the count itself. */
		await expect(dialog.getByRole("status")).toHaveText("1 result");

		await dialog.getByRole("button", { name: "See 1 result" }).click();

		await expect(dialog).toBeHidden();
		await expect(page.getByRole("heading", { level: 2, name: "1 result" })).toBeFocused();
		await expect(page.getByRole("button", { name: /^Show filters\W+1 active$/ })).toBeVisible();
		await expect.poll(() => isScrollLocked(page)).toBe(false);
	});

	test("closes on escape, and via the close button, moving focus back to the button", async ({ page }) => {
		await page.goto("/resources/resource-catalogue?q=stemmatology");

		const dialog = await openFilters(page);
		await page.keyboard.press("Escape");

		await expect(dialog).toBeHidden();
		await expect(page.getByRole("button", { name: /^Show filters\b/ })).toBeFocused();

		await openFilters(page);
		await dialog.getByRole("button", { name: "Close filters" }).click();

		await expect(dialog).toBeHidden();
		await expect(page.getByRole("button", { name: /^Show filters\b/ })).toBeFocused();
	});

	test("says there is nothing to filter when nothing matches", async ({ page }) => {
		await page.goto("/resources/resource-catalogue?q=nothingmatchesthisquery");

		const dialog = await openFilters(page);

		await expect(dialog).toContainText("No resources match your search, so there is nothing to filter.");
	});
});
