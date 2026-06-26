import { Fira_Code, Roboto } from "next/font/google";
import localFont from "next/font/local";

export const body = Roboto({
	subsets: ["latin", "latin-ext"],
	style: ["normal", "italic"],
	variable: "--_font-body",
});

export const heading = localFont({
	variable: "--_font-heading",
	src: [
		{ path: "../../public/fonts/lato-latin-light.woff2", weight: "300", style: "normal" },
		{ path: "../../public/fonts/lato-latin-light-italic.woff2", weight: "300", style: "italic" },
		{ path: "../../public/fonts/lato-latin-regular.woff2", weight: "400", style: "normal" },
		{ path: "../../public/fonts/lato-latin-italic.woff2", weight: "400", style: "italic" },
		{ path: "../../public/fonts/lato-latin-bold.woff2", weight: "700", style: "normal" },
		{ path: "../../public/fonts/lato-latin-bold-italic.woff2", weight: "700", style: "italic" },
	],
});

export const code = Fira_Code({
	preload: false,
	variable: "--_font-code",
});
