"use client";

import cn from "clsx/lite";
import { ChevronDownIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";

import { NavLink as BaseNavLink } from "@/components/ui/link/nav-link";
import { Menu, MenuItem, MenuSeparator, MenuTrigger } from "@/components/ui/menu/menu";

interface NavLinkProps extends ComponentProps<typeof BaseNavLink> {}

export function NavLink(props: Readonly<NavLinkProps>): ReactNode {
	const { children, className, ...rest } = props;

	return (
		<BaseNavLink
			{...rest}
			className={cn(
				"font-medium px-2.5 py-1 text-sm text-neutral-700 transition inline-flex items-center rounded-xs",
				"hover:text-neutral-950 hover:bg-neutral-50",
				"pressed:text-neutral-950 pressed:bg-neutral-50",
				"outline-primary-600 outline-offset-2 outline-0 focus-visible:outline-2 forced-colors:outline-[Highlight]",
				className,
			)}
		>
			{children}
		</BaseNavLink>
	);
}

export const NavMenuTrigger = MenuTrigger;

interface NavMenuButtonProps extends Omit<AriaButtonProps, "children"> {
	children: ReactNode;
}

export function NavMenuButton(props: Readonly<NavMenuButtonProps>): ReactNode {
	const { children, className, ...rest } = props;

	return (
		<AriaButton
			{...rest}
			className={cn(
				"group font-medium gap-x-1.5 px-2.5 py-1 text-sm text-neutral-700 transition inline-flex items-center rounded-xs",
				"hover:text-neutral-950 hover:bg-neutral-50",
				"pressed:text-neutral-950 pressed:bg-neutral-50",
				"outline-primary-600 outline-offset-2 outline-0 focus-visible:outline-2 forced-colors:outline-[Highlight]",
				className,
			)}
		>
			{children}
			<ChevronDownIcon
				aria-hidden={true}
				className="size-3.5 shrink-0 text-neutral-600 transition group-hover:text-neutral-900 group-pressed:text-neutral-900 group-aria-expanded:rotate-180"
			/>
		</AriaButton>
	);
}

export const NavMenu = Menu;

export const NavMenuItem = MenuItem;

export const NavMenuSeparator = MenuSeparator;
