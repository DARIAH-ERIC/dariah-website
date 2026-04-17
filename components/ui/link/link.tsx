"use client";

import type { UrlObject } from "node:url";

import type { GetVariantProps } from "@acdh-oeaw/style-variants";
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { type ComponentProps, type ElementType, Fragment, type ReactNode } from "react";
import { Link as AriaLink, type LinkProps as AriaLinkProps } from "react-aria-components";

import { ChevronForwardIcon } from "@/components/ui/icons/chevron-forward";
import { ChevronLeftIcon } from "@/components/ui/icons/chevron-left";
import { linkStyles } from "@/components/ui/link/link.styles";

type LinkStyleProps = GetVariantProps<typeof linkStyles>;

export interface LinkProps
	extends
		LinkStyleProps,
		Pick<NextLinkProps, "prefetch" | "replace" | "scroll" | "shallow">,
		Omit<AriaLinkProps, "elementType" | "href" | "routerOptions" | "slot">,
		Pick<ComponentProps<"a">, "aria-current" | "id"> {
	href?: Exclude<NextLinkProps["href"], UrlObject>;
	children?: ReactNode;
	withDefaultLeftIcon?: boolean;
	withDefaultRightIcon?: boolean;
	startIcon?: ReactNode;
	endIcon?: ReactNode;
}

export function Link(props: Readonly<LinkProps>): ReactNode {
	const {
		children,
		className,
		variant,
		startIcon,
		endIcon,
		withDefaultLeftIcon = false,
		withDefaultRightIcon = false,
		...rest
	} = props;

	const ChildrenWrapper: ElementType = variant === "unstyled" ? Fragment : "span";

	return (
		<AriaLink
			{...rest}
			className={(renderProps) => {
				return linkStyles({ ...renderProps, className, variant });
			}}
			render={(domProps, renderProps) => {
				if ("href" in domProps && domProps.href && !renderProps.isDisabled) {
					return <NextLink {...domProps} />;
				}

				return (
					<span
						{...domProps}
						// @ts-expect-error -- Link may be disabled but have `href`.
						href={undefined}
					/>
				);
			}}
		>
			{withDefaultLeftIcon ? <ChevronLeftIcon /> : null}
			{startIcon}
			<ChildrenWrapper>{children}</ChildrenWrapper>
			{endIcon}
			{withDefaultRightIcon ? <ChevronForwardIcon /> : null}
		</AriaLink>
	);
}
