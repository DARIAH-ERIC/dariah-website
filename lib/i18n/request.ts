import { type GetRequestConfigParams, getRequestConfig } from "next-intl/server";

import { formats } from "#/lib/i18n/formats.ts";
import { defaultLocale, timeZone } from "#/lib/i18n/locales.ts";
import { getIntlMessages } from "#/lib/i18n/messages.ts";

// oxlint-disable-next-line typescript/require-await
async function getIntlLocale(params: GetRequestConfigParams) {
	if (params.locale != null) {
		return params.locale;
	}

	return defaultLocale;
}

// oxlint-disable-next-line import/no-default-export
export default getRequestConfig(async (params) => {
	const locale = await getIntlLocale(params);
	const messages = await getIntlMessages(locale);

	return {
		formats,
		locale,
		messages,
		timeZone,
	};
});
