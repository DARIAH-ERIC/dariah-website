import type { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { getMetadata } from "@/lib/i18n/metadata";

interface CreateOpenGraphMetadataParams {
	description?: string;
	title: string;
	/** Note that open graph has no type for events, so those stay `"website"`. */
	type?: "article" | "profile" | "website";
}

/**
 * Note that `openGraph` metadata is not merged with the `openGraph` metadata of parent segments,
 * but replaces it, so all fields set in the root layout need to be re-declared here.
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-metadata#ordering}
 */
export async function createOpenGraphMetadata(
	params: Readonly<CreateOpenGraphMetadataParams>,
): Promise<Metadata["openGraph"]> {
	const { description, title, type = "website" } = params;

	const locale = await getLocale();
	const meta = await getMetadata();

	return {
		title,
		description: description ?? meta.description,
		url: "./",
		siteName: meta.title,
		locale,
		type,
	};
}
