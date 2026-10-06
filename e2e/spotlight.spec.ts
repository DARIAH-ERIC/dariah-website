import { instant } from "@next/playwright";

import { expect, test } from "#/e2e/lib/test.ts";

test.describe("/spotlight", () => {
	test("commits the whole page instantly: nothing on this route depends on per-request data", async ({
		page,
		baseURL,
	}) => {
		await instant(
			page,
			async () => {
				await page.goto("/spotlight");

				await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
				await expect(page.getByRole("list").first()).toBeVisible();
			},
			{ baseURL },
		);
	});
});
