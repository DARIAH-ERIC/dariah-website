import { getRequestConfig } from "next-intl/server";

import { formats } from "@/lib/i18n/formats";
import { defaultLocale, timeZone } from "@/lib/i18n/locales";
import { getIntlMessages } from "@/lib/i18n/messages";

// eslint-disable-next-line import-x/no-default-export
export default getRequestConfig(async () => {
	const locale = defaultLocale;
	const messages = await getIntlMessages();

	return {
		formats,
		locale,
		messages,
		timeZone,
	};
});
