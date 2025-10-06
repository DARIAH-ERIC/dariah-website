"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { type ForwardedRef, forwardRef, type ReactNode } from "react";

import { Link, type LinkProps } from "@/components/link";

export const NavTab = forwardRef(function NavTab(
	props: Readonly<LinkProps>,
	ref: ForwardedRef<HTMLButtonElement | HTMLAnchorElement>,
): ReactNode {
	const { children, ...rest } = props;

	return (
		<Link
			{...rest}
			ref={ref}
			className={cn(
				"border-4 border-transparent bg-transparent px-2 text-regular font-bold leading-9 text-white",
				"hover:border-gray-100 hover:bg-gray-100 hover:text-primary-500",
				"focus:border-white focus:bg-transparent focus:text-primary-500",
				"data-pressed:bg-white data-pressed:text-gray-900",
			)}
		>
			{children}
		</Link>
	);
});
