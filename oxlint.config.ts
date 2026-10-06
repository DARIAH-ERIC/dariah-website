import * as path from "node:path";

import { defineConfig } from "oxlint";

import base from "#/configs/oxlint/base.ts";
import nextjs, { restrictedImports as nextjsRestrictedImports } from "#/configs/oxlint/nextjs.ts";
import playwright from "#/configs/oxlint/playwright.ts";
import react, { settings as reactSettings } from "#/configs/oxlint/react.ts";
import regexp from "#/configs/oxlint/regexp.ts";
import storybook from "#/configs/oxlint/storybook.ts";
import tailwindcss, { settings as betterTailwindcssSettings } from "#/configs/oxlint/tailwindcss.ts";
import vitest from "#/configs/oxlint/vitest.ts";

/**
 * Rule options are _not_ inherited through `extends` - the entry config's value for a rule replaces any inherited one -
 * so the shared configs export their restrictions instead of declaring them, and they are composed here.
 */
const restrictedImports = {
	paths: [...nextjsRestrictedImports.paths],
	patterns: [...nextjsRestrictedImports.patterns, { group: ["./**", "../**"] }],
};

/** Applies everywhere, except in the files which are what these restrict in favour of - see `overrides` below. */
const appRestrictedImports = {
	...restrictedImports,
	paths: [
		{
			message: "Please use `#/lib/i18n/locales.ts` instead, which also provides derived types and helpers.",
			name: "#/configs/i18n/locales.config.ts",
		},
		/** Messages are extracted from source, so only the extraction-aware hooks may be used. */
		{
			importNames: ["useTranslations"],
			message: "Please use `useExtracted` instead, which is what messages are extracted from.",
			name: "next-intl",
		},
		{
			importNames: ["getTranslations"],
			message: "Please use `getExtracted` instead, which is what messages are extracted from.",
			name: "next-intl/server",
		},
		{
			message:
				"Please use `#/components/image.tsx`, or `#/components/api-image.tsx` for api images, which handle the custom image loader's cases.",
			name: "next/image",
		},
		...restrictedImports.paths,
	],
};

/**
 * Scripts and tests run outside of the app, e.g. on a fresh clone before a local `.env.local` exists, and must not be
 * coupled to the app's full environment - they validate the subset they need from `#/configs/env.schema.ts` instead.
 */
const outsideAppRestrictedImports = {
	...appRestrictedImports,
	paths: [
		{
			message:
				"Please validate only the values needed from `#/configs/env.schema.ts` instead, which does not require the app's full environment.",
			name: "#/configs/env.config.ts",
		},
		...appRestrictedImports.paths,
	],
};

/** Tests use the fixture-extended `test`, which is what hides `inert` elements from role queries. */
const e2eRestrictedImports = {
	...outsideAppRestrictedImports,
	paths: [
		{
			importNames: ["expect", "test"],
			message: "Please use `#/e2e/lib/test.ts` instead, which hides `inert` elements from role queries.",
			name: "@playwright/test",
		},
		...outsideAppRestrictedImports.paths,
	],
};

const config = defineConfig({
	/**
	 * Every rule is configured explicitly, so no rule may be enabled by the category it happens to belong to. Categories
	 * are not inherited through `extends` either - the entry config's value is used verbatim - so turning them off here
	 * also turns off the ones the shared configs declare.
	 */
	categories: {
		correctness: "off",
		nursery: "off",
		pedantic: "off",
		perf: "off",
		restriction: "off",
		style: "off",
		suspicious: "off",
	},
	extends: [base, nextjs, playwright, react, regexp, storybook, tailwindcss, vitest],
	/** `env` is not inherited through `extends`, so it has to be declared here to have any effect. */
	env: {
		builtin: true,
		browser: true,
	},
	/** @see {@link https://github.com/ota-meshi/eslint-plugin-regexp/issues/1033} */
	ignorePatterns: ["**/*.d.ts"],
	options: {
		reportUnusedDisableDirectives: "error",
		typeAware: true,
		typeCheck: true,
	},
	rules: {
		"no-restricted-imports": ["error", appRestrictedImports],
	},
	/**
	 * `settings` is not inherited through `extends` - the entry config's value is used verbatim - so the shared configs
	 * export their settings instead of declaring them, and they are composed here.
	 *
	 * Anything resolved against the repository root is also computed here, and deliberately not in the shared config it
	 * belongs to: only this file's location is pinned by oxlint, so it is the one place where `import.meta.dirname`
	 * cannot be invalidated by moving a file around.
	 */
	settings: {
		"better-tailwindcss": {
			...betterTailwindcssSettings,
			cwd: import.meta.dirname,
			entryPoint: path.join(import.meta.dirname, "./styles/index.css"),
		},
		react: reactSettings,
	},
	overrides: [
		{
			files: ["configs/**/*.ts"],
			rules: {
				"import/no-default-export": "off",
			},
		},
		/** The image wrappers and the loader are what `next/image` is restricted in favour of, so they may reach for it. */
		{
			files: ["components/api-image.tsx", "components/image.tsx", "lib/images/loader.ts"],
			rules: {
				"no-restricted-imports": ["error", restrictedImports],
			},
		},
		{
			files: ["scripts/**/*.ts"],
			rules: {
				"no-restricted-imports": ["error", outsideAppRestrictedImports],
			},
		},
		{
			files: ["e2e/**/*.ts"],
			rules: {
				"no-restricted-imports": ["error", e2eRestrictedImports],
			},
		},
		/** The fixture-extended `test` is what `@playwright/test`'s is restricted in favour of, so it may reach for it. */
		{
			files: ["e2e/lib/test.ts"],
			rules: {
				"no-restricted-imports": ["error", outsideAppRestrictedImports],
			},
		},
		/**
		 * The only files allowed to import `#/configs/i18n/locales.config.ts` - the one which re-exports it, and the next
		 * config, which is build configuration like the other `#/configs/*` modules it imports, not app code.
		 */
		{
			files: ["lib/i18n/locales.ts", "next.config.ts"],
			rules: {
				"no-restricted-imports": ["error", restrictedImports],
			},
		},
	],
});

export default config;
