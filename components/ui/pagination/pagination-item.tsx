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
				"mb-[2px] w-[27px] bg-inherit p-2 text-regular text-black",
				"hover:bg-gray-200",
				"focus:mb-0 focus:border-b-2 focus:border-black focus:bg-accent-300 focus:outline-hidden",
				"data-active:mb-0 data-active:border-b-2 data-active:border-primary-500 data-active:bg-transparent",
			)}
			// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
			data-active={active || undefined}
			isDisabled={active}
			{...props}
		>
			{value}
		</AriaButton>
	);
}
