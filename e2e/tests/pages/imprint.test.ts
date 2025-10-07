import { expect, test } from "@/e2e/lib/test";
import { defaultLocale, locales } from "@/lib/i18n/locales";

test.describe("imprint page", () => {
	test("should have document title", async ({ createImprintPage }) => {
		const { i18n, imprintPage } = await createImprintPage();
		await imprintPage.goto();

		await expect(imprintPage.page).toHaveTitle(
			[i18n.t("ImprintPage.meta.title"), i18n.t("metadata.title")].join(" | "),
		);
	});

	test("should have imprint text", async ({ createImprintPage }) => {
		const imprints = {
			"en-GB": "Legal disclosure",
		};

		const { imprintPage } = await createImprintPage();
		await imprintPage.goto();

		await expect(imprintPage.page.getByRole("main")).toContainText(imprints[defaultLocale]);
	});

	test("should not have any automatically detectable accessibility issues", async ({
		createAccessibilityScanner,
		createImprintPage,
	}) => {
		for (const locale of locales) {
			const { imprintPage } = await createImprintPage(locale);
			await imprintPage.goto();

			const { getViolations } = await createAccessibilityScanner();
			expect(await getViolations()).toEqual([]);
		}
	});

	// eslint-disable-next-line playwright/no-skipped-test
	test.describe.skip("should not have visible changes", () => {
		test.use({ colorScheme: "light" });

		test("in light mode", async ({ createImprintPage }) => {
			const { imprintPage } = await createImprintPage();
			await imprintPage.goto();

			await expect(imprintPage.page).toHaveScreenshot();
		});
	});
});
