import { Fira_Code, Lato, Roboto } from "next/font/google";

export const body = Roboto({
	subsets: ["latin", "latin-ext"],
	variable: "--_font-body",
});

export const heading = Lato({
	subsets: ["latin", "latin-ext"],
	variable: "--_font-heading",
	weight: ["300", "400", "700"],
});

export const code = Fira_Code({
	preload: false,
	variable: "--_font-code",
});
