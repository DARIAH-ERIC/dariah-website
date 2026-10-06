import { instant } from "@next/playwright";

import { expect, test } from "#/e2e/lib/test.ts";

test.describe("/projects", () => {
	test("commits the whole page instantly: nothing on this route depends on per-request data", async ({
		page,
		baseURL,
	}) => {
		await instant(
			page,
			async () => {
				await page.goto("/projects");

				await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
				await expect(page.getByRole("heading", { level: 2, name: "Active Projects" })).toBeAttached();
				await expect(page.getByRole("article").first()).toBeVisible();
			},
			{ baseURL },
		);
	});
});

test.describe("/projects/inactive", () => {
	test("commits the whole page instantly: nothing on this route depends on per-request data", async ({
		page,
		baseURL,
	}) => {
		await instant(
			page,
			async () => {
				await page.goto("/projects/inactive");

				await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
				await expect(page.getByRole("heading", { level: 2, name: "Past Projects" })).toBeAttached();
				await expect(page.getByRole("article").first()).toBeVisible();
			},
			{ baseURL },
		);
	});

	test("switches tabs instantly, keeping focus on the tab", async ({ page }) => {
		await page.goto("/projects");
		await expect(page.getByRole("heading", { level: 2, name: "Active Projects" })).toBeAttached();

		const tab = page.getByRole("navigation", { name: "Project status" }).getByRole("link", { name: "Past Projects" });

		await instant(page, async () => {
			await tab.click();

			await expect(page).toHaveURL(/\/projects\/inactive$/);
			await expect(page.getByRole("heading", { level: 2, name: "Past Projects" })).toBeAttached();
			await expect(page.getByRole("article").first()).toBeVisible();
		});

		await expect(tab).toHaveAttribute("aria-current", "page");
		await expect(tab).toBeFocused();
	});
});
