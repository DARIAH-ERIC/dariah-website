import type { MetadataRoute } from "next";

import { getSiteMetadata } from "#/lib/data/site-metadata.ts";
import { defaultLocale } from "#/lib/i18n/locales.ts";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
	const siteMetadata = await getSiteMetadata();

	return {
		name: siteMetadata.title,
		short_name: siteMetadata.title,
		description: siteMetadata.description,
		lang: defaultLocale,
		start_url: "/",
		display: "standalone",
		background_color: "#fff",
		theme_color: "#fff",
		icons: [
			{
				src: "/icon.svg",
				sizes: "any",
				type: "image/svg+xml",
			},
			{
				src: "/icon-maskable.svg",
				sizes: "any",
				type: "image/svg+xml",
				purpose: "maskable",
			},
			{
				src: "/android-chrome-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/android-chrome-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
