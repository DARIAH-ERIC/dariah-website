"use client";

import { type ReactNode, Suspense } from "react";

import { useIntlPathname } from "#/lib/i18n/navigation.ts";
import { isCurrentHref } from "#/lib/navigation/href.ts";
import { Link, type LinkProps } from "#/lib/navigation/link.tsx";

export interface NavigationLinkProps extends Omit<LinkProps, "aria-current"> {}

function CurrentPageLink(props: Readonly<NavigationLinkProps>): ReactNode {
	const { href, ...rest } = props;

	const pathname = useIntlPathname();
	const isCurrent = isCurrentHref(href, pathname);

	return <Link {...rest} aria-current={isCurrent ? "page" : undefined} href={href} />;
}

/**
 * A `Link` which marks the current page with `aria-current`, for links in a navigation landmark - the logo linking
 * home, the search link, and, via `NavigationMenuLink`, menu items.
 *
 * With cache components, the pathname suspends on routes with a dynamic param not covered by `generateStaticParams`.
 * These links sit in the shared layout, so the prerendered shell holds them without `aria-current`, which streams in
 * once the pathname is known.
 */
export function NavigationLink(props: Readonly<NavigationLinkProps>): ReactNode {
	return (
		<Suspense fallback={<Link {...props} />}>
			<CurrentPageLink {...props} />
		</Suspense>
	);
}
