import type { ImageResponse } from "next/og";

import logo from "#/assets/images/logo-dariah-campus.svg?raw";
import { createSvgOpenGraphImage, openGraphImageSize } from "#/lib/images/open-graph.tsx";

export const size = openGraphImageSize;
export const contentType = "image/png";

/** The logo the page shows beside its title, from the same file - see `PageHeader`. */
export default function Image(): ImageResponse {
	return createSvgOpenGraphImage(logo);
}
