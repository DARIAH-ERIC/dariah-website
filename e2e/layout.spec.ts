import { waitForHydration } from "#/e2e/lib/hydration.ts";
import { expect, test } from "#/e2e/lib/test.ts";

/** What every page shares: the skip link before the header, and the back-to-top link after the footer. */

test.describe("skip link", () => {
	test("is the first stop when tabbing, and moves past the header to the main content", async ({ page }) => {
		await page.goto("/news");

		await page.keyboard.press("Tab");

		const link = page.getByRole("link", { name: "Skip to main content" });
		await expect(link).toBeFocused();
		await expect(link).toBeInViewport();

		await page.keyboard.press("Enter");

		await expect(page).toHaveURL(/#main-content$/);
		/** The next stop is inside the main content, not the header's navigation. */
		await page.keyboard.press("Tab");
		await expect.poll(() => page.evaluate(() => document.activeElement?.closest("main") != null)).toBe(true);
	});
});

test.describe("back-to-top link", () => {
	test.use({ viewport: { width: 390, height: 844 } });

	test("shows once the page has been scrolled two screens, and jumps back to the top", async ({ page }) => {
		await page.goto("/news");

		const link = page.getByRole("link", { name: "Back to top" });
		await waitForHydration(page.getByRole("link", { name: "Skip to main content" }));

		/** `visibility: hidden` takes it out of the accessibility tree as well. */
		await expect(link).toBeHidden();

		await page.evaluate(() => {
			window.scrollTo(0, window.innerHeight * 3);
		});

		await expect(link).toBeVisible();

		await link.click();

		await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
		await expect(link).toBeHidden();
	});

	test("is left out on wide screens", async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 900 });
		await page.goto("/news");
		await waitForHydration(page.getByRole("link", { name: "Skip to main content" }));

		await page.evaluate(() => {
			window.scrollTo(0, window.innerHeight * 3);
		});

		await expect(page.getByRole("link", { name: "Back to top" })).toBeHidden();
	});
});
