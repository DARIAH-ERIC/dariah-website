/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { type ForwardedRef, forwardRef, type ReactNode } from "react";
import { Button, type ButtonProps as AriaButtonProps } from "react-aria-components";

import { Link, type LinkProps } from "@/components/link";

type MenuTabProps =
	| ({
			as: "link";
			href: string;
			active?: boolean;
	  } & Omit<LinkProps, "href">)
	| ({
			as: "button";
			active?: boolean;
	  } & AriaButtonProps);

export const MenuTab = forwardRef(function MenuTab(
	props: Readonly<MenuTabProps>,
	ref: ForwardedRef<HTMLButtonElement>,
): ReactNode {
	const { as, className } = props;

	const classList = cn(
		"mx-3 my-[3px] box-border py-2 text-small uppercase text-primary-500",
		"hover:font-bold",
		"focus:m-0 focus:border-[3px] focus:border-primary-500 focus:px-2 focus:font-bold",
		"data-[active]:mb-0 data-[active]:border-b-[3px] data-[active]:border-primary-500 data-[active]:font-bold",
		className,
	);

	if (as === "link") {
		const { as: _, active, children, className: __, ...rest } = props;
		return (
			<Link
				ref={ref}
				className={classList}
				data-active={active || undefined}
				isDisabled={active}
				{...rest}
			>
				{children}
			</Link>
		);
	}

	const { as: _, active, children, className: __, ...rest } = props;
	return (
		<Button
			ref={ref}
			className={classList}
			data-active={active || undefined}
			isDisabled={active}
			{...rest}
		>
			{children}
		</Button>
	);
});
