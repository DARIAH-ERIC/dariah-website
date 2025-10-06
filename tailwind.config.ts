import typographyPlugin from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import reactAriaComponentsPlugin from "tailwindcss-react-aria-components";

const config = {
	content: ["./@(app|components|config|lib|styles)/**/*.@(css|js|ts|tsx)"],
	corePlugins: {
		container: false,
	},
	plugins: [animatePlugin, reactAriaComponentsPlugin, typographyPlugin],
	theme: {
		extend: {
			boxShadow: {
				"light-button": "0px 2px 4px 0px rgba(var(--color-base-black), 0.08)",
				"medium-button": "2px 2px 4px 0px rgba(var(--color-base-black), 0.25)",
				"large-button": "0px 4px 4px 0px rgba(var(--color-base-black), 0.25)",
			},
			colors: {
				"primary-100": "var(--color-primary-100)",
				"primary-200": "var(--color-primary-200)",
				"primary-300": "var(--color-primary-300)",
				"primary-400": "var(--color-primary-400)",
				"primary-500": "var(--color-primary-500)",
				"primary-600": "var(--color-primary-600)",
				"primary-700": "var(--color-primary-700)",
				"primary-800": "var(--color-primary-800)",
				"primary-900": "var(--color-primary-900)",

				"accent-100": "var(--color-accent-100)",
				"accent-200": "var(--color-accent-200)",
				"accent-300": "var(--color-accent-300)",
				"accent-400": "var(--color-accent-400)",
				"accent-500": "var(--color-accent-500)",
				"accent-600": "var(--color-accent-600)",
				"accent-700": "var(--color-accent-700)",
				"accent-800": "var(--color-accent-800)",
				"accent-900": "var(--color-accent-900)",

				"gray-100": "var(--color-gray-100)",
				"gray-200": "var(--color-gray-200)",
				"gray-300": "var(--color-gray-300)",
				"gray-400": "var(--color-gray-400)",
				"gray-500": "var(--color-gray-500)",
				"gray-600": "var(--color-gray-600)",
				"gray-700": "var(--color-gray-700)",
				"gray-800": "var(--color-gray-800)",
				"gray-900": "var(--color-gray-900)",

				black: "var(--color-black)",
				white: "var(--color-white)",
			},
			fontFamily: {
				body: "var(--font-family-body)",
				heading: "var(--font-family-heading)",
				mono: "var(--font-family-mono)",
			},
			fontSize: {
				h1: [
					"var(--font-size-heading-h1)",
					{
						lineHeight: "var(--line-height-small)",
						fontWeight: "var(--font-weight-bold)",
						letterSpacing: "var(--letter-spacing-small)",
					},
				],
				h2: [
					"var(--font-size-heading-h2)",
					{
						lineHeight: "var(--line-height-small)",
						fontWeight: "var(--font-weight-bold)",
						letterSpacing: "var(--letter-spacing-medium)",
					},
				],
				h3: [
					"var(--font-size-heading-h3)",
					{
						lineHeight: "var(--line-height-small)",
						fontWeight: "var(--font-weight-bold)",
						letterSpacing: "var(--letter-spacing-medium)",
					},
				],
				h4: [
					"var(--font-size-heading-h4)",
					{
						lineHeight: "var(--line-height-small)",
						fontWeight: "var(--font-weight-bold)",
						letterSpacing: "var(--letter-spacing-medium)",
					},
				],
				h5: [
					"var(--font-size-heading-h5)",
					{
						lineHeight: "var(--line-height-small)",
						fontWeight: "var(--font-weight-bold)",
						letterSpacing: "var(--letter-spacing-medium)",
					},
				],
				h6: [
					"var(--font-size-heading-h6)",
					{
						lineHeight: "var(--line-height-small)",
						fontWeight: "var(--font-weight-bold)",
						letterSpacing: "var(--letter-spacing-medium)",
					},
				],
				medium: [
					"var(--font-size-medium)",
					{
						lineHeight: "var(--line-height-small)",
						fontWeight: "var(--font-weight-medium)",
						letterSpacing: "var(--letter-spacing-none)",
					},
				],
				regular: [
					"var(--font-size-regular)",
					{
						lineHeight: "var(--line-height-large)",
						fontWeight: "var(--font-weight-regular)",
						letterSpacing: "var(--letter-spacing-none)",
					},
				],
				small: [
					"var(--font-size-small)",
					{
						lineHeight: "var(--line-height-large)",
						fontWeight: "var(--font-weight-regular)",
						letterSpacing: "var(--letter-spacing-none)",
					},
				],
				caption: [
					"var(--font-size-caption)",
					{
						lineHeight: "var(--line-height-large)",
						fontWeight: "var(--font-weight-regular)",
						letterSpacing: "var(--letter-spacing-none)",
					},
				],
			},
			fontWeight: {
				bold: "var(--font-weight-bold)",
				medium: "var(--font-weight-medium)",
				regular: "var(--font-weight-regular)",
			},
			screens: {
				xs: "30rem",
				sm: "40rem",
				md: "48rem",
				lg: "64rem",
				xl: "80rem",
				"2xl": "96rem",
				"3xl": "120rem",
			},
		},
	},
} satisfies Config;

export default config;
