import * as path from "node:path";

import baseConfig from "@acdh-oeaw/eslint-config";
import nextConfig from "@acdh-oeaw/eslint-config-next";
import nodeConfig from "@acdh-oeaw/eslint-config-node";
import playwrightConfig from "@acdh-oeaw/eslint-config-playwright";
import reactConfig from "@acdh-oeaw/eslint-config-react";
import tailwindcssConfig from "@acdh-oeaw/eslint-config-tailwindcss";
import gitignore from "eslint-config-flat-gitignore";
import checkFilePlugin from "eslint-plugin-check-file";
import { defineConfig } from "eslint/config";

const config = defineConfig(
	gitignore({ strict: false }),
	{ ignores: ["content/**", "public/**"] },
	baseConfig,
	reactConfig,
	nextConfig,
	tailwindcssConfig,
	{
		settings: {
			tailwindcss: {
				config: path.resolve("./styles/index.css"),
			},
		},
	},
	playwrightConfig,
	{
		plugins: {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			"check-file": checkFilePlugin,
		},
		rules: {
			"check-file/filename-naming-convention": [
				"error",
				{
					"**/*": "KEBAB_CASE",
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
		rules: {
			"arrow-body-style": ["error", "always"],
			"no-restricted-imports": [
				"error",
				{
					name: "next/image",
					message: "Please use `@/components/image` or `@/components/server-image` instead.",
				},
				{
					name: "next/link",
					message: "Please use `@/components/link` instead.",
				},
				{
					name: "next/navigation",
					importNames: ["redirect", "permanentRedirect", "useRouter", "usePathname"],
					message: "Please use `@/lib/navigation/navigation` instead.",
				},
				{
					name: "next/router",
					message: "Please use `@/lib/navigation/navigation` instead.",
				},
			],
			"no-restricted-syntax": [
				"error",
				{
					selector: 'MemberExpression[computed!=true][object.name="process"][property.name="env"]',
					message: "Please use `@/config/env.config` instead.",
				},
			],
			"@typescript-eslint/require-array-sort-compare": "error",
			"react/jsx-sort-props": ["error", { reservedFirst: true }],
		},
	},
	{
		files: ["db/**/*.ts", "lib/server/**/*.ts", "**/_actions/**/*.ts"],
		extends: [nodeConfig],
	},
);

export default config;
