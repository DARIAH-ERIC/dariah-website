import { instant } from "@next/playwright";

import { expect, test } from "#/e2e/lib/test.ts";

/**
 * Both tests check that every section is rendered with its data, not its suspense fallback: the fallbacks' screen
 * reader labels are absent, and the network figures hold numbers.
 */
test.describe("/", () => {
	test("commits the whole page instantly: nothing on this route depends on per-request data", async ({
		page,
		baseURL,
	}) => {
		await instant(
			page,
			async () => {
				await page.goto("/");

				await expect(
					page.getByRole("heading", { level: 1, name: "Digital Research Infrastructure for Arts and Humanities" }),
				).toBeVisible();
				await expect(page.getByRole("definition").first()).toHaveText(/\d/);
				await expect(page.getByText("Loading announcements…")).toBeHidden();
				await expect(page.getByText("Loading events…")).toBeHidden();
				await expect(page.getByText("Loading…", { exact: true })).toBeHidden();
			},
			{ baseURL },
		);
	});

	test("commits the whole page instantly on a client-side navigation", async ({ page }) => {
		await page.goto("/news");
		await expect(page.getByRole("navigation", { name: "Pagination" })).toBeVisible();

		await instant(page, async () => {
			await page.getByRole("link", { name: "DARIAH-EU Home" }).click();

			await expect(
				page.getByRole("heading", { level: 1, name: "Digital Research Infrastructure for Arts and Humanities" }),
			).toBeVisible();
			await expect(page.getByRole("definition").first()).toHaveText(/\d/);
			await expect(page.getByText("Loading announcements…")).toBeHidden();
			await expect(page.getByText("Loading events…")).toBeHidden();
			await expect(page.getByText("Loading…", { exact: true })).toBeHidden();
		});
	});
});
