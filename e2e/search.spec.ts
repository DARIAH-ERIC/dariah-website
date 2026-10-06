import { instant } from "@next/playwright";
import type { Locator, Page } from "@playwright/test";

import { bot } from "#/e2e/lib/bot.ts";
import { waitForHydration } from "#/e2e/lib/hydration.ts";
import { expect, test } from "#/e2e/lib/test.ts";

/**
 * Runs against the search fixtures, see `#/e2e/fixtures/search.ts`: "lexicography" matches four documents of four
 * types, "palaeography" matches 25 events, more than the 20 on a page of results.
 */

function getResults(page: Page): Locator {
	return page.getByRole("main").getByRole("article");
}

test.describe("/search", () => {
	test("commits the static shell instantly, streaming the results behind it", async ({ page, baseURL }) => {
		await instant(
			page,
			async () => {
				await page.goto("/search");

				await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
				await expect(page.getByText("Loading results…")).toBeVisible();
			},
			{ baseURL },
		);

		await expect(page.getByText("Loading results…")).toBeHidden();
	});

	test("lists nothing until there is a query or a category", async ({ page }) => {
		await page.goto("/search");

		await expect(page.getByRole("searchbox", { name: "Search the website" })).toBeVisible();
		await expect(page.getByRole("heading", { level: 2, name: /results?\b/ })).toBeHidden();
		await expect(getResults(page)).toHaveCount(0);
	});

	test("lists the results for the query in the url, and fills in the form with it", async ({ page }) => {
		await page.goto("/search?q=lexicography");

		await expect(page.getByRole("searchbox", { name: "Search the website" })).toHaveValue("lexicography");
		await expect(page.getByRole("heading", { level: 2, name: "4 results for “lexicography”" })).toBeVisible();
		await expect(getResults(page)).toHaveCount(4);

		const workingGroup = getResults(page).filter({ hasText: "Lexicography working group" });
		await expect(workingGroup).toContainText("Working group");
		await expect(workingGroup.getByRole("link", { name: "Lexicography working group" })).toHaveAttribute(
			"href",
			"/network/working-groups/lexicography",
		);

		/** Resources link to where they are published. */
		await expect(page.getByRole("link", { name: "Introduction to digital lexicography" })).toHaveAttribute(
			"href",
			"https://campus.dariah.eu/resources/introduction-to-digital-lexicography",
		);
	});

	test("updates the url and the results as the user types, without adding history entries", async ({ page }) => {
		await page.goto("/");
		await page.goto("/search");

		const searchbox = page.getByRole("searchbox", { name: "Search the website" });
		await waitForHydration(searchbox);
		await searchbox.pressSequentially("lexicography");

		/**
		 * The url changes once the last keystroke's search has rendered, as the router drops the ones before it; under
		 * load, e.g. against a dev server, that can take longer than an assertion's default timeout.
		 */
		await expect(page).toHaveURL("/search?q=lexicography", { timeout: 15_000 });
		await expect(page.getByRole("heading", { level: 2, name: "4 results for “lexicography”" })).toBeVisible();
		await expect(getResults(page)).toHaveCount(4);

		/** Each keystroke replaced the history entry, so going back leaves the search page. */
		await page.goBack();
		await expect(page).toHaveURL("/");
	});

	test("narrows the results to a category", async ({ page }) => {
		await page.goto("/search?q=lexicography");

		await expect(getResults(page)).toHaveCount(4);

		/** Named by its value, then its label. */
		await page.getByRole("button", { name: /\bCategory$/ }).click();
		await page.getByRole("option", { name: "Event" }).click();

		await expect(page).toHaveURL("/search?q=lexicography&type=event");
		await expect(page.getByRole("heading", { level: 2, name: "1 result for “lexicography”" })).toBeVisible();
		await expect(getResults(page)).toHaveCount(1);
		await expect(getResults(page)).toContainText("Lexicography summer school");
	});

	test("suggests other searches when nothing matches", async ({ page }) => {
		await page.goto("/search?q=lexicography&type=person");

		await expect(page.getByRole("heading", { level: 2, name: "0 results for “lexicography”" })).toBeVisible();
		await expect(getResults(page)).toHaveCount(0);

		await expect(page.getByRole("link", { name: "Search all categories" })).toHaveAttribute(
			"href",
			"/search?q=lexicography",
		);
		await expect(page.getByRole("link", { name: "Search the Resource Catalogue" })).toHaveAttribute(
			"href",
			"/resources/resource-catalogue?q=lexicography",
		);
	});

	test("pages through the results", async ({ page }) => {
		await page.goto("/search?q=palaeography");

		await expect(page.getByRole("heading", { level: 2, name: "25 results for “palaeography”" })).toBeVisible();
		await expect(getResults(page)).toHaveCount(20);
		await expect(getResults(page).first()).toContainText("Palaeography workshop, session 25");

		await page.getByRole("navigation", { name: "Pagination" }).getByRole("link", { name: "Next page" }).click();

		await expect(page).toHaveURL("/search?q=palaeography&page=2");
		await expect(getResults(page)).toHaveCount(5);
		await expect(getResults(page).last()).toContainText("Palaeography workshop, session 01");
	});

	/**
	 * An html-limited bot (see `htmlLimitedBots`) gets a `404`: it waits for the page's metadata, which rejects the
	 * category, before the response. Anyone else gets a `200`: the results stream in after the page's shell, whose status
	 * has been sent by then.
	 */
	test("shows the not-found page for an unknown category", async ({ page, request }) => {
		const response = await request.get("/search?q=lexicography&type=unknown", { headers: bot });

		expect(response.status()).toBe(404);

		await page.goto("/search?q=lexicography&type=unknown");

		await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
	});
});

test.describe("/search without javascript", () => {
	test.use({ javaScriptEnabled: false });

	/**
	 * The form is rendered inside the page's suspense boundary, and without javascript react cannot swap the streamed
	 * content in for the fallback, so only the skeleton is ever shown.
	 */
	test.fixme("submits the query as an ordinary form", async ({ page }) => {
		await page.goto("/search");

		await page.getByRole("searchbox", { name: "Search the website" }).fill("lexicography");
		await page.getByRole("button", { name: "Search", exact: true }).click();

		/** The category's hidden select is submitted as well, empty for all categories. */
		await expect(page).toHaveURL("/search?q=lexicography&type=");
		await expect(page.getByRole("heading", { level: 2, name: "4 results for “lexicography”" })).toBeVisible();
		await expect(getResults(page)).toHaveCount(4);
	});
});
