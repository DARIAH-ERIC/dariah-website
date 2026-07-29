"use client";

import { cn } from "@acdh-oeaw/style-variants";
import React, { type ElementType, type ReactNode, use } from "react";
import {
	Button as AriaButton,
	type ButtonProps as AriaButtonProps,
	DisclosureStateContext,
} from "react-aria-components";

import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { ChevronUpIcon } from "@/components/ui/icons/chevron-up";
import { NavLink } from "@/components/ui/link/nav-link";
import { useNavMenuTrigger } from "@/components/ui/navigation/nav-menu";

interface NavButtonProps extends Omit<AriaButtonProps, "children"> {
	isLinkElement?: boolean;
	children: ReactNode;
	active?: boolean;
	href?: string;
	target?: "_blank";
}

export function NavButton(props: Readonly<NavButtonProps>): ReactNode {
	const {
		isLinkElement = false,
		children,
		href,
		className,
		active = false,
		target,
		...rest
	} = props;
	const ElementType: ElementType = isLinkElement ? NavLink : AriaButton;

	/** Only set when the button is the toggle button of a `NavMenu`. */
	const navMenuTriggerProps = useNavMenuTrigger();
	const triggerProps = isLinkElement ? undefined : navMenuTriggerProps;

	const isExpanded = use(DisclosureStateContext)?.isExpanded === true;

	return (
		<ElementType
			{...triggerProps}
			{...rest}
			className={cn(
				"group cursor-pointer bg-transparent border-[3px] border-transparent p-1.25 flex gap-1 text-text-link-bg items-center uppercase [&>svg]:size-5 [&>svg]:fill-text-link-bg",
				"hover:border-b-primary hover:bg-white",
				"data-focus-visible:border-primary data-focus-visible:outline-none",
				"aria-expanded:border-b-primary aria-expanded:bg-white",
				"pressed:text-primary pressed:[&>svg]:fill-primary",
				className,
			)}
			data-active={active || undefined}
			href={href}
			target={target}
		>
			{children}
			{isExpanded ? (
				<ChevronUpIcon aria-hidden={true} className={isLinkElement ? "hidden" : "shrink-0"} />
			) : (
				<ChevronDownIcon aria-hidden={true} className={isLinkElement ? "hidden" : "shrink-0"} />
			)}
		</ElementType>
	);
}
