import { expect, test } from "@/e2e/lib/test";

test.describe("index page", () => {
	test("should have document title", async ({ createIndexPage }) => {
		const { i18n, indexPage } = await createIndexPage();
		await indexPage.goto();
		await expect(indexPage.page).toHaveTitle(i18n.t("metadata.title"));
	});

	test("should not have any automatically detectable accessibility issues", async ({
		createAccessibilityScanner,
		createIndexPage,
	}) => {
		const { indexPage } = await createIndexPage();
		await indexPage.goto();

		const { getViolations } = await createAccessibilityScanner();
		expect(await getViolations()).toEqual([]);
	});

	// eslint-disable-next-line playwright/no-skipped-test
	test.describe.skip("should not have visible changes", () => {
		test.use({ colorScheme: "light" });

		test("in light mode", async ({ createIndexPage }) => {
			const { indexPage } = await createIndexPage();
			await indexPage.goto();

			await expect(indexPage.page).toHaveScreenshot();
		});
	});
});
