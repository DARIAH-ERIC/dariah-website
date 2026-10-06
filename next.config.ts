import optimizeLocales from "@react-aria/optimize-locales-plugin";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { env } from "#/configs/env.config.ts";
import { languages } from "#/configs/i18n/locales.config.ts";
import { messages, srcPath } from "#/configs/i18n/messages.config.ts";
import { imageQuality, imageVariantWidths } from "#/configs/image.config.ts";
import { redirects } from "#/configs/redirects.config.ts";

const localeOptimization = optimizeLocales.turbopack([
	{ condition: { not: "browser" }, locales: languages },
	{ condition: "browser", locales: [] },
]);

const config: NextConfig = {
	cacheComponents: true,
	/**
	 * Api data is invalidated on demand by the revalidation webhook, so entries are long-lived. The daily background
	 * refresh is only a safety net for a lost webhook, and `stale` stays at the 5 minutes an entry needs to be part of
	 * the app shell.
	 */
	cacheLife: {
		content: {
			stale: 300,
			revalidate: 86_400,
			expire: 31_536_000,
		},
	},
	experimental: {
		agentFeedback: true,
		agentUpgrade: "latest",
		cachedNavigations: true,
		/**
		 * Enables `instant()` e2e assertions against a local production build; never true in a real deploy. See
		 * `instant-nav.rig.md`.
		 */
		// oxlint-disable-next-line node/no-process-env
		exposeTestingApiInProductionBuild: process.env.EXPOSE_TESTING_API === "1",
		globalNotFound: true,
		strictRouteTypes: true,
		/**
		 * Lets e2e tests answer the server's own fetches, e.g. the newsletter subscription the server action sends to the
		 * api. Any request can redirect them to a port of its choosing, so never true in a real deploy.
		 *
		 * Not tied to `EXPOSE_TESTING_API`: the proxy turns off the incremental cache in `next start`, so no prerendered
		 * page is served from the build - a dynamic route's page is the route's generic shell, resumed per request - and
		 * `instant()` tests fail against such a server. See `tasks/05-e2e-known-issues.md`.
		 */
		// oxlint-disable-next-line node/no-process-env
		testProxy: process.env.E2E_TEST_PROXY === "1",
		turbopackRustReactCompiler: true,
	},
	/**
	 * Images from the knowledge base are rendered by the api's own variant endpoint, which signs an imgproxy rendition
	 * and redirects to it - so they never pass through `/_next/image`, and no asset host has to be allow-listed.
	 * `ApiImage` passes the loader for those urls per instance; a site-wide `loader: "custom"` would make next `404`
	 * every `/_next/image` request, taking the optimizer away from locally served images as well.
	 *
	 * `deviceSizes`/`imageSizes` are the endpoint's own ladder, split at the 640 rung the way next expects: the widths in
	 * the two lists are the candidates it puts in a `srcset`, and the endpoint answers any width not on the ladder with a
	 * `400`.
	 */
	images: {
		deviceSizes: imageVariantWidths.filter((width) => width >= 640),
		imageSizes: imageVariantWidths.filter((width) => width < 640),
		qualities: [imageQuality],
	},
	logging: {
		browserToTerminal: true,
		fetches: {
			hmrRefreshes: true,
			fullUrl: true,
		},
	},
	output: env.BUILD_MODE,
	outputFileTracingIncludes: {
		"**/*": ["./assets/fonts/**/*.ttf"],
	},
	partialPrefetching: true,
	reactCompiler: true,
	redirects() {
		return Promise.resolve(redirects);
	},
	turbopack: {
		rules: {
			...localeOptimization.rules,
			"*.css": {
				loaders: ["@tailwindcss/turbopack"],
				as: "*.css",
			},
		},
	},
	typedRoutes: false,
	typescript: {
		ignoreBuildErrors: true,
	},
};

const plugins: Array<(config: NextConfig) => NextConfig> = [
	createNextIntlPlugin({
		experimental: {
			extract: true,
			messages: { ...messages, precompile: true },
			srcPath,
		},
		requestConfig: "./lib/i18n/request.ts",
	}),
];

export default plugins.reduce((config, plugin) => plugin(config), config);
