import type { NextConfig as Config } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { env } from "./config/env.config.ts";

const config: Config = {
	allowedDevOrigins: ["127.0.0.1"],
	/** Compression should be handled by the `nginx` reverse proxy. */
	compress: false,
	eslint: {
		ignoreDuringBuilds: true,
	},
	experimental: {
		browserDebugInfoInTerminal: true,
		cacheComponents: true,
		globalNotFound: true,
		// turbopackPersistentCachingForBuild: true,
		// turbopackPersistentCachingForDev: true,
		// viewTransition: true,
	},
	headers() {
		const headers: Awaited<ReturnType<NonNullable<Config["headers"]>>> = [
			/** @see {@link https://nextjs.org/docs/app/guides/self-hosting#streaming-and-suspense} */
			{ source: "/:path*{/}?", headers: [{ key: "x-accel-buffering", value: "no" }] },
		];

		return headers;
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	output: env.BUILD_MODE,
	redirects() {
		/** @type {Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>} */
		const redirects = [
			{
				source: "/admin",
				destination: "/keystatic",
				permanent: false,
			},
		];

		return Promise.resolve(redirects);
	},
	turbopack: {
		rules: {
			/** @see {@link https://github.com/vercel/next.js/discussions/77721#discussioncomment-14576268} */
			"*": {
				condition: {
					all: [
						"foreign",
						"browser",
						{
							path: /(@react-stately|@react-aria|@react-spectrum|react-aria-components)\/.*\/[a-z]{2}-[A-Z]{2}/,
						},
					],
				},
				loaders: ["null-loader"],
				as: "*.js",
			},
		},
	},
	typedRoutes: true,
	typescript: {
		ignoreBuildErrors: true,
	},
};

const plugins: Array<(config: Config) => Config> = [
	createNextIntlPlugin({
		experimental: {
			/** @see {@link https://next-intl.dev/docs/workflows/typescript#messages-arguments} */
			createMessagesDeclaration: ["./content/en/metadata/index.json", "./messages/en.json"],
		},
		requestConfig: "./lib/i18n/request.ts",
	}),
];

export default plugins.reduce((config, plugin) => {
	return plugin(config);
}, config);
