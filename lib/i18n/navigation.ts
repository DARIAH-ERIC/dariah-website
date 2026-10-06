import { createNavigation } from "next-intl/navigation";

import { routing } from "#/configs/i18n/routing.config.ts";

const navigation = createNavigation(routing);

export const {
	Link: IntlLink,
	permanentRedirect: intlPermanentRedirect,
	redirect: intlRedirect,
	usePathname: useIntlPathname,
	useRouter: useIntlRouter,
} = navigation;
