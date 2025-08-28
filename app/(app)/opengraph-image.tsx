import type { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

import { MetadataImage } from "@/components/metadata-image";

export const runtime = "edge";

// export const alt = ''

export const size = {
	width: 1200,
	height: 630,
};

interface OpenGraphImageProps {}

export default async function OpenGraphImage(
	_props: Readonly<OpenGraphImageProps>,
): Promise<ImageResponse> {
	const meta = await getTranslations("metadata");

	const title = meta("title");

	return MetadataImage({ size, title });
}
