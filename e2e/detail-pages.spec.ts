import { instant } from "@next/playwright";
import type { Locator, Page, Response } from "@playwright/test";

import { waitForHydration } from "#/e2e/lib/hydration.ts";
import { expect, test } from "#/e2e/lib/test.ts";

/**
 * A detail page depends on its slug, so a link to it prefetches only the route's app shell: the breadcrumbs' trail and
 * a skeleton. Following one commits that shell at once, and the page streams in behind it.
 *
 * Links to detail pages set `prefetch="intent"` (see `Link`): once one is hovered, focused, or touched, it prefetches
 * the page itself - from static output, since detail pages set `ensureStatic = "prefetch"` - and following it then
 * commits the page at once, without the skeleton.
 */
const lists = [
	{ list: "/news", detail: /\/news\/[^/?]+$/, label: "Loading article…" },
	{ list: "/spotlight", detail: /\/spotlight\/[^/?]+$/, label: "Loading article…" },
	{ list: "/about/impact-case-studies", detail: /\/about\/impact-case-studies\/[^/?]+$/, label: "Loading article…" },
	{ list: "/events", detail: /\/events\/[^/?]+$/, label: "Loading event…" },
	{ list: "/projects", detail: /\/projects\/[^/?]+$/, label: "Loading page…" },
	{ list: "/network/working-groups", detail: /\/network\/working-groups\/[^/?]+$/, label: "Loading page…" },
	{ list: "/get-involved/funding-calls", detail: /\/get-involved\/funding-calls\/[^/?]+$/, label: "Loading page…" },
	{ list: "/get-involved/opportunities", detail: /\/get-involved\/opportunities\/[^/?]+$/, label: "Loading page…" },
];

/**
 * A card's link on a list page, the first by default, once react has hydrated it. The list streams in, so its links are
 * visible before the client bundle has run, and a click until then can be lost: webkit, under load, then never commits
 * the navigation.
 */
async function getCardLink(page: Page, index = 0): Promise<Locator> {
	const link = page.getByRole("main").getByRole("article").nth(index).getByRole("link").first();
	/** Outside the instant lock, so a longer wait costs the test nothing. */
	await waitForHydration(link);

	return link;
}

/** Whether a response is the per-link prefetch of a page: its `__PAGE__` segment, for the link's own url. */
function isPagePrefetch(pathname: string): (response: Response) => boolean {
	return (response) => {
		const segment: string | undefined = response.request().headers()["next-router-segment-prefetch"];

		return new URL(response.url()).pathname === pathname && segment?.endsWith("/__PAGE__") === true;
	};
}

for (const { list, detail, label } of lists) {
	test.describe(`${list}/[slug]`, () => {
		test("commits the skeleton instantly on a client-side navigation from the list, streaming the page behind it", async ({
			page,
		}) => {
			await page.goto(list);
			const link = await getCardLink(page);

			await instant(page, async () => {
				/** Dispatched rather than clicked: a click moves the pointer over the link first, which prefetches the page. */
				await link.dispatchEvent("click");

				await expect(page).toHaveURL(detail);
				await expect(page.getByRole("navigation", { name: "Breadcrumbs" })).toBeVisible();
				await expect(page.getByText(label)).toBeVisible();
				await expect(page.getByRole("heading", { level: 1 })).toBeHidden();
			});

			await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
			await expect(page.getByText(label)).toBeHidden();
		});

		/**
		 * The second card: the route's app shell is prefetched from the first link to it, the first card's, whose page that
		 * already includes - hovering it fetches nothing more.
		 */
		test("commits the page instantly once its link has been hovered", async ({ page }) => {
			await page.goto(list);
			const link = await getCardLink(page, 1);
			const pathname = (await link.getAttribute("href")) ?? "";

			/** Outside the instant lock, which holds back only what is requested after it is taken. */
			await Promise.all([page.waitForResponse(isPagePrefetch(pathname)), link.hover()]);

			await instant(page, async () => {
				await link.click();

				await expect(page).toHaveURL(detail);
				await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
				await expect(page.getByText(label)).toBeHidden();
			});
		});
	});
}
