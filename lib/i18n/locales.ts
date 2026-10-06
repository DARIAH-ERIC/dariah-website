import { hasLocale } from "next-intl";

import { type GetIntlLanguage, defaultLocale, languages, locales, timeZone } from "#/configs/i18n/locales.config.ts";

export { defaultLocale, languages, locales, timeZone };

export type IntlLocale = (typeof locales)[number];

export function isValidLocale(value: unknown): value is IntlLocale {
	return hasLocale(locales, value);
}

export function createIntlLocale(locale: IntlLocale): Intl.Locale {
	return new Intl.Locale(locale);
}

export type IntlLanguage = IntlLocale extends `${infer Language}-${string}` ? Language : IntlLocale;

export function getIntlLanguage<TIntlLocale extends IntlLocale>(locale: TIntlLocale): GetIntlLanguage<TIntlLocale> {
	return createIntlLocale(locale).language as GetIntlLanguage<TIntlLocale>;
}
