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
 * Turbopack) - those still expose an internal placeholder name instead. {@link fontFamilyStyle} overrides it with the
 * real name.
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

/**
 * The rest of `Lato`: the same faces in full, from the same release (2.015) as the `lato-latin-*` subsets above, which
 * cover Latin only - up to Latin Extended-A. The full files add Greek (polytonic too), Cyrillic, the rest of Latin
 * Extended and IPA, which content on the site does use - ancient Greek quotations, Cyrillic titles.
 *
 * A family of its own, "Lato Extended" (kept in sync with {@link extendedFontFamily} below), whose `unicode-range` is
 * exactly what the full files add, so the browser downloads a face only for a page with text it covers. It follows the
 * primary family in both stacks, see {@link fontFamilyStyle}: in headings for any glyph the subsets lack, and in body
 * text for those Roboto lacks, chiefly polytonic Greek. Registered for its `@font-face` side effect only, like
 * {@link headingDeferred}. The files are the release's own, unmodified: a subset of them would be a modified version,
 * which the font's reserved name would not let us still call Lato.
 */
export const headingExtended = localFont({
	adjustFontFallback: false,
	declarations: [
		{ prop: "font-family", value: "Lato Extended" },
		{
			prop: "unicode-range",
			value:
				"U+180-191, U+193-217, U+21C-236, U+238-2C5, U+2C8, U+2CA-2D7, U+2DE-36F, U+374-375, U+37A-37E, U+384-38A, U+38C, U+38E-393, U+395-3A1, U+3A3-3A8, U+3AA-3BB, U+3BD-3BF, U+3C1-3CE, U+3D0-486, U+488-513, U+E3F, U+1D00-1DCA, U+1DFE-1E7F, U+1E86-1E9B, U+1E9E, U+1EA0-1EF9, U+1F00-1F15, U+1F18-1F1D, U+1F20-1F45, U+1F48-1F4D, U+1F50-1F57, U+1F59, U+1F5B, U+1F5D, U+1F5F-1F7D, U+1F80-1FB4, U+1FB6-1FC4, U+1FC6-1FD3, U+1FD6-1FDB, U+1FDD-1FEF, U+1FF2-1FF4, U+1FF6-1FFE, U+2000-200F, U+2012, U+2015-2017, U+201B, U+201F, U+202F, U+2032-2034, U+203C-203E, U+205E-205F, U+2070-2071, U+2074-2094, U+20A0-20A2, U+20A5-20A6, U+20A8-20AB, U+20AD-20B5, U+20B8-20BA, U+20DD, U+2105, U+2116-2117, U+2120, U+2132, U+214D-214E, U+2153-215F, U+2183-2184, U+2190-2199, U+21A8, U+221F, U+2229, U+2261, U+2302, U+2310, U+2320-2321, U+2460-2473, U+24EA-24F4, U+24FF-2500, U+2502, U+250C, U+2510, U+2514, U+2518, U+25A1, U+25AA-25AB, U+25CB-25CC, U+25CF, U+25E6, U+2600, U+263C, U+2669, U+2776-277F, U+2C60-2C6C, U+2C74-2C77, U+2E17, U+A717-A71A, U+A720-A721, U+FE20-FE23, U+FEFF",
		},
	],
	preload: false,
	src: [
		{
			path: "../../../assets/fonts/lato/lato-light.woff2",
			weight: "300",
			style: "normal",
		},
		{
			path: "../../../assets/fonts/lato/lato-light-italic.woff2",
			weight: "300",
			style: "italic",
		},
		{
			path: "../../../assets/fonts/lato/lato-regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../../assets/fonts/lato/lato-italic.woff2",
			weight: "400",
			style: "italic",
		},
		{
			path: "../../../assets/fonts/lato/lato-medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../../assets/fonts/lato/lato-medium-italic.woff2",
			weight: "500",
			style: "italic",
		},
		{
			path: "../../../assets/fonts/lato/lato-bold.woff2",
			weight: "700",
			style: "normal",
		},
		{
			path: "../../../assets/fonts/lato/lato-bold-italic.woff2",
			weight: "700",
			style: "italic",
		},
		{
			path: "../../../assets/fonts/lato/lato-black.woff2",
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

/** Kept in sync with the `"Lato Extended"` literal in {@link headingExtended}'s `declarations`. */
const extendedFontFamily = "Lato Extended";

/** The families of a font loader's generated stack, as its `style.fontFamily` gives them. */
function families(fontFamily: string): Array<string> {
	return fontFamily.split(",").map((family) => family.trim());
}

const [, ...headingFallbacks] = families(heading.style.fontFamily);
const [bodyFamily, ...bodyFallbacks] = families(body.style.fontFamily);

/**
 * Overrides the stacks the loaders generate. The heading's names the placeholder family rather than "Lato", see
 * {@link heading}. Both get "Lato Extended" right after their first family, ahead of the generated fallbacks: those are
 * the local Arial, adjusted to the web font's metrics, and Arial on Windows and macOS has Greek and Cyrillic of its
 * own, which would otherwise take those glyphs first. The fallbacks are kept, so text shows in the metric-matched Arial
 * while the web font loads. The generic family ending each stack is added by the theme, in `styles/index.css`.
 */
export const fontFamilyStyle = {
	"--_font-heading": [`"${headingFontFamily}"`, `"${extendedFontFamily}"`, ...headingFallbacks].join(", "),
	"--_font-body": [bodyFamily, `"${extendedFontFamily}"`, ...bodyFallbacks].join(", "),
} as CSSProperties;
