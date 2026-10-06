import { instant } from "@next/playwright";
import type { Locator, Page } from "@playwright/test";

import { waitForHydration } from "#/e2e/lib/hydration.ts";
import { expect, test } from "#/e2e/lib/test.ts";

test.describe("/network/working-groups", () => {
	test("commits the whole page instantly: nothing on this route depends on per-request data", async ({
		page,
		baseURL,
	}) => {
		await instant(
			page,
			async () => {
				await page.goto("/network/working-groups");

				await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
				await expect(page.getByRole("heading", { level: 2, name: "Active Working Groups" })).toBeAttached();
				await expect(page.getByRole("article").first()).toBeVisible();
			},
			{ baseURL },
		);
	});
});

test.describe("/network/working-groups/inactive", () => {
	test("commits the whole page instantly: nothing on this route depends on per-request data", async ({
		page,
		baseURL,
	}) => {
		await instant(
			page,
			async () => {
				await page.goto("/network/working-groups/inactive");

				await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
				await expect(page.getByRole("heading", { level: 2, name: "Past Working Groups" })).toBeAttached();
				await expect(page.getByRole("article").first()).toBeVisible();
			},
			{ baseURL },
		);
	});

	test("switches tabs instantly, keeping focus on the tab", async ({ page }) => {
		await page.goto("/network/working-groups");
		await expect(page.getByRole("heading", { level: 2, name: "Active Working Groups" })).toBeAttached();

		const tab = page
			.getByRole("navigation", { name: "Working group status" })
			.getByRole("link", { name: "Past Working Groups" });

		await instant(page, async () => {
			await tab.click();

			await expect(page).toHaveURL(/\/network\/working-groups\/inactive$/);
			await expect(page.getByRole("heading", { level: 2, name: "Past Working Groups" })).toBeAttached();
			await expect(page.getByRole("article").first()).toBeVisible();
		});

		await expect(tab).toHaveAttribute("aria-current", "page");
		await expect(tab).toBeFocused();
	});
});

test.describe("/network/members-and-partners", () => {
	test("commits the whole page instantly: nothing on this route depends on per-request data", async ({
		page,
		baseURL,
	}) => {
		await instant(
			page,
			async () => {
				await page.goto("/network/members-and-partners");

				await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
				await expect(page.getByRole("list").first()).toBeVisible();
			},
			{ baseURL },
		);
	});
});

/**
 * The countries come from the api, so these tests check the map against its own list, the map's accessible equivalent,
 * rather than against particular countries.
 */

/** The list beside the map, told from the breadcrumbs and the legend by its links to countries. */
function getCountryList(page: Page): Locator {
	return (
		page
			.getByRole("main")
			.getByRole("list")
			// oxlint-disable-next-line playwright/no-raw-locators -- Links are told apart by their target, which has no role.
			.filter({ has: page.locator('a[href^="/network/members-and-partners/"]') })
			.first()
	);
}

/** The map's country outlines: svg paths, which have no role. Interactive ones have a page and a tooltip. */
function getCountryOutlines(page: Page, status?: "member"): Locator {
	// oxlint-disable-next-line playwright/no-raw-locators -- Leaflet's svg paths have no role.
	return page.locator(`path.country${status != null ? `.country-${status}` : ""}.leaflet-interactive`);
}

test.describe("/network/members-and-partners map", () => {
	test.use({ viewport: { width: 1280, height: 900 } });

	test("narrows the list of countries to the status chosen", async ({ page }) => {
		await page.goto("/network/members-and-partners");

		const list = getCountryList(page);
		const all = await list.getByRole("listitem").count();
		expect(all).toBeGreaterThan(0);

		const show = page.getByRole("button", { name: /\bShow$/ });
		await waitForHydration(show);
		await show.click();
		await page.getByRole("option", { name: "Members", exact: true }).click();

		const members = list.getByRole("listitem");
		await expect.poll(() => members.count()).toBeLessThan(all);
		await Promise.all((await members.all()).map((item) => expect(item).toContainText(/Member$/)));

		await show.click();
		await page.getByRole("option", { name: "All countries" }).click();

		await expect(list.getByRole("listitem")).toHaveCount(all);
	});

	test("draws the countries, and opens a country's page on a click", async ({ page }) => {
		await page.goto("/network/members-and-partners");

		/** Leaflet loads with the outlines after hydration. */
		const countries = getCountryOutlines(page);
		await expect.poll(() => countries.count(), { timeout: 15_000 }).toBeGreaterThan(0);
		await expect(page.getByRole("button", { name: "Zoom in" })).toBeVisible();
		await expect(page.getByRole("button", { name: "Zoom out" })).toBeVisible();

		const hrefs = await getCountryList(page)
			.getByRole("link")
			.evaluateAll((links) => links.map((link) => link.getAttribute("href")));

		/** Dispatched, as the centre of a country's box may lie in the sea, or in a neighbour. */
		await getCountryOutlines(page, "member").first().dispatchEvent("click");

		await expect(page).toHaveURL(/\/network\/members-and-partners\/[^/?]+$/);
		expect(hrefs).toContain(new URL(page.url()).pathname);
	});
});
