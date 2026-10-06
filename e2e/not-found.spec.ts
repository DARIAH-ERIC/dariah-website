import { bot } from "#/e2e/lib/bot.ts";
import { expect, test } from "#/e2e/lib/test.ts";

const slug = "e2e-this-slug-does-not-exist";

const detailRoutes = [
	"/about/impact-case-studies",
	"/about/organisation-and-governance",
	"/events",
	"/get-involved/funding-calls",
	"/get-involved/opportunities",
	"/network/members-and-partners",
	"/network/working-groups",
	"/news",
	"/persons",
	"/projects",
	"/spotlight",
];

test.describe("unknown slugs", () => {
	for (const route of detailRoutes) {
		test(`${route}/[slug] answers an unknown slug with a 404`, async ({ page, request }) => {
			const response = await request.get(`${route}/${slug}`, { headers: bot });

			expect(response.status()).toBe(404);

			/** Anyone else gets the route's shell, and the not-found page streams in behind it. */
			await page.goto(`${route}/${slug}`);

			await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
		});
	}
});

test.describe("unknown paths", () => {
	test("answers an unknown path with a 404", async ({ page }) => {
		const response = await page.goto("/e2e/this/path/does/not/exist");

		expect(response?.status()).toBe(404);
		await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
		await expect(page.getByRole("link", { name: "Go to the home page" })).toHaveAttribute("href", "/");
	});
});
