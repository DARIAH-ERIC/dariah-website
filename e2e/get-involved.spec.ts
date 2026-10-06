import { instant } from "@next/playwright";
import type { Locator, Page } from "@playwright/test";

import { waitForHydration } from "#/e2e/lib/hydration.ts";
import { testPaginatedList } from "#/e2e/lib/paginated-list.ts";
import { expect, test } from "#/e2e/lib/test.ts";

testPaginatedList("/get-involved/funding-calls");

test.describe("/get-involved/opportunities", () => {
	test("commits the static shell instantly, streaming the opportunities list behind it", async ({ page, baseURL }) => {
		await instant(
			page,
			async () => {
				await page.goto("/get-involved/opportunities");

				await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
				await expect(page.getByText("Loading opportunities…")).toBeVisible();
			},
			{ baseURL },
		);

		await expect(page.getByText("Loading opportunities…")).toBeHidden();
	});
});

/**
 * The opportunities come from the api, so these tests check what any content satisfies: each card shows its status and
 * source as a badge, and every opportunity has exactly one status.
 */

function getCards(page: Page): Locator {
	return page.getByRole("main").getByRole("article");
}

/** Every card shows each of `labels`. */
async function expectEveryCardToShow(page: Page, labels: Array<string>): Promise<void> {
	const cards = await getCards(page).all();

	await Promise.all(cards.flatMap((card) => labels.map((label) => expect(card).toContainText(label))));
}

async function getTotal(page: Page, search: string): Promise<number> {
	await page.goto(`/get-involved/opportunities${search}`);
	const heading = page.getByRole("main").getByRole("heading", { level: 2, name: /^\d+ results?$/ });
	const text = await heading.textContent();

	return Number(/^\d+/.exec(text ?? "")?.[0]);
}

/** A select is named by its value, then its label. */
async function choose(page: Page, label: string, option: string): Promise<void> {
	const button = page.getByRole("button", { name: new RegExp(`\\b${label}$`) });
	await waitForHydration(button);
	await button.click();
	await page.getByRole("option", { name: option, exact: true }).click();
}

test.describe("/get-involved/opportunities filters", () => {
	/**
	 * The url changes once the list for the new value has rendered, which under load, e.g. against a dev server, can take
	 * longer than an assertion's default timeout.
	 */
	test("narrows the list to the availability and source chosen", async ({ page }) => {
		await page.goto("/get-involved/opportunities");

		await choose(page, "Availability", "Closed");

		await expect(page).toHaveURL("/get-involved/opportunities?status=closed", { timeout: 15_000 });
		await expect(page.getByRole("button", { name: /^Closed\b/ })).toBeVisible();
		await expectEveryCardToShow(page, ["Closed"]);

		await choose(page, "Source", "External");

		await expect(page).toHaveURL("/get-involved/opportunities?status=closed&source=external", { timeout: 15_000 });
		await expectEveryCardToShow(page, ["Closed", "External"]);

		await choose(page, "Availability", "All");

		await expect(page).toHaveURL("/get-involved/opportunities?source=external", { timeout: 15_000 });
	});

	test("counts every opportunity under exactly one availability", async ({ page }) => {
		const total = await getTotal(page, "");
		const byStatus = await Promise.all(
			["open", "upcoming", "closed"].map(async (status) => {
				const statusPage = await page.context().newPage();
				const count = await getTotal(statusPage, `?status=${status}`);
				await statusPage.close();
				return count;
			}),
		);

		expect(byStatus.reduce((sum, count) => sum + count, 0)).toBe(total);
	});

	test("answers an unknown availability with the not-found page", async ({ page }) => {
		await page.goto("/get-involved/opportunities?status=unknown");

		await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
	});
});
