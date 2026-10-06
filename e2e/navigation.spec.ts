import type { Locator, Page } from "@playwright/test";

import { expect, test } from "#/e2e/lib/test.ts";

/**
 * The primary navigation follows the aria practices guide's disclosure navigation menu pattern.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/examples/disclosure-navigation/
 */

function getNavigation(page: Page): Locator {
	return page.getByRole("navigation", { name: "Main" });
}

function getTrigger(page: Page, name: string): Locator {
	return getNavigation(page).getByRole("button", { name });
}

/**
 * Resolves once react has hydrated the header, i.e. once its buttons respond to keys. `goto` alone resolves on `load`,
 * which is before the client bundle has run, and a key pressed until then is lost; react marks each node it has
 * hydrated with a `__reactFiber$…` property.
 */
async function gotoHydrated(page: Page, url: string): Promise<void> {
	await page.goto(url);
	await page.waitForFunction(() => {
		const header = document.querySelector("header");

		return header != null && Object.keys(header).some((key) => key.startsWith("__reactFiber"));
	});
}

/** Exact, so as not to match the dialog's "Close menu" button. */
function getMenuButton(page: Page): Locator {
	return page.getByRole("button", { exact: true, name: "Menu" });
}

function getDialog(page: Page): Locator {
	return page.getByRole("dialog", { name: "Menu" });
}

function getDialogLink(page: Page, name: string): Locator {
	return getDialog(page).getByRole("link", { name });
}

/** The list a trigger discloses, resolved the way assistive technology does: via the button's `aria-controls`. */
async function getDisclosedList(page: Page, trigger: Locator): Promise<Locator> {
	const id = await trigger.getAttribute("aria-controls");

	expect(id).not.toBeNull();

	return page.locator(`[id="${String(id)}"]`);
}

test.describe("primary navigation", () => {
	test.beforeEach(async ({ page }) => {
		await gotoHydrated(page, "/");
	});

	test("discloses a section's links on click, and hides them again on a second click", async ({ page }) => {
		const trigger = getTrigger(page, "About");
		const link = getNavigation(page).getByRole("link", { name: "Strategy" });

		await expect(trigger).toHaveAttribute("aria-expanded", "false");
		await expect(link).toBeHidden();

		await trigger.click();

		await expect(trigger).toHaveAttribute("aria-expanded", "true");
		await expect(link).toBeVisible();

		await trigger.click();

		await expect(trigger).toHaveAttribute("aria-expanded", "false");
		await expect(link).toBeHidden();
	});

	test("controls the disclosed list via aria-controls", async ({ page }) => {
		const trigger = getTrigger(page, "About");
		const list = await getDisclosedList(page, trigger);

		await expect(list).toBeHidden();

		await trigger.click();

		await expect(list).toBeVisible();
		await expect(list.getByRole("link", { name: "Strategy" })).toBeVisible();
	});

	test("opens only one section at a time", async ({ page }) => {
		const about = getTrigger(page, "About");
		const network = getTrigger(page, "Network");

		await about.click();
		await expect(about).toHaveAttribute("aria-expanded", "true");

		await network.click();

		await expect(network).toHaveAttribute("aria-expanded", "true");
		await expect(about).toHaveAttribute("aria-expanded", "false");
	});

	test("closes on escape and moves focus back to the button", async ({ page }) => {
		const trigger = getTrigger(page, "About");

		await trigger.focus();
		await page.keyboard.press("Enter");
		await expect(trigger).toHaveAttribute("aria-expanded", "true");

		await page.keyboard.press("Tab");
		await expect(getNavigation(page).getByRole("link", { name: "DARIAH in a nutshell" })).toBeFocused();

		await page.keyboard.press("Escape");

		await expect(trigger).toHaveAttribute("aria-expanded", "false");
		await expect(trigger).toBeFocused();
	});

	test("closes when focus leaves the section", async ({ page }) => {
		const trigger = getTrigger(page, "About");

		await trigger.focus();
		await page.keyboard.press("Space");
		await expect(trigger).toHaveAttribute("aria-expanded", "true");

		/** Tab through every disclosed link, and past the last one. */
		const list = await getDisclosedList(page, trigger);
		const count = await list.getByRole("link").count();

		for (let index = 0; index <= count; index++) {
			// oxlint-disable-next-line no-await-in-loop -- Key presses are sequential by nature.
			await page.keyboard.press("Tab");
		}

		await expect(trigger).toHaveAttribute("aria-expanded", "false");
		await expect(getTrigger(page, "Network")).toBeFocused();
	});

	test("closes when clicking outside the navigation", async ({ page }) => {
		const trigger = getTrigger(page, "About");

		await trigger.click();
		await expect(trigger).toHaveAttribute("aria-expanded", "true");

		/** Well away from the bar and its dropdown. */
		await page.mouse.click(1000, 600);

		await expect(trigger).toHaveAttribute("aria-expanded", "false");
	});

	test("closes when following a disclosed link", async ({ page }) => {
		const trigger = getTrigger(page, "About");

		await trigger.click();
		await getNavigation(page).getByRole("link", { name: "Strategy" }).click();

		await expect(page).toHaveURL("/about/strategy");
		await expect(trigger).toHaveAttribute("aria-expanded", "false");
		await expect(getNavigation(page).getByRole("link", { name: "Strategy" })).toBeHidden();
	});

	test("closes when following a link to the page already shown", async ({ page }) => {
		await gotoHydrated(page, "/about/strategy");

		const trigger = getTrigger(page, "About");

		await trigger.click();
		await getNavigation(page).getByRole("link", { name: "Strategy" }).click();

		await expect(page).toHaveURL("/about/strategy");
		await expect(trigger).toHaveAttribute("aria-expanded", "false");
	});

	test("positions the disclosed list just below the button's start edge", async ({ page }) => {
		const trigger = getTrigger(page, "About");

		await trigger.click();

		const list = await getDisclosedList(page, trigger);
		const triggerBox = await trigger.boundingBox();
		const listBox = await list.boundingBox();

		/** Within a pixel: react-aria rounds the computed offsets. The list sits `offset` (4px) below the button. */
		expect(Math.abs((listBox?.x ?? Number.NaN) - (triggerBox?.x ?? Number.NaN))).toBeLessThanOrEqual(1);
		expect(
			Math.abs((listBox?.y ?? Number.NaN) - ((triggerBox?.y ?? Number.NaN) + (triggerBox?.height ?? Number.NaN) + 4)),
		).toBeLessThanOrEqual(1);
	});

	test("keeps the disclosed list inside the viewport", async ({ page }) => {
		/**
		 * The bar only shows from `xl` up, where the last list fits as it is, so it is widened until it would overflow the
		 * end edge.
		 */
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.addStyleTag({ content: "[data-navigation-menu-content] { min-inline-size: 24rem; }" });

		const trigger = getTrigger(page, "Get involved");

		await trigger.click();

		const list = await getDisclosedList(page, trigger);
		const triggerBox = await trigger.boundingBox();
		const listBox = await list.boundingBox();

		expect(listBox).not.toBeNull();
		expect((listBox?.x ?? 0) + (listBox?.width ?? 0)).toBeLessThanOrEqual(1280);
		/** Shifted along the bar, not shrunk: the list still spans the button. */
		expect(listBox?.x).toBeLessThanOrEqual(triggerBox?.x ?? 0);
		expect((listBox?.x ?? 0) + (listBox?.width ?? 0)).toBeGreaterThanOrEqual(
			(triggerBox?.x ?? 0) + (triggerBox?.width ?? 0),
		);
	});

	test("caps the disclosed list's height to the viewport and scrolls it", async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 220 });

		const trigger = getTrigger(page, "About");

		await trigger.click();

		const list = await getDisclosedList(page, trigger);
		const listBox = await list.boundingBox();

		expect((listBox?.y ?? 0) + (listBox?.height ?? 0)).toBeLessThanOrEqual(220);
		expect(await list.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
	});

	test("marks the link to the current page", async ({ page }) => {
		await gotoHydrated(page, "/about/strategy");

		/** The links are marked in the server-rendered html already, i.e. while their list is still collapsed. */
		const links = getNavigation(page).getByRole("link", { includeHidden: true });

		await expect(links.filter({ hasText: "Strategy" })).toHaveAttribute("aria-current", "page");
		await expect(links.filter({ hasText: "DARIAH in a nutshell" })).not.toHaveAttribute("aria-current", "page");
	});

	test("moves focus with arrow keys, home and end", async ({ page }) => {
		const about = getTrigger(page, "About");
		const network = getTrigger(page, "Network");

		await about.focus();

		/** Among the top-level items. */
		await page.keyboard.press("ArrowRight");
		await expect(network).toBeFocused();

		await page.keyboard.press("ArrowLeft");
		await expect(about).toBeFocused();

		await page.keyboard.press("End");
		await expect(getTrigger(page, "Get involved")).toBeFocused();

		await page.keyboard.press("Home");
		await expect(about).toBeFocused();

		/** Down on a collapsed button moves on; down on a disclosed button moves into its list. */
		await page.keyboard.press("ArrowDown");
		await expect(network).toBeFocused();

		await page.keyboard.press("ArrowLeft");
		await page.keyboard.press("Enter");
		await page.keyboard.press("ArrowDown");

		const first = getNavigation(page).getByRole("link", { name: "DARIAH in a nutshell" });
		const second = getNavigation(page).getByRole("link", { name: "Strategy" });

		await expect(first).toBeFocused();

		/** Within the disclosed list. */
		await page.keyboard.press("ArrowDown");
		await expect(second).toBeFocused();

		await page.keyboard.press("ArrowUp");
		await expect(first).toBeFocused();

		await page.keyboard.press("End");
		await expect(getNavigation(page).getByRole("link", { name: "Documents and policies" })).toBeFocused();

		await page.keyboard.press("Home");
		await expect(first).toBeFocused();

		/** Arrow keys never leave the disclosed list, and the page does not scroll. */
		await page.keyboard.press("ArrowUp");
		await expect(first).toBeFocused();
		await expect(about).toHaveAttribute("aria-expanded", "true");
	});
});

test.describe("primary navigation on small screens", () => {
	test.use({ viewport: { width: 390, height: 844 } });

	test.beforeEach(async ({ page }) => {
		await gotoHydrated(page, "/");
	});

	test("replaces the bar with a menu button which opens a dialog", async ({ page }) => {
		/** The landmark holds the menu button while the dialog, and with it the menu, is closed. */
		await expect(getNavigation(page)).toHaveCount(1);
		await expect(getNavigation(page).getByRole("button", { exact: true, name: "Menu" })).toBeVisible();
		await expect(getDialog(page)).toBeHidden();

		await getMenuButton(page).click();

		await expect(getDialog(page)).toBeVisible();
		/** The landmark around the menu button is hidden from assistive technology while the dialog is open. */
		await expect(getNavigation(page)).toHaveCount(1);
		await expect(getDialog(page).getByRole("navigation", { name: "Main" })).toBeVisible();
		await expect(getTrigger(page, "About")).toBeVisible();
	});

	test("closes via the close button, and moves focus back to the menu button", async ({ page }) => {
		const open = getMenuButton(page);

		await open.focus();
		await page.keyboard.press("Enter");
		await getDialog(page).getByRole("button", { name: "Close menu" }).click();

		await expect(getDialog(page)).toBeHidden();
		await expect(open).toBeFocused();
	});

	test("discloses a section in place, and escape closes the dialog", async ({ page }) => {
		const open = getMenuButton(page);

		await open.click();

		const trigger = getTrigger(page, "About");
		const link = getDialogLink(page, "Strategy");

		await expect(link).toBeHidden();

		await trigger.click();

		await expect(trigger).toHaveAttribute("aria-expanded", "true");
		await expect(link).toBeVisible();

		await link.focus();
		await page.keyboard.press("Escape");

		await expect(getDialog(page)).toBeHidden();
		await expect(open).toBeFocused();
	});

	test("switches to another section with a single tap", async ({ page }) => {
		await getMenuButton(page).click();

		const about = getTrigger(page, "About");
		const network = getTrigger(page, "Network");

		await about.click();
		await expect(about).toHaveAttribute("aria-expanded", "true");

		/** Collapsing "About" on `pointerdown` would move "Network" from under the pointer before `pointerup`. */
		await network.click();

		await expect(network).toHaveAttribute("aria-expanded", "true");
		await expect(about).toHaveAttribute("aria-expanded", "false");
		await expect(getDialogLink(page, "Strategy")).toBeHidden();
		await expect(getDialogLink(page, "Working groups")).toBeVisible();
	});

	test("discloses the section holding the current page when opened", async ({ page }) => {
		await gotoHydrated(page, "/about/strategy");
		await getMenuButton(page).click();

		const about = getTrigger(page, "About");
		const link = getDialogLink(page, "Strategy");

		await expect(about).toHaveAttribute("aria-expanded", "true");
		await expect(link).toHaveAttribute("aria-current", "page");

		/** Only on opening: collapsing it afterwards sticks. */
		await about.click();

		await expect(about).toHaveAttribute("aria-expanded", "false");
		await expect(link).toBeHidden();
	});

	test("closes when following a link", async ({ page }) => {
		await getMenuButton(page).click();
		await getTrigger(page, "About").click();
		await getDialog(page).getByRole("link", { name: "Strategy" }).click();

		await expect(page).toHaveURL("/about/strategy");
		await expect(getDialog(page)).toBeHidden();
	});

	test("closes when following a link to the page already shown", async ({ page }) => {
		await gotoHydrated(page, "/projects");
		await getMenuButton(page).click();
		await getDialog(page).getByRole("link", { name: "Projects" }).click();

		await expect(page).toHaveURL("/projects");
		await expect(getDialog(page)).toBeHidden();
	});

	test("closes when the browser goes back", async ({ page }) => {
		/** Navigate once, so there is a history entry to go back to. */
		await getMenuButton(page).click();
		await getDialog(page).getByRole("link", { name: "Projects" }).click();
		await expect(page).toHaveURL("/projects");

		await getMenuButton(page).click();
		await expect(getDialog(page)).toBeVisible();

		await page.goBack();

		await expect(page).toHaveURL("/");
		await expect(getDialog(page)).toBeHidden();
	});

	test("keeps focus inside the dialog", async ({ page }) => {
		await getMenuButton(page).click();

		const dialog = getDialog(page);
		const first = dialog.getByRole("link", { name: "DARIAH-EU" });
		const last = dialog.getByRole("link", { name: "Search" });

		await first.focus();
		await page.keyboard.press("Shift+Tab");

		/** Wrapped around to the last focusable element instead of leaving the dialog. */
		await expect(last).toBeFocused();

		await page.keyboard.press("Tab");

		await expect(first).toBeFocused();
	});
});
