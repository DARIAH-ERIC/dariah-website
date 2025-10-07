import type { ImageResponse } from "next/og";
import { getLocale } from "next-intl/server";

import { MetadataImage } from "@/components/metadata-image";
import { getMetadata } from "@/lib/i18n/metadata";

const size = {
	height: 630,
	width: 1200,
};

export default async function openGraphImage(): Promise<ImageResponse> {
	const locale = await getLocale();
	const meta = await getMetadata();

	const title = meta.title;

	return MetadataImage({ locale, size, title });
}
