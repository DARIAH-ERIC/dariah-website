import { Fira_Code, Lato, Roboto } from "next/font/google";

export const body = Roboto({
	subsets: ["latin"],
	variable: "--_font-body",
	weight: ["400"],
});

export const heading = Lato({
	subsets: ["latin"],
	variable: "--_font-heading",
	weight: ["700"],
});

export const code = Fira_Code({
	preload: false,
	variable: "--_font-code",
});
