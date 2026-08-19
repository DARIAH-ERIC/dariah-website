import type { NextConfig as Config } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { env } from "./config/env.config.ts";
import { imageQuality } from "./config/image.config.ts";

const config: Config = {
	allowedDevOrigins: ["127.0.0.1"],
	// cacheComponents: true,
	experimental: {
		globalNotFound: true,
	},
	headers() {
		const headers: Awaited<ReturnType<NonNullable<Config["headers"]>>> = [
			/** @see {@link https://nextjs.org/docs/app/guides/self-hosting#streaming-and-suspense} */
			{ source: "/:path*{/}?", headers: [{ key: "x-accel-buffering", value: "no" }] },
		];

		return headers;
	},
	images: {
		/**
		 * The api's image-variant endpoint accepts only the widths on its allowlist, so the ladder
		 * `next/image` picks `srcset` candidates from is that allowlist rather than the defaults. Both
		 * lists are candidates; what separates them is that the smallest `deviceSizes` entry is also
		 * the floor below which a `sizes`-bearing image is offered nothing. The two rungs narrower
		 * than any viewport therefore belong in `imageSizes`, where a fixed-width thumbnail can still
		 * reach them but a full-bleed slot is not handed a 320px candidate.
		 *
		 * @see {@link file://./config/image.config.ts}
		 */
		deviceSizes: [640, 960, 1280, 1600, 2048, 2560, 3200, 3840],
		imageSizes: [320, 480],
		/**
		 * Every image on the site is now addressed through `lib/images/loader.ts`: api images become
		 * variant-endpoint urls, and everything local is handed back to `/_next/image`. No image url
		 * reaches the optimizer from outside this app any more, which is what `remotePatterns` used to
		 * be here to allow.
		 */
		loaderFile: "./lib/images/loader.ts",
		qualities: [imageQuality],
	},
	logging: {
		browserToTerminal: true,
		fetches: {
			fullUrl: true,
		},
	},
	output: env.BUILD_MODE,
	reactCompiler: true,
	redirects() {
		const redirects: Awaited<ReturnType<NonNullable<Config["redirects"]>>> = [
			{
				source: "/about/dariah-in-nutshell",
				destination: "/about/dariah-in-a-nutshell",
				permanent: true,
			},
			{ source: "/about/documents-list", destination: "/about/documents", permanent: true },
			{
				source: "/about/history-of-dariah",
				destination: "/about/dariah-in-a-nutshell",
				permanent: true,
			},
			{ source: "/about/join-dariah", destination: "/get-involved/join-dariah", permanent: true },
			{
				source: "/about/mission-vision",
				destination: "/about/dariah-in-a-nutshell",
				permanent: true,
			},
			{
				source: "/activities/dariah-theme",
				destination: "/get-involved/funding-calls",
				permanent: true,
			},
			{
				source: "/activities/impact-case-studies/:path*",
				destination: "/about/impact-case-studies/:path*",
				permanent: true,
			},
			{
				source: "/activities/working-groups-list",
				destination: "/network/working-groups",
				permanent: true,
			},
			{
				source: "/activities/working-groups/:path*",
				destination: "/network/working-groups/:path*",
				permanent: true,
			},
			{ source: "/activities/open-science", destination: "/about/strategy", permanent: true },
			{
				source: "/activities/open-science/dariah-open",
				destination: "/about/strategy",
				permanent: true,
			},
			{
				source: "/activities/open-science/data-re-use",
				destination: "/about/strategy",
				permanent: true,
			},
			{
				source: "/activities/open-science/openmethods",
				destination: "/about/strategy",
				permanent: true,
			},
			{
				source: "/activities/open-science/transformations",
				destination: "/resources/transformations",
				permanent: true,
			},
			{ source: "/activities/projects-list", destination: "/projects", permanent: true },
			{
				source: "/activities/projects-and-affiliations/:path*",
				destination: "/projects/:path*",
				permanent: true,
			},
			{
				source: "/activities/spotlight/:path*",
				destination: "/spotlight/:path*",
				permanent: true,
			},
			{
				source: "/activities/training-and-education",
				destination: "/about/strategy",
				permanent: true,
			},
			{ source: "/category/news", destination: "/news", permanent: true },
			{ source: "/event/:path*", destination: "/events/:path*", permanent: true },
			{ source: "/news-events/dariah-newsletters", destination: "/newsletters", permanent: true },
			{
				source: "/tools-services/tools-and-services",
				destination: "/resources/resource-catalogue",
				permanent: true,
			},
			{
				source: String.raw`/:year(\d{4})/:month(\d{2})/:date(\d{2})/:path*`,
				destination: "/news/:path*",
				permanent: true,
			},
			// { source: "/about/glossary", destination: "", permanent: true },
			// { source: "/about/publications", destination: "", permanent: true },
			// { source: "/network/we-are-dariah-team", destination: "", permanent: true },
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
