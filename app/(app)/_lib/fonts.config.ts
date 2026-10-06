import { Fira_Code, Roboto } from "next/font/google";
import localFont from "next/font/local";
import type { CSSProperties } from "react";

export const body = Roboto({
	subsets: ["latin"],
	style: ["normal", "italic"],
	variable: "--_font-body",
});

/**
 * `preload` applies to a whole font loader call, not to individual files, so the faces which should be in the initial
 * payload - the weights used by `text-title-1` and `lead-in` - get a call of their own.
 *
 * Both calls declare an explicit `font-family` ("Lato", kept in sync with {@link headingFontFamily} below), so the
 * browser sees a single family with all nine faces. Next's font loader values must be literals - it statically analyzes
 * the call - so that name can't be shared via a variable here.
 *
 * The loader also does _not_ propagate that name to the `variable`/`className` it generates, though (at least under
 * Turbopack) - those still expose an internal placeholder name instead. {@link headingFontFamilyStyle} overrides it
 * with the real name.
 */
export const heading = localFont({
	declarations: [{ prop: "font-family", value: "Lato" }],
	src: [
		{
			path: "../../../assets/fonts/lato/lato-latin-light.woff2",
			weight: "300",
			style: "normal",
		},
		{
			path: "../../../assets/fonts/lato/lato-latin-medium.woff2",
			weight: "500",
			style: "normal",
		},
	],
	variable: "--_font-heading",
});

/**
 * Remaining `Lato` faces. Registered for its `@font-face` side effect only - nothing reads this export, the faces join
 * the family declared by {@link heading}. Removing it drops those faces.
 */
export const headingDeferred = localFont({
	adjustFontFallback: false,
	declarations: [{ prop: "font-family", value: "Lato" }],
	preload: false,
	src: [
		{
			path: "../../../assets/fonts/lato/lato-latin-light-italic.woff2",
			weight: "300",
			style: "italic",
		},
		{
			path: "../../../assets/fonts/lato/lato-latin-regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../../assets/fonts/lato/lato-latin-italic.woff2",
			weight: "400",
			style: "italic",
		},
		{
			path: "../../../assets/fonts/lato/lato-latin-medium-italic.woff2",
			weight: "500",
			style: "italic",
		},
		{
			path: "../../../assets/fonts/lato/lato-latin-bold.woff2",
			weight: "700",
			style: "normal",
		},
		{
			path: "../../../assets/fonts/lato/lato-latin-bold-italic.woff2",
			weight: "700",
			style: "italic",
		},
		{
			path: "../../../assets/fonts/lato/lato-latin-black.woff2",
			weight: "900",
			style: "normal",
		},
	],
});

export const code = Fira_Code({
	preload: false,
	variable: "--_font-code",
});

/** Kept in sync with the `"Lato"` literal in {@link heading} and {@link headingDeferred}'s `declarations`. */
const headingFontFamily = "Lato";

/** Overrides `heading.variable`'s generated value with the real, known-good family name. See {@link heading}. */
export const headingFontFamilyStyle = {
	"--_font-heading": `"${headingFontFamily}"`,
} as CSSProperties;
