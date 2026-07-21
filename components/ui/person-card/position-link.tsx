import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";

import { Link, type LinkProps } from "@/components/ui/link/link";

export function PostitionLink({
	className,
	href,
	...props
}: Readonly<Omit<LinkProps, "href"> & { href: string | null | undefined }>): ReactNode {
	return (
		<Link
			{...props}
			className={cn(className, "inline underline underline-offset-[24%] decoration-[10%]")}
			href={href ?? undefined}
		/>
	);
}
