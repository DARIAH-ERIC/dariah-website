import { getRequestConfig } from "next-intl/server";

import { formats } from "@/lib/i18n/formats";
import { defaultLocale as locale, timeZone } from "@/lib/i18n/locales";
import { getIntlMessages } from "@/lib/i18n/messages";

export default getRequestConfig(async () => {
	const messages = await getIntlMessages(locale);

	return {
		formats,
		locale,
		messages,
		timeZone,
	};
});
