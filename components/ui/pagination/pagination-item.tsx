"use client";

import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";
import { Button as AriaButton, type ButtonProps } from "react-aria-components";

type PaginationItemProps = ButtonProps & {
	active?: boolean;
};

export function PaginationItem(props: Readonly<PaginationItemProps>): ReactNode {
	const { active, value } = props;

	return (
		<AriaButton
			className={cn(
				"p-2 bg-transparent text-white text-regular rounded-none",
				"hover:bg-white hover:text-text-link-bg",
				"focus:bg-transparent focus:text-white focus:outline-white focus:[&>span]:outline-2 focus:[&>span]:outline-white",
				"active:border-b-2 active:pb-1.5",
			)}
			data-active={active === true ? active : undefined}
			isDisabled={active}
			{...props}
		>
			{value}
		</AriaButton>
	);
}
