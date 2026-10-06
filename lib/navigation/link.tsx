import type { ComponentProps, ReactNode } from "react";

import { IntlLink } from "#/lib/i18n/navigation.ts";
import { type Href, serializeHref } from "#/lib/navigation/href.ts";
import { IntentLink } from "#/lib/navigation/intent-link.tsx";

export type LinkProps = Omit<ComponentProps<typeof IntlLink>, "href" | "prefetch"> & {
	href: Href;
	/**
	 * Next's `prefetch`, or `"intent"`: a default link prefetches only its route's App Shell, which for a detail page
	 * holds no more than a skeleton, so following it waits for the page itself. With `"intent"`, the page is prefetched
	 * as well, once the user shows an intent to follow the link - see `IntentLink`. Detail pages set `ensureStatic =
	 * "prefetch"`, so that prefetch is served from static output and never wakes the server.
	 *
	 * `prefetch={true}` would prefetch every visible link's page as soon as it scrolls into view, most of which a user
	 * never opens.
	 */
	prefetch?: ComponentProps<typeof IntlLink>["prefetch"] | "intent";
};

export function Link({ href, prefetch, ...props }: LinkProps): ReactNode {
	if (prefetch === "intent") {
		return <IntentLink {...props} href={serializeHref(href)} />;
	}

	return <IntlLink {...props} href={serializeHref(href)} prefetch={prefetch} />;
}
