import { instant } from "@next/playwright";
import type { Locator, Page } from "@playwright/test";

import { waitForHydration } from "#/e2e/lib/hydration.ts";
import { expect, test } from "#/e2e/lib/test.ts";

test.describe("/events", () => {
	test("commits the static shell instantly, streaming the events list behind it", async ({ page, baseURL }) => {
		await instant(
			page,
			async () => {
				await page.goto("/events");

				await expect(page.getByRole("heading", { level: 1, name: "Events" })).toBeVisible();
				await expect(page.getByText("Loading events…")).toBeVisible();
				await expect(page.getByRole("button", { name: "Find events" })).toBeHidden();
			},
			{ baseURL },
		);

		await expect(page.getByRole("button", { name: "Find events" })).toBeVisible();
	});
});

test.describe("/events/calendar", () => {
	test("commits the static shell instantly, streaming the month's events behind it", async ({ page }) => {
		await page.goto("/events");
		await expect(page.getByRole("button", { name: "Find events" })).toBeVisible();

		await instant(page, async () => {
			await page.getByRole("navigation", { name: "View as" }).getByRole("link", { name: "Month" }).click();

			await expect(page).toHaveURL(/\/events\/calendar/);
			await expect(page.getByRole("heading", { level: 1, name: "Events" })).toBeVisible();
			await expect(page.getByText("Loading events…")).toBeVisible();
			await expect(page.getByRole("navigation", { name: "Months" })).toBeHidden();
		});

		await expect(page.getByRole("navigation", { name: "Months" })).toBeVisible();
	});
});

/**
 * The events come from the api, so these tests check what any content satisfies: the order of the months listed, and
 * the urls the controls lead to. The date field is typed in the locale's order, day, month and year.
 */

/** The months the events list is grouped by, as the first day of each, e.g. `2024-03-01`. */
async function getListedMonths(page: Page): Promise<Array<string>> {
	const headings = await page.getByRole("main").getByRole("heading", { level: 2 }).allTextContents();

	return headings.map((heading) => {
		const date = new Date(`1 ${heading} UTC`);
		return date.toISOString().slice(0, 10);
	});
}

/**
 * The value the date field submits, held by a hidden input. React-aria renders a second, native date input with the
 * same name, which belongs to no form (`form=""`).
 */
function getSubmittedDate(page: Page, name: "anchor" | "month"): Locator {
	// oxlint-disable-next-line playwright/no-raw-locators -- A hidden input has no role.
	return page.locator(`input[name="${name}"]:not([type="date"])`);
}

async function enterDate(page: Page, day: string, month: string, year: string): Promise<void> {
	const field = page.getByRole("group", { name: "Events starting from" });
	const segment = field.getByRole("spinbutton", { name: /^day\b/ });
	await waitForHydration(segment);
	await segment.click();
	await page.keyboard.type(`${day}${month}${year}`);
}

test.describe("/events filter", () => {
	test("lists the events from the date entered, in chronological order", async ({ page }) => {
		await page.goto("/events");

		await enterDate(page, "01", "03", "2024");
		await page.getByRole("button", { name: "Find events" }).click();

		await expect(page).toHaveURL("/events?anchor=2024-03-01");
		await expect(getSubmittedDate(page, "anchor")).toHaveValue("2024-03-01");

		const months = await getListedMonths(page);
		/** Not necessarily from March on: an event which started before the date, and ends after it, is listed as well. */
		expect(months.length).toBeGreaterThan(0);
		expect(months).toStrictEqual(months.toSorted());
	});

	test("walks back to the events before the date, still in chronological order", async ({ page }) => {
		await page.goto("/events?anchor=2024-03-01");

		await page.getByRole("link", { name: "See previous events" }).click();

		await expect(page).toHaveURL("/events?anchor=2024-03-01&direction=past");
		await expect(page.getByRole("main").getByRole("heading", { level: 2 }).first()).toBeVisible();

		const months = await getListedMonths(page);
		expect(months.length).toBeGreaterThan(0);
		/** A past event ended before the date, so it started before it, too. */
		expect(months.at(-1)! <= "2024-03-01").toBe(true);
		expect(months).toStrictEqual(months.toSorted());

		/** The first page of past events leads back across the date, to the first page of upcoming ones. */
		await expect(page.getByRole("link", { name: "See next events" })).toHaveAttribute(
			"href",
			"/events?anchor=2024-03-01",
		);
	});

	test("opens the calendar at the month of the date", async ({ page }) => {
		await page.goto("/events?anchor=2024-03-01");

		await expect(
			page.getByRole("navigation", { name: "View as" }).getByRole("link", { name: "Month" }),
		).toHaveAttribute("href", "/events/calendar?month=2024-03");
	});

	test("answers a malformed date with the not-found page", async ({ page }) => {
		await page.goto("/events?anchor=2024-13-45");

		await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
	});
});

test.describe("/events/calendar navigation", () => {
	test("shows the month in the url, and moves to the months around it", async ({ page }) => {
		await page.goto("/events/calendar?month=2024-03");

		await expect(page.getByRole("heading", { level: 2, name: "March 2024" })).toBeVisible();

		const months = page.getByRole("navigation", { name: "Months" });
		await expect(months.getByRole("link", { name: "Previous month: February 2024" })).toHaveAttribute(
			"href",
			"/events/calendar?month=2024-02",
		);

		await months.getByRole("link", { name: "Next month: April 2024" }).click();

		await expect(page).toHaveURL("/events/calendar?month=2024-04");
		await expect(page.getByRole("heading", { level: 2, name: "April 2024" })).toBeVisible();
	});

	test("shows the month of the date entered, and opens the list at its first day", async ({ page }) => {
		await page.goto("/events/calendar?month=2024-03");

		await expect(getSubmittedDate(page, "month")).toHaveValue("2024-03-01");

		await enterDate(page, "15", "06", "2024");
		await page.getByRole("button", { name: "Find events" }).click();

		/** The field submits the whole day, of which the calendar reads the month. */
		await expect(page).toHaveURL("/events/calendar?month=2024-06-15");
		await expect(page.getByRole("heading", { level: 2, name: "June 2024" })).toBeVisible();
		await expect(page.getByRole("navigation", { name: "View as" }).getByRole("link", { name: "List" })).toHaveAttribute(
			"href",
			"/events?anchor=2024-06-01",
		);
	});

	test("answers a malformed month with the not-found page", async ({ page }) => {
		await page.goto("/events/calendar?month=2024-13");

		await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
	});
});
