/**
 * Configuration for the locales supported by this app.
 *
 * This must not import app runtime code, e.g. `next-intl`, whose entry point pulls in react, or anything
 * request-scoped. `next.config.ts` imports it as well, and next loads its config on its own, outside of the bundler and
 * before the app exists. Type-only imports are fine, because they are erased.
 *
 * Prefer importing from `lib/i18n/locales.ts` in app code, which also provides derived types and helpers.
 *
 * For how the message catalogs themselves are stored and extracted, see `configs/i18n/messages.config.ts`.
 */

import type { Timezone } from "next-intl";

export const locales = ["en-GB"] as const;

export const defaultLocale: (typeof locales)[number] = "en-GB";

export const timeZone: Timezone = "UTC";

export type GetIntlLanguage<TIntlLocale extends string> = TIntlLocale extends `${infer TIntlLanguage}-${string}`
	? TIntlLanguage
	: TIntlLocale;

type GetIntlLanguages<TIntlLocales extends ReadonlyArray<string>> = {
	[Index in keyof TIntlLocales]: GetIntlLanguage<TIntlLocales[Index]>;
};

type Unique<T extends ReadonlyArray<unknown>> =
	T extends Readonly<[infer F, ...infer R]> ? (F extends R[number] ? Unique<R> : [F, ...Unique<R>]) : [];

/**
 * The languages of the supported locales, without region - e.g. for React Aria's locale optimization in the next
 * config, which only keeps translations whose region matches a configured one, and ships no `en-GB` strings.
 */
export const languages = Array.from(new Set(locales.map((locale) => new Intl.Locale(locale).language))) as Unique<
	GetIntlLanguages<typeof locales>
>;
