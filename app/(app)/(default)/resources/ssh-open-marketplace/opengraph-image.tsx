import type { ImageResponse } from "next/og";

import { createAssetOpenGraphImage, openGraphImageSize } from "#/lib/images/open-graph.tsx";

export const size = openGraphImageSize;
export const contentType = "image/png";

/** The logo the page shows beside its title, from the same file - see `PageHeader`. */
export default function Image(): Promise<ImageResponse> {
	return createAssetOpenGraphImage("logo-sshoc.svg");
}
