import { instant } from "@next/playwright";

import { bot } from "#/e2e/lib/bot.ts";
import { expect, test } from "#/e2e/lib/test.ts";

/**
 * The tests every paginated list shares - see `lib/navigation/page-segment.ts`: its first page at `pathname` and its
 * second at `pathname/page/2` are prerendered whole, and the pagination links between them navigate instantly. Needs a
 * list of at least two pages.
 */
export function testPaginatedList(pathname: string): void {
	test.describe(pathname, () => {
		test("commits the whole page instantly: nothing on this route depends on per-request data", async ({
			page,
			baseURL,
		}) => {
			await instant(
				page,
				async () => {
					await page.goto(pathname);

					await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
					await expect(page.getByRole("article").first()).toBeVisible();
					await expect(page.getByRole("navigation", { name: "Pagination" })).toBeVisible();
				},
				{ baseURL },
			);
		});
	});

	test.describe(`${pathname}/page/[page]`, () => {
		test("commits the whole page instantly: nothing on this route depends on per-request data", async ({
			page,
			baseURL,
		}) => {
			await instant(
				page,
				async () => {
					await page.goto(`${pathname}/page/2`);

					await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
					await expect(page.getByRole("article").first()).toBeVisible();
					await expect(page.getByRole("navigation", { name: "Pagination" }).getByText("Page 2")).toHaveAttribute(
						"aria-current",
						"page",
					);
				},
				{ baseURL },
			);
		});

		test("navigates to the next page instantly", async ({ page }) => {
			await page.goto(pathname);

			const pagination = page.getByRole("navigation", { name: "Pagination" });

			await expect(pagination).toBeVisible();

			await instant(page, async () => {
				await pagination.getByRole("link", { name: "Next page" }).click();

				await expect(page).toHaveURL(new RegExp(`${pathname}/page/2$`));
				await expect(pagination.getByText("Page 2")).toHaveAttribute("aria-current", "page");
				await expect(page.getByRole("article").first()).toBeVisible();
			});
		});

		/**
		 * A real `404` status only for an html-limited bot (see `htmlLimitedBots`), which gets the metadata before the
		 * response starts; anyone else gets the route's shell, and the page's `notFound()` streams in behind it.
		 */
		test("answers the first page and pages out of range with a 404", async ({ request }) => {
			const responses = await Promise.all(
				["1", "02", "9999"].map((segment) => request.get(`${pathname}/page/${segment}`, { headers: bot })),
			);

			expect(responses.map((response) => response.status())).toStrictEqual([404, 404, 404]);
		});
	});
}
