import { cn } from "@acdh-oeaw/style-variants";
import React, { type ReactNode } from "react";
import { composeRenderProps, Tab as RACTab, type TabProps } from "react-aria-components";

export function Tab(props: Readonly<TabProps>): ReactNode {
	const { className } = props;

	return (
		<RACTab
			{...props}
			className={composeRenderProps(className, (className, renderProps) => {
				return cn(
					"p-4 border-b-4 border-b-transparent cursor-pointer",
					"selected:border-b-accent-700",
					{
						...renderProps,
						className,
					},
				);
			})}
		/>
	);
}
