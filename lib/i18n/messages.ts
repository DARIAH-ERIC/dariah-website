import type { IntlLocale } from "#/lib/i18n/locales.ts";
import messages from "#/messages/en.po";

export type IntlMessages = Record<string, unknown>;

/**
 * Validation messages: valibot's own are english, so `en-GB` needs no import. Each locale added to
 * `configs/i18n/locales.config.ts` registers its language's here as a side effect, e.g. `import "@valibot/i18n/de";`,
 * and is selected per parse with `lang` - see `getIntlLanguage`.
 */
// oxlint-disable-next-line typescript/require-await
export async function getIntlMessages(_locale: IntlLocale): Promise<IntlMessages> {
	return messages as IntlMessages;
}
