"use client";

import type { UrlObject } from "node:url";

import type { GetVariantProps } from "@acdh-oeaw/style-variants";
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import { useTranslations } from "next-intl";
import { type ComponentProps, type ElementType, Fragment, type ReactNode, type Ref } from "react";
import { Link as AriaLink, type LinkProps as AriaLinkProps } from "react-aria-components";

import { ChevronForwardIcon } from "@/components/ui/icons/chevron-forward";
import { ChevronLeftIcon } from "@/components/ui/icons/chevron-left";
import { linkStyles } from "@/components/ui/link/link.styles";
import { env } from "@/config/env.config";

type LinkStyleProps = GetVariantProps<typeof linkStyles>;

export interface LinkProps
	extends
		LinkStyleProps,
		Pick<NextLinkProps, "prefetch" | "replace" | "scroll" | "shallow">,
		Omit<AriaLinkProps, "elementType" | "href" | "routerOptions" | "slot">,
		Pick<ComponentProps<"a">, "aria-current" | "id" | "tabIndex"> {
	href?: Exclude<NextLinkProps["href"], UrlObject>;
	children?: ReactNode;
	withDefaultLeftIcon?: boolean;
	withDefaultRightIcon?: boolean;
	startIcon?: ReactNode;
	endIcon?: ReactNode;
	ref?: Ref<HTMLAnchorElement>;
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
		"aria-label": ariaLabel,
		...rest
	} = props;

	const ChildrenWrapper: ElementType = variant === "unstyled" ? Fragment : "span";
	const t = useTranslations("(default).Link");

	const isExternalUrl = () => {
		const { href } = props;
		try {
			if (href == null) return false;
			const url = new URL(href);
			const currentHost = env.NEXT_PUBLIC_API_BASE_URL;

			if (currentHost !== url.host) return true;

			return false;
		} catch {
			return false;
		}
	};

	const parsedAriaLabel = isExternalUrl() ? `${ariaLabel ?? ""} ${t("external")}` : ariaLabel;

	return (
		<AriaLink
			{...rest}
			aria-label={parsedAriaLabel}
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
