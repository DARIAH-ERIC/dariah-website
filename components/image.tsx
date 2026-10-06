import NextImage, { type ImageProps as NextImageProps } from "next/image";
import type { ReactNode } from "react";

export interface ImageProps extends Omit<NextImageProps, "loader" | "unoptimized"> {}

/**
 * Locally served images: static imports and files under `/public`, through the built-in optimizer. Images from the api
 * are `ApiImage`, in `./api-image.tsx`.
 */
export function Image(props: Readonly<ImageProps>): ReactNode {
	const { alt, ...rest } = props;

	return <NextImage {...rest} alt={alt} />;
}
