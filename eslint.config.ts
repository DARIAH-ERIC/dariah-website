import * as path from "node:path";

import baseConfig from "@acdh-oeaw/eslint-config";
import nextConfig from "@acdh-oeaw/eslint-config-next";
import nodeConfig from "@acdh-oeaw/eslint-config-node";
import playwrightConfig from "@acdh-oeaw/eslint-config-playwright";
import reactConfig from "@acdh-oeaw/eslint-config-react";
import tailwindConfig from "@acdh-oeaw/eslint-config-tailwindcss";
import { defineConfig } from "eslint/config";
import gitignore from "eslint-config-flat-gitignore";
import checkFilePlugin from "eslint-plugin-check-file";

const restrictedImports = {
	paths: [
		{
			allowTypeImports: true,
			message: "Please use `@/components/image` instead.",
			name: "next/image",
		},
		{
			allowImportNames: ["useLinkStatus"],
			message: "Please use `@/components/link` instead.",
			name: "next/link",
		},
		{
			message: "Please use `next/navigation` instead.",
			name: "next/router",
		},
	],
};

export default defineConfig(
	gitignore({ strict: false }),
	{ ignores: ["content/**", "public/**"] },
	{
		extends: [baseConfig],
		rules: {
			"@typescript-eslint/explicit-module-boundary-types": "error",
			"@typescript-eslint/no-restricted-imports": ["error", { paths: restrictedImports.paths }],
			"@typescript-eslint/require-array-sort-compare": "error",
			"@typescript-eslint/strict-boolean-expressions": "error",
			"arrow-body-style": ["error", "always"],
			"no-restricted-syntax": [
				"error",
				{
					message: "Please use `@/config/env.config` instead.",
					selector: 'MemberExpression[computed!=true][object.name="process"][property.name="env"]',
				},
			],
			"object-shorthand": ["error", "always", { avoidExplicitReturnArrows: true }],
			"preserve-caught-error": "error",
		},
	},
	{
		extends: [reactConfig],
		rules: {
			"@eslint-react/prefer-read-only-props": "error",
			/** Avoid hardcoded, non-translated strings. */
			"react/jsx-no-literals": [
				"error",
				{
					allowedStrings: [
						"&amp;",
						"&apos;",
						"&bull;",
						"&copy;",
						"&gt;",
						"&lt;",
						"&nbsp;",
						"&quot;",
						"&rarr;",
						"&larr;",
						"&mdash;",
						"&ndash;",
						".",
						"!",
						":",
						";",
						",",
						"-",
						"(",
						")",
						"|",
						"/",
					],
				},
			],
		},
	},
	nextConfig,
	tailwindConfig,
	{
		settings: {
			tailwindcss: {
				config: path.resolve("./styles/index.css"),
			},
		},
	},
	playwrightConfig,
	{
		name: "file-naming-conventions",
		plugins: {
			"check-file": checkFilePlugin,
		},
		rules: {
			"check-file/filename-naming-convention": [
				"error",
				{
					"**/*": "?(_)+([a-z])*([a-z0-9])*(-+([a-z0-9]))",
				},
				{ ignoreMiddleExtensions: true },
			],
			"check-file/folder-naming-convention": [
				"error",
				{
					"**/": "NEXT_JS_APP_ROUTER_CASE",
				},
			],
		},
	},
	{
		extends: [nodeConfig],
		files: ["db/**/*.ts", "lib/server/**/*.ts", "**/_lib/actions/**/*.ts", "scripts/**/*.ts"],
		name: "node-environment",
	},
);
