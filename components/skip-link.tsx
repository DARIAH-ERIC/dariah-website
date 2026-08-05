import cn from "clsx/lite";
import type { ReactNode } from "react";

import { Link, type LinkProps } from "@/components/ui/link/link";

export function SkipLink(props: Readonly<LinkProps>): ReactNode {
	const { children, className, href, ...rest } = props;

	return (
		<Link
			{...rest}
			className={cn("absolute z-0 focus:z-9", className)}
			href={href}
			variant="button-secondary-blue"
		>
			{children}
		</Link>
	);
}
