import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

import type { Link } from "@/components/link";
import { env } from "@/config/env.config";
import { createFullUrl } from "@/lib/navigation/create-full-url";

type LinkProps<T extends string> = ComponentProps<typeof Link<T>>;

interface UseNavLinkParams<T extends string> extends Pick<LinkProps<T>, "aria-current" | "href"> {}

interface UseNavLinkReturnValue<T extends string> extends Pick<LinkProps<T>, "aria-current"> {}

export function useNavLink<T extends string>(
	params: UseNavLinkParams<T>,
): UseNavLinkReturnValue<T> {
	const { "aria-current": ariaCurrent, href } = params;

	const pathname = usePathname();

	if (ariaCurrent != null) {
		return {
			"aria-current": ariaCurrent,
		};
	}

	const isCurrent = isCurrentPage(href, pathname);

	return {
		"aria-current": isCurrent ? "page" : undefined,
	};
}

export function isCurrentPage(href: string | undefined, pathname: string): boolean {
	const url = createFullUrl({ pathname: href });

	const isCurrent = url.origin === env.NEXT_PUBLIC_APP_BASE_URL && url.pathname === pathname;

	return isCurrent;
}
