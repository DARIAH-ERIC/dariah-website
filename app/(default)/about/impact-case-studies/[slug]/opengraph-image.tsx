import type { ImageResponse } from "next/og";

import { MetadataImage } from "@/components/metadata-image";
import { client } from "@/lib/data/api-client";
import { defaultLocale } from "@/lib/i18n/locales";

export const size = {
	height: 630,
	width: 1200,
};

export const contentType = "image/png";

interface OpenGraphImageProps {
	params: Promise<{ slug: string }>;
}

export default async function openGraphImage(
	props: Readonly<OpenGraphImageProps>,
): Promise<ImageResponse> {
	const { slug: _slug } = await props.params;
	const slug = decodeURIComponent(_slug);

	const response = await client.impactCaseStudies.bySlug({ slug });
	const { image, title } = response.data;

	return MetadataImage({
		image,
		locale: defaultLocale,
		size,
		title,
	});
}
