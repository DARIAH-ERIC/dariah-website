import type { IntlLocale } from "#/lib/i18n/locales.ts";
import messages from "#/messages/en.po";

export type IntlMessages = Record<string, unknown>;

// oxlint-disable-next-line typescript/require-await
export async function getIntlMessages(_locale: IntlLocale): Promise<IntlMessages> {
	return messages as IntlMessages;
}
