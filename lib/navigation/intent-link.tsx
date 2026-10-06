"use client";

import { type ComponentProps, type ReactNode, useState } from "react";

import { IntlLink } from "#/lib/i18n/navigation.ts";

export interface IntentLinkProps extends Omit<ComponentProps<typeof IntlLink>, "prefetch"> {}

/**
 * A link which prefetches its route's App Shell while it is in the viewport, as a default link does, and the page for
 * its own url once a pointer hovers it, it is focused, or a touch starts on it - see `Link`'s `prefetch="intent"`.
 *
 * Switching `prefetch` to `true` makes next re-register the link with a per-link prefetch, which it starts at once
 * while the link is visible. It stays `true`, so a link prefetches its page at most once per stale time.
 */
export function IntentLink(props: Readonly<IntentLinkProps>): ReactNode {
	const { onFocus, onMouseEnter, onTouchStart, ...rest } = props;

	const [hasIntent, setHasIntent] = useState(false);

	return (
		<IntlLink
			{...rest}
			onFocus={(event) => {
				setHasIntent(true);
				onFocus?.(event);
			}}
			onMouseEnter={(event) => {
				setHasIntent(true);
				onMouseEnter?.(event);
			}}
			onTouchStart={(event) => {
				setHasIntent(true);
				onTouchStart?.(event);
			}}
			prefetch={hasIntent ? true : undefined}
		/>
	);
}
