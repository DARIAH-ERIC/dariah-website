import type { ImageResponse } from "next/og";

import { MetadataImage } from "@/components/metadata-image";
import { defaultLocale } from "@/lib/i18n/locales";
import { getMetadata } from "@/lib/i18n/metadata";

const size = {
	height: 630,
	width: 1200,
};

export default async function openGraphImage(): Promise<ImageResponse> {
	const locale = defaultLocale;
	const { title } = await getMetadata();

	return MetadataImage({ locale, size, title });
}
