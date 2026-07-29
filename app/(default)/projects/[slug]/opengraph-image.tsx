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
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.projects.bySlug({ slug });
	const { image, name } = response.data;

	return MetadataImage({
		image: image ?? undefined,
		imageFit: "contain",
		locale: defaultLocale,
		size,
		title: name,
	});
}
