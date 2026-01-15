"use client";

import type { ComponentProps, ReactNode } from "react";

import { Link } from "@/components/ui/link/link";
import { useNavLink } from "@/lib/navigation/use-nav-link";

interface NavLinkProps extends ComponentProps<typeof Link> {}

export function NavLink(props: Readonly<NavLinkProps>): ReactNode {
	const { children, ...rest } = props;

	const navLinkProps = useNavLink(rest);

	return (
		<Link variant="unstyled" {...rest} {...navLinkProps}>
			{children}
		</Link>
	);
}
