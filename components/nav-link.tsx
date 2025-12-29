"use client";

import type { ComponentProps, ReactNode } from "react";

import { Link } from "@/components/link";
import { useNavLink } from "@/lib/navigation/use-nav-link";

interface NavLinkProps extends ComponentProps<typeof Link> {}

export function NavLink(props: Readonly<NavLinkProps>): ReactNode {
	const { children, ...rest } = props;

	const navLinkProps = useNavLink(rest);

	return (
		<Link {...rest} {...navLinkProps}>
			{children}
		</Link>
	);
}
