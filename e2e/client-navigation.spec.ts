import type { Locator, Page } from "@playwright/test";

import { waitForHydration } from "#/e2e/lib/hydration.ts";
import { expect, test } from "#/e2e/lib/test.ts";

/**
 * What assistive technology learns of a client-side navigation, which replaces the page without loading a new document.
 *
 * Next announces the new page's `document.title` in a live region of its own - `#__next-route-announcer__`, in a shadow
 * root, which playwright's css locators pierce - but only when the title differs from the previous page's. It reads the
 * title once the new page has rendered, which can be before its metadata has streamed in: then the title is empty, and
 * next falls back to the page's `<h1>`, which names the page as well.
 *
 * Next leaves focus where it was, see `InnerScrollHandler` in next's `layout-router.js`, so `FocusOnNavigation` moves
 * it back to the top of the document, as loading a new document would, and the next `Tab` goes to the skip link.
 */

function getAnnouncer(page: Page): Locator {
	// oxlint-disable-next-line playwright/no-raw-locators -- Its role, `alert`, is shared with the page's own alerts.
	return page.locator("#__next-route-announcer__");
}

function getNavigation(page: Page): Locator {
	return page.getByRole("navigation", { name: "Main" });
}

/**
 * Asserts that focus is back at the top of the document: on the empty element rendered first in the page (see
 * `focusPageTop`), so the next `Tab` goes to the skip link. Waits for it first, as the old page may still be shown,
 * e.g. the previous page of a list, with the same heading.
 */
async function expectFocusAtTop(page: Page): Promise<void> {
	await expect.poll(() => page.evaluate(() => document.activeElement?.id === "page-top-focus-target")).toBe(true);
	await page.keyboard.press("Tab");
	await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
}

async function gotoHydrated(page: Page, url: string): Promise<void> {
	await page.goto(url);
	await waitForHydration(getNavigation(page));
}

/** Asserts that the page shown has been announced, by its title or, if that was not there yet, by its `<h1>`. */
async function expectAnnounced(page: Page): Promise<void> {
	await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
	/** Once the metadata has streamed in, so that an empty announcement is not taken for an empty title. */
	await expect(page).toHaveTitle(/\S/);

	const names = new Set([await page.title(), await page.getByRole("heading", { level: 1 }).innerText()]);

	await expect.poll(async () => names.has(await getAnnouncer(page).innerText())).toBe(true);
}

test.describe("route announcements", () => {
	test("announce nothing on the initial page load, which screen readers announce themselves", async ({ page }) => {
		await gotoHydrated(page, "/");

		await expect(getAnnouncer(page)).toBeAttached();
		await expect(getAnnouncer(page)).toHaveText("");
	});

	test("announce the new page after following a link", async ({ page }) => {
		await gotoHydrated(page, "/");

		const previous = await page.title();

		await getNavigation(page).getByRole("button", { name: "About" }).click();
		await getNavigation(page).getByRole("link", { name: "Strategy" }).click();

		await expect(page).toHaveURL("/about/strategy");
		await expect(page).not.toHaveTitle(previous);
		await expectAnnounced(page);
	});

	test("announce the page when the browser goes back", async ({ page }) => {
		await gotoHydrated(page, "/");

		await getNavigation(page).getByRole("button", { name: "About" }).click();
		await getNavigation(page).getByRole("link", { name: "Strategy" }).click();
		await expect(page).toHaveURL("/about/strategy");

		await page.goBack();

		await expect(page).toHaveURL("/");
		await expectAnnounced(page);
	});

	/**
	 * Every page of a paginated list has the same heading, so the page number is in its title, and visually hidden in its
	 * `<h1>`, which next falls back to while the title is still empty.
	 */
	test("announce the page number when paging through a list", async ({ page }) => {
		await gotoHydrated(page, "/news");

		await page.getByRole("navigation", { name: "Pagination" }).getByRole("link", { name: "Next page" }).click();

		await expect(page).toHaveURL("/news/page/2");
		await expect(getAnnouncer(page)).toContainText("2");
	});
});

test.describe("focus after a client-side navigation", () => {
	test("moves to the top of the page after following a link in the primary navigation", async ({ page }) => {
		await gotoHydrated(page, "/");

		const trigger = getNavigation(page).getByRole("button", { name: "About" });

		await trigger.focus();
		await page.keyboard.press("Enter");
		await page.keyboard.press("Tab");
		await expect(getNavigation(page).getByRole("link", { name: "DARIAH in a nutshell" })).toBeFocused();

		/**
		 * The link hides with its list, so focus must move before it does: dropped to the document, it is announced by the
		 * document's name, the new page's title, which the route announcer then repeats.
		 */
		await page.evaluate(() => {
			document.addEventListener("focusout", (event) => {
				if (event.relatedTarget == null) {
					document.documentElement.dataset.focusDropped = "true";
				}
			});
		});

		await page.keyboard.press("Enter");

		await expect(page).toHaveURL("/about/dariah-in-a-nutshell");
		await expectAnnounced(page);
		await expectFocusAtTop(page);
		expect(await page.evaluate(() => document.documentElement.dataset.focusDropped)).toBeUndefined();
	});

	test("moves to the top of the page after following a pagination link", async ({ page }) => {
		await gotoHydrated(page, "/news");

		const link = page.getByRole("navigation", { name: "Pagination" }).getByRole("link", { name: "Next page" });

		await link.focus();
		await page.keyboard.press("Enter");

		await expect(page).toHaveURL("/news/page/2");
		await expectFocusAtTop(page);
	});

	test("moves to the top of the page when the browser goes back", async ({ page }) => {
		await gotoHydrated(page, "/");

		await getNavigation(page).getByRole("button", { name: "About" }).click();
		await getNavigation(page).getByRole("link", { name: "Strategy" }).click();
		await expect(page).toHaveURL("/about/strategy");

		await page.goBack();

		await expect(page).toHaveURL("/");
		await expectAnnounced(page);
		await expectFocusAtTop(page);
	});

	test.describe("on small screens", () => {
		test.use({ viewport: { width: 390, height: 844 } });

		/** The dialog restores focus to the menu button as it closes, which must not win over moving it to the top. */
		test("moves to the top of the page after following a link in the menu dialog", async ({ page }) => {
			await gotoHydrated(page, "/");

			await page.getByRole("button", { exact: true, name: "Menu" }).click();

			const dialog = page.getByRole("dialog", { name: "Menu" });

			await dialog.getByRole("button", { name: "About" }).click();
			await dialog.getByRole("link", { name: "Strategy" }).click();

			await expect(page).toHaveURL("/about/strategy");
			await expect(dialog).toBeHidden();
			await expectAnnounced(page);
			await expectFocusAtTop(page);
		});
	});
});
