import cn from "clsx/lite";
import type { ComponentProps, ReactNode } from "react";

interface SkipLinkProps extends ComponentProps<"a"> {
	children: ReactNode;
	href: `#${string}`;
}

export function SkipLink(props: Readonly<SkipLinkProps>): ReactNode {
	const { children, className, href, ...rest } = props;

	return (
		<a
			{...rest}
			className={cn(
				"absolute m-2 -translate-y-3/2 rounded-sm bg-white px-4 py-2 text-sm font-medium text-neutral-900 focus:translate-y-0 focus:outline-2 focus:outline-primary-600",
				className,
			)}
			href={href}
		>
			{children}
		</a>
	);
}
