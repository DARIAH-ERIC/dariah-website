import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";
import {
	composeRenderProps,
	TabList as RACTabList,
	type TabListProps,
} from "react-aria-components";

export function TabList<T extends object>(props: Readonly<TabListProps<T>>): ReactNode {
	const { className } = props;

	return (
		<RACTabList
			{...props}
			className={composeRenderProps(className, (className, renderProps) => {
				return cn("flex px-4 border-b border-b-gray-200 lg:px-40", {
					...renderProps,
					className,
				});
			})}
		/>
	);
}
