import type { IntlLocale } from "#/lib/i18n/locales.ts";
import { intlPermanentRedirect, intlRedirect } from "#/lib/i18n/navigation.ts";
import { type Href, serializeHref } from "#/lib/navigation/href.ts";

interface RedirectOptions {
	forcePrefix?: boolean;
	href: Href;
	locale: IntlLocale;
}

type RedirectType = Parameters<typeof intlRedirect>[1];

export function redirect(options: RedirectOptions, type?: RedirectType): never {
	return intlRedirect({ ...options, href: serializeHref(options.href) }, type);
}

export function permanentRedirect(options: RedirectOptions, type?: RedirectType): never {
	return intlPermanentRedirect({ ...options, href: serializeHref(options.href) }, type);
}
