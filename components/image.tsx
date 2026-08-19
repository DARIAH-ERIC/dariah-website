/* eslint-disable @typescript-eslint/no-restricted-imports */

import NextImage, { type ImageProps as NextImageProps } from "next/image";
import type { ReactNode } from "react";

import { sourceWidthParam } from "@/config/image.config";
import { appendSearchParams, type ImageAsset } from "@/lib/images/variants";

interface ImageProps extends Omit<NextImageProps, "loader" | "unoptimized"> {}

/**
 * Locally served images: static imports and files under `/public`.
 *
 * Vectors are served as-is. `next/image` normally arranges that itself, but only while the default
 * loader is in play — registering `images.loaderFile` turns the check off (`isDefaultLoader` in
 * next's `get-img-props`), and the optimizer refuses svg without `dangerouslyAllowSVG`. So the
 * exemption has to be made here instead, or every local logo 400s.
 */
export function Image(props: Readonly<ImageProps>): ReactNode {
	const { alt, ...rest } = props;

	return <NextImage {...rest} alt={alt} unoptimized={isVectorSrc(rest.src)} />;
}

function isVectorSrc(src: NextImageProps["src"]): boolean {
	const path =
		typeof src === "string"
			? src
			: "default" in src
				? src.default.src
				: (src as { src: string }).src;

	return path.split("?", 1)[0]?.endsWith(".svg") === true;
}

interface ApiImageProps extends Omit<ImageProps, "alt" | "src"> {
	/** Overrides the alt text the api records for the asset; pass `""` to mark it decorative. */
	alt?: string;
	image: ImageAsset;
}

/**
 * An image served by the api's variant endpoint.
 *
 * The endpoint takes a width, so this renders a real `srcset`, unlike the fixed single rendition
 * the api used to hand out. What each slot still owes it is a `sizes` describing the width the
 * image is laid out at — without one `next/image` can only offer the declared width at 1x and 2x,
 * and a phone downloads the desktop rung.
 */
export function ApiImage(props: Readonly<ApiImageProps>): ReactNode {
	const { alt, image, ...rest } = props;

	/**
	 * Source dimensions stand in for a slot that declares none, which is how a logo or a content
	 * image gets its aspect ratio without every call site repeating it. Skipped under `fill`, where
	 * `next/image` rejects a width and height outright.
	 */
	const intrinsic =
		rest.fill === true
			? {}
			: { height: image.height ?? undefined, width: image.width ?? undefined };

	/**
	 * A vector has no resolution to ladder against, and imgproxy runs with svg processing disabled,
	 * so it hands the source back untouched. Naming a width would only mint a second cache entry for
	 * the same bytes, so the base url is requested as it stands — one url, no `srcset`, which is
	 * what `unoptimized` asks `next/image` for.
	 */
	if (image.width == null) {
		const layoutWidth = toLayoutWidth(rest.width);
		const src = image.srcUrl;

		/**
		 * With neither a source resolution nor a declared box there is nothing left for `next/image`
		 * to contribute — it has no candidates to choose between and no dimensions to reserve space
		 * with, and would refuse to render for want of the latter. A plain element says the same thing
		 * without the ceremony; the loading attributes are the ones `next/image` would have set.
		 */
		if (layoutWidth == null && rest.fill !== true) {
			return (
				// eslint-disable-next-line @next/next/no-img-element
				<img
					alt={alt ?? image.alt ?? ""}
					className={rest.className}
					decoding="async"
					loading="lazy"
					src={src}
				/>
			);
		}

		return (
			<NextImage
				{...intrinsic}
				{...rest}
				alt={alt ?? image.alt ?? ""}
				src={src}
				unoptimized={true}
			/>
		);
	}

	const src = appendSearchParams(image.srcUrl, { [sourceWidthParam]: String(image.width) });

	return <NextImage {...intrinsic} {...rest} alt={alt ?? image.alt ?? ""} src={src} />;
}

function toLayoutWidth(width: NextImageProps["width"]): number | undefined {
	if (typeof width === "number") {
		return width;
	}

	if (typeof width === "string") {
		const parsed = Number.parseInt(width, 10);

		return Number.isNaN(parsed) ? undefined : parsed;
	}

	return undefined;
}
