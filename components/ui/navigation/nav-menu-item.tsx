"use client";

import { cn } from "@acdh-oeaw/style-variants";
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import NextLink from "next/link";
import React, { type ReactNode } from "react";
import {
	MenuItem as AriaMenuItem,
	type MenuItemProps as AriaMenuItemProps,
} from "react-aria-components";

export function NavMenuItem<T extends object>(props: Readonly<AriaMenuItemProps<T>>): ReactNode {
	const { children, className, ...rest } = props;

	return (
		<AriaMenuItem
			{...rest}
			className={cn(
				"px-5 py-1 cursor-pointer text-regular text-text-link-bg uppercase bg-transparent font-normal rounded-none",
				"hover:bg-button-bg",
				"data-focused:bg-button-bg data-focused:outline-3 data-focused:outline-primary",
				"pressed:text-primary pressed:bg-transparent pressed:outline-none",
				className,
			)}
			render={(domProps, renderProps) => {
				if ("href" in domProps && domProps.href && !renderProps.isDisabled) {
					return <NextLink {...domProps} />;
				}

				return (
					<div
						{...domProps}
						// @ts-expect-error -- Link may be disabled but have `href`.
						href={undefined}
					/>
				);
			}}
		>
			{children}
		</AriaMenuItem>
	);
}
