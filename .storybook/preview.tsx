import "#/styles/index.css";

import type { Preview } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";

import { ClientProviders } from "#/app/(app)/_components/client-providers.tsx";
import * as fonts from "#/app/(app)/_lib/fonts.config.ts";
import { defaultLocale, timeZone } from "#/lib/i18n/locales.ts";

/**
 * The fonts go on the root element, as `HtmlDocument` puts them: the theme reads their variables on `:root`, so on any
 * element below it they would not take effect.
 */
document.documentElement.classList.add(fonts.body.variable, fonts.heading.variable, fonts.code.variable);
for (const [property, value] of Object.entries(fonts.fontFamilyStyle)) {
	document.documentElement.style.setProperty(property, String(value));
}
document.documentElement.lang = defaultLocale;

/**
 * The providers the root layout sets up - see `Providers` - around every story.
 *
 * No messages: `useExtracted` falls back to the message in the source when it has not been compiled, which only the
 * next-intl plugin does, and the source is the catalog's own english. Server components which read translations or
 * data, with `getExtracted` or from `#/lib/data`, do not render here.
 */
const preview: Preview = {
	decorators(Story) {
		return (
			<NextIntlClientProvider locale={defaultLocale} messages={{}} timeZone={timeZone}>
				<ClientProviders locale={defaultLocale}>
					<Story />
				</ClientProviders>
			</NextIntlClientProvider>
		);
	},
	parameters: {
		layout: "padded",
	},
};

export default preview;
