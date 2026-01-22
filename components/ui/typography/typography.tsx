"use client";

import { cn } from "@acdh-oeaw/style-variants";
import type { ElementType, HTMLAttributes, ReactNode } from "react";

const typographyConfig = {
	h1: {
		element: "h1",
		className: "text-h1",
	},
	h2: {
		element: "h2",
		className: "text-h2",
	},
	h3: {
		element: "h3",
		className: "text-h3",
	},
	h4: {
		element: "h4",
		className: "text-h4",
	},
	regular: {
		element: "p",
		className: "text-regular",
	},
	small: {
		element: "p",
		className: "text-small",
	},
	caption: {
		element: "p",
		className: "text-caption",
	},
} satisfies Record<
	string,
	{
		element: ElementType;
		className: string;
	}
>;

type TypographyProps = HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> & {
	variant?: keyof typeof typographyConfig;
	children?: ReactNode;
	as?: ElementType;
	className?: string;
};

export function Typography(props: Readonly<TypographyProps>): ReactNode {
	const { variant = "regular", as, children, className, ...rest } = props;
	const { element, className: variantClass } = typographyConfig[variant];

	const Component = as ?? element;

	return (
		<Component className={cn(variantClass, className)} {...rest}>
			{children}
		</Component>
	);
}
