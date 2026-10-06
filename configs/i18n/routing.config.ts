import { defineRouting } from "next-intl/routing";

import { defaultLocale, locales } from "#/lib/i18n/locales.ts";

export const routing = defineRouting({
	defaultLocale,
	localePrefix: "never",
	locales,
});
