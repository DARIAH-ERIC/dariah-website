"use client";

import type { ComponentPropsWithRef, ReactNode } from "react";

import { Link } from "@/components/link";
import { useNavLink } from "@/lib/navigation/use-nav-link";

interface NavLinkProps<T extends string> extends ComponentPropsWithRef<typeof Link<T>> {}

export function NavLink<T extends string>(props: Readonly<NavLinkProps<T>>): ReactNode {
	const { children, ...rest } = props;

	const navLinkProps = useNavLink(rest);

	return (
		<Link {...rest} {...navLinkProps}>
			{children}
		</Link>
	);
}
