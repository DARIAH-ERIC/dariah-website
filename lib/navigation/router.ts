"use client";

import { useIntlRouter } from "#/lib/i18n/navigation.ts";
import { type Href, serializeHref } from "#/lib/navigation/href.ts";

type IntlRouter = ReturnType<typeof useIntlRouter>;

export type Router = Omit<IntlRouter, "prefetch" | "push" | "replace"> & {
	prefetch: (href: Href, options?: Parameters<IntlRouter["prefetch"]>[1]) => void;
	push: (href: Href, options?: Parameters<IntlRouter["push"]>[1]) => void;
	replace: (href: Href, options?: Parameters<IntlRouter["replace"]>[1]) => void;
};

export function useRouter(): Router {
	const router = useIntlRouter();

	return {
		...router,
		prefetch(href, options) {
			router.prefetch(serializeHref(href), options);
		},
		push(href, options) {
			router.push(serializeHref(href), options);
		},
		replace(href, options) {
			router.replace(serializeHref(href), options);
		},
	};
}
