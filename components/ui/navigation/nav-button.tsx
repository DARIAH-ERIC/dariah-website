"use client";

import { cn } from "@acdh-oeaw/style-variants";
import React, { type ElementType, type ReactNode } from "react";
import { usePress } from "react-aria";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";

import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { ChevronUpIcon } from "@/components/ui/icons/chevron-up";
import { NavLink } from "@/components/ui/link/nav-link";

interface NavButtonProps extends Omit<AriaButtonProps, "children"> {
	isLinkElement?: boolean;
	children: ReactNode;
	active?: boolean;
	href?: string;
}

export function NavButton(props: Readonly<NavButtonProps>): ReactNode {
	const { isLinkElement = false, children, href, className, active = false, ...rest } = props;
	const ElementType: ElementType = isLinkElement ? NavLink : AriaButton;
	const { isPressed } = usePress({ ...rest });

	return (
		<ElementType
			{...rest}
			className={cn(
				"group cursor-pointer bg-transparent p-2 flex gap-1 text-text-link-bg items-center box-border uppercase [&>svg]:size-5",
				"hover:border-b-2 hover:pb-1.5 hover:border-b-primary hover:bg-white",
				"data-focused:border-3 data-focused:border-primary data-focused:p-1.25 data-focused:outline-none",
				"aria-expanded:border-b-3 aria-expanded:pb-1.5 aria-expanded:border-b-primary aria-expanded:bg-white",
				"pressed:text-primary",
				className,
			)}
			data-active={active || undefined}
			href={href}
		>
			{children}
			{isPressed ? (
				<ChevronUpIcon className={isLinkElement ? "hidden" : ""} />
			) : (
				<ChevronDownIcon className={isLinkElement ? "hidden" : ""} />
			)}
		</ElementType>
	);
}
