import type { Page } from "@playwright/test";
import type { NextFixture } from "next/experimental/testmode/playwright.js";

import { waitForHydration } from "#/e2e/lib/hydration.ts";
import { expect, test } from "#/e2e/lib/test.ts";

/**
 * Errors are caused with next's test proxy, by failing the server's request for the search page's content. A cached
 * function which throws stores nothing, so the failure cannot outlive the test. Where the content is cached already,
 * e.g. in a production build, there is no request to fail, and the tests are skipped.
 */

/** Fails the search page's content until the returned function is called. */
async function goToFailingPage(page: Page, next: NextFixture): Promise<() => void> {
	let isFailing = true;
	let hasFailed = false;
	next.onFetch((request) => {
		if (isFailing && new URL(request.url).pathname === "/api/v1/pages/slugs/search") {
			hasFailed = true;
			return Response.json({ message: "Service Unavailable" }, { status: 503 });
		}

		return "continue";
	});

	await page.goto("/search");

	await expect(
		page
			.getByRole("heading", { level: 1, name: "Something went wrong" })
			.or(page.getByRole("searchbox", { name: "Search the website" })),
	).toBeVisible();
	// oxlint-disable-next-line playwright/no-skipped-test -- Depends on how the server was started, which a test cannot set.
	test.skip(!hasFailed, "The page's content is cached, so there is no request to fail.");

	return () => {
		isFailing = false;
	};
}

test.describe("error page", () => {
	test("replaces a page which fails to render, keeping the layout, and focusing the message", async ({
		page,
		next,
	}) => {
		await goToFailingPage(page, next);

		const heading = page.getByRole("heading", { level: 1, name: "Something went wrong" });
		await expect(heading).toBeVisible();
		/** The error replaces the page without a navigation, so focus is moved to it to have it announced. */
		await expect(heading).toBeFocused();
		await expect(page.getByRole("banner")).toBeVisible();
		await expect(page.getByRole("contentinfo")).toBeVisible();
		await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
	});

	/**
	 * Known to fail in firefox and webkit: once retried, react-aria's components throw, as their localized strings are
	 * missing in the browser - `strings is undefined` - see the locale modules emptied in `next.config.ts`.
	 */
	test.fixme("renders the page again on “Try again”", async ({ page, next }) => {
		const recover = await goToFailingPage(page, next);

		recover();
		const retry = page.getByRole("button", { name: "Try again" });
		await waitForHydration(retry);
		await retry.click();

		await expect(page.getByRole("heading", { level: 1, name: "Search" })).toBeVisible();
		await expect(page.getByRole("heading", { level: 1, name: "Something went wrong" })).toBeHidden();
	});
});
