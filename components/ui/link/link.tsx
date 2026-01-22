"use client";

import type { UrlObject } from "node:url";

import { cn, type GetVariantProps, styles } from "@acdh-oeaw/style-variants";
import { filterDOMProps, mergeRefs } from "@react-aria/utils";
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import {
	type ComponentProps,
	type ElementType,
	Fragment,
	type ReactNode,
	type Ref,
	useMemo,
	useRef,
} from "react";
import {
	mergeProps,
	useFocusable,
	useFocusRing,
	useHover,
	useObjectRef,
	usePress,
} from "react-aria";
import { type LinkProps as AriaLinkProps, useRenderProps } from "react-aria-components";

import { ChevronForwardIcon } from "@/components/ui/icons/chevron-forward";
import { ChevronLeftIcon } from "@/components/ui/icons/chevron-left";

/**
 * Not using `Link` from `react-aria-components` directly, because we want `next/link`'s built-in
 * prefetch behavior.
 *
 * @see {@link https://github.com/vercel/next.js/discussions/73381}
 *
 * @see {@link https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/Link.tsx}
 * @see {@link https://github.com/adobe/react-spectrum/blob/main/packages/%40react-aria/link/src/useLink.ts}
 */

const linkStyles = styles({
	base: ["cursor-pointer flex items-center [&>svg]:size-5 [&>svg]:fill-primary [&>span]:text-wrap"],
	variants: {
		variant: {
			primary: cn(
				"py-2 gap-2 text-h4 text-section-text",
				"w-fit hover:underline hover:decoration-[10%] hover:text-primary hover:underline-offset-[24%]",
				"focus-visible:text-section-text focus-visible:decoration-[3px] focus-visible:underline-offset-[24%] focus-visible:underline focus-visible:[&>span]:bg-accent-100 focus-visible:[&>svg]:fill-black",
				"focus-visible:outline-none",
			),
			secondary: cn(
				"gap-4 text-regular w-fit text-section-text",
				"hover:text-primary",
				"focus-visible:text-section-text focus-visible:decoration-[3px] focus-visible:underline-offset-[24%] focus-visible:underline focus-visible:[&>span]:bg-accent-100 focus-visible:[&>span]:text-section-text focus-visible:[&>span]:font-medium",
				"focus-visible:outline-none",
			),
			tertiary: cn(
				"gap-2 text-regular text-[14px] w-fit [&>span]:text-primary",
				"hover:text-primary hover:underline hover:decoration-[10%] hover:underline-offset-[24%]",
				"focus-visible:text-section-text focus-visible:decoration-[3px] focus-visible:underline-offset-[24%] focus-visible:underline focus-visible:[&>span]:bg-accent-100",
				"focus-visible:outline-none",
				"disabled:[&>span]:text-black",
			),
			"color-bg": cn(
				"bg-transparent text-white gap-2 h-11 [&>svg]:fill-white",
				"hover:underline",
				"focus-visible:underline focus-visible:decoration-[3px]",
				"focus-visible:outline-none",
			),
			"breadcrumb-current": "text-regular text-black text-[14px] cursor-default!",
			unstyled: "",
		},
	},
	defaults: {
		variant: "primary",
	},
});

type LinkStyleProps = GetVariantProps<typeof linkStyles>;

export interface LinkProps
	extends
		LinkStyleProps,
		Pick<NextLinkProps, "prefetch" | "replace" | "scroll" | "shallow">,
		Omit<AriaLinkProps, "elementType" | "href" | "routerOptions" | "slot">,
		Pick<ComponentProps<"a">, "aria-current" | "id"> {
	href?: Exclude<NextLinkProps["href"], UrlObject>;
	ref?: Ref<HTMLAnchorElement | HTMLSpanElement> | undefined;
	withLeftIcon?: boolean;
	leftIconReversed?: boolean;
	withRightIcon?: boolean;
}

export function Link(props: Readonly<LinkProps>): ReactNode {
	/** Ensure `className` is passed to `mergProps` only once to avoid duplication. */
	const {
		className,
		variant,
		ref: forwardedRef,
		withLeftIcon = false,
		leftIconReversed = false,
		withRightIcon = false,
		...interactionProps
	} = props;

	const ref = useRef<HTMLAnchorElement | HTMLSpanElement>(null);
	const linkRef = useObjectRef(
		useMemo(() => {
			// eslint-disable-next-line react-hooks/refs
			return mergeRefs(forwardedRef, ref);
		}, [forwardedRef, ref]),
	);

	const isDisabled = interactionProps.isDisabled === true;
	const isCurrent = Boolean(interactionProps["aria-current"]);
	const isLinkElement = Boolean(interactionProps.href) && !isDisabled;
	const ElementType: ElementType = isLinkElement ? NextLink : "span";
	const ChildrenWrapper: ElementType = variant === "unstyled" ? Fragment : "span";

	const withLeftIconDefault = withLeftIcon && !leftIconReversed;
	const withLeftIconReversed = withLeftIcon && leftIconReversed;

	const { focusableProps } = useFocusable(interactionProps, linkRef);
	const { pressProps, isPressed } = usePress({ ...interactionProps, ref: linkRef });
	const { hoverProps, isHovered } = useHover(interactionProps);
	const { focusProps, isFocused, isFocusVisible } = useFocusRing();

	const renderProps = useRenderProps({
		...props,
		values: {
			isCurrent,
			isDisabled,
			isPressed,
			isHovered,
			isFocused,
			isFocusVisible,
		},
	});

	return (
		<ElementType
			ref={linkRef}
			{...mergeProps(
				renderProps,
				filterDOMProps(props, { labelable: true, isLink: isLinkElement }),
				focusableProps,
				pressProps,
				hoverProps,
				focusProps,
			)}
			aria-disabled={isDisabled || undefined}
			className={linkStyles({ ...renderProps, variant, className })}
			data-current={isCurrent || undefined}
			data-disabled={isDisabled || undefined}
			data-focus-visible={isFocusVisible || undefined}
			data-focused={isFocused || undefined}
			data-hovered={isHovered || undefined}
			data-pressed={isPressed || undefined}
			data-rac=""
			role={!isLinkElement ? "link" : undefined}
		>
			{withLeftIconDefault && <ChevronLeftIcon />}
			{withLeftIconReversed && <ChevronForwardIcon />}
			<ChildrenWrapper>{renderProps.children}</ChildrenWrapper>
			{withRightIcon && <ChevronForwardIcon />}
		</ElementType>
	);
}
