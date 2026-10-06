import { expect, test } from "#/e2e/lib/test.ts";

test.describe("table of contents", () => {
	test("links to the sections of a content page, and marks the one being read", async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto("/get-involved/join-dariah");

		const tableOfContents = page.getByRole("navigation", { name: "On this page" });

		await expect(tableOfContents).toBeVisible();

		const first = tableOfContents.getByRole("link").first();
		const last = tableOfContents.getByRole("link").last();

		/** The page opens at the top, so the first section is the one being read. */
		await expect(first).toHaveAttribute("aria-current", "true");
		await expect(last).not.toHaveAttribute("aria-current", "true");

		await last.click();

		await expect(page.getByRole("heading", { name: await last.innerText() })).toBeInViewport();
		await expect(last).toHaveAttribute("aria-current", "true");
		await expect(first).not.toHaveAttribute("aria-current", "true");
	});

	test("is left out where there is no room for it beside the content", async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 800 });
		await page.goto("/get-involved/join-dariah");

		await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
		await expect(page.getByRole("navigation", { name: "On this page" })).toBeHidden();
	});
});
