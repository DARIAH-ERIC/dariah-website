"use client";

import { cn, type GetVariantProps, styles } from "@acdh-oeaw/style-variants";
import React, { type ElementType, type ReactNode } from "react";
import { useFocusRing, useHover, usePress } from "react-aria";
import {
	Button as AriaButton,
	type ButtonProps as AriaButtonProps,
	composeRenderProps,
	useRenderProps,
} from "react-aria-components";

const buttonStyles = styles({
	base: [
		"cursor-pointer p-1.5 box-border *:flex *:justify-center *:items-center *:size-full *:gap-2",
		"transition-colors duration-200 ease-in-out",
	],
	variants: {
		variant: {
			primary: cn(
				"bg-white outline-2 outline-primary text-in-text-link font-bold text-regular w-58.75 *:py-2.5 *:px-4.5",
				"hover:bg-primary hover:outline-white hover:text-white",
				"focus:bg-white focus:outline-primary focus:text-in-text-link focus:*:outline-2 focus:*:outline-primary",
			),
			"secondary-blue": cn(
				"bg-primary outline-2 outline-white text-white text-regular font-bold shadow-light *:py-2.5 *:px-4.5",
				"hover:bg-white hover:outline-primary hover:text-primary",
				"focus:bg-primary focus:text-white focus:outline-white focus:*:outline-2 focus:*:outline-white",
			),
			"secondary-black": cn(
				"bg-text-link-bg outline-2 outline-white text-white text-regular font-bold shadow-light *:py-2.5 *:px-4.5",
				"hover:bg-white hover:outline-text-link-bg hover:text-text-link-bg",
				"focus:bg-text-link-bg focus:text-white focus:outline-white focus:*:outline-2 focus:*:outline-white",
			),
			tertiary: cn(
				"bg-primary outline-2 outline-white text-white text-regular w-62.75 *:py-0.5 *:px-4.5",
				"hover:bg-white hover:outline-primary hover:text-primary",
				"focus:bg-primary focus:outline-white focus:text-white focus:*:outline-2 focus:*:outline-white",
			),
			"color-bg": cn(
				"bg-white outline-2 outline-primary text-in-text-link text-regular w-58.75 *:py-2.5 *:px-4.5",
				"hover:bg-primary hover:outline-white hover:text-white",
				"focus:bg-primary focus:text-white focus:outline-white focus:*:outline-2 focus:*:outline-white",
			),
			"icon-button": cn(
				"p-2.5 bg-gray-100 *:p-0! [&_svg]:fill-black",
				"hover:bg-button-bg hover:[&_svg]:fill-primary",
				"focus:bg-button-bg focus:outline-3 focus:outline-primary focus:[&_svg]:fill-primary",
				"pressed:bg-button-bg pressed:outline-none pressed:[&_svg]:fill-black",
				"disabled:text-gray-400",
			),
			"icon-button-color-bg": cn(
				"p-0! bg-transparent text-white text-regular *:p-0",
				"hover:bg-white hover:text-text-link-bg",
				"focus:bg-transparent focus:text-white focus:outline-white",
				"disabled:text-gray-400",
			),
			"link-primary": cn(
				"py-2 gap-2 text-regular font-semibold text-section-text [&_svg]:fill-primary",
				"w-fit hover:underline hover:decoration-[10%] hover:text-primary hover:underline-offset-[24%]",
				"focus-visible:text-section-text focus-visible:decoration-[3px] focus-visible:underline-offset-[24%] focus-visible:underline focus-visible:[&>span]:bg-accent-100 focus-visible:[&>svg]:fill-black",
				"focus-visible:outline-none",
			),
			"disclosure-white-bg": cn(
				"bg-transparent text-gray-900 gap-2 px-2 py-4 max-w-screen [&_svg]:fill-gray-900",
				"hover:underline",
				"focus-visible:underline focus-visible:decoration-[3px]",
				"focus-visible:outline-none",
				"data-expanded:bg-gray-200 data-expanded:text-black data-expanded:font-medium data-expanded:[&_svg]:fill-primary",
			),
			"disclosure-color-bg": cn(
				"bg-transparent text-white gap-2 py-4! px-6! [&_svg]:fill-white",
				"hover:underline",
				"focus-visible:underline focus-visible:decoration-[3px]",
				"focus-visible:outline-none",
				"data-expanded:bg-gray-200 data-expanded:text-black data-expanded:font-medium data-expanded:[&_svg]:fill-primary",
			),
			"select-button": cn(
				"px-5 py-1 cursor-pointer text-regular text-text-link-bg uppercase bg-transparent font-normal rounded-none",
				"hover:bg-button-bg",
				"data-focused:bg-button-bg data-focused:outline-3 data-focused:outline-primary",
				"pressed:text-primary pressed:bg-transparent pressed:outline-none",
				"active:text-primary active:bg-transparent active:outline-none",
			),
			"carousel-button": cn(
				"px-0 py-3 bg-pagination-bg shadow-carousel-button md:p-3 [&_svg]:size-10 [&_svg]:fill-white",
				"hover:bg-white hover:outline-text-link-bg hover:[&_svg]:fill-text-link-bg",
				"focus:bg-pagination-bg focus:outline-white focus:outline-2 focus:[&_svg]:fill-white",
				"",
			),
			quiet:
				"border-transparent bg-transparent text-neutral-800 hover:bg-neutral-200 pressed:bg-neutral-300",
		},
	},
	defaults: {
		variant: "primary",
	},
});

type ButtonStyleProps = GetVariantProps<typeof buttonStyles>;

interface ButtonProps extends AriaButtonProps, ButtonStyleProps {
	startIcon?: ReactNode;
	endIcon?: ReactNode;
	href?: string;
}

export function Button(props: Readonly<ButtonProps>): ReactNode {
	const { className, variant, isDisabled, isPending, startIcon, endIcon, href, ...rest } = props;

	const { isPressed } = usePress({ ...rest });
	const { isHovered } = useHover(rest);
	const { isFocused, isFocusVisible } = useFocusRing();

	const WrapperComponent: ElementType = href != null ? "a" : "span";

	const renderProps = useRenderProps({
		...props,
		values: {
			isDisabled: isDisabled === true,
			isPending: isPending ?? false,
			isPressed,
			isHovered,
			isFocused,
			isFocusVisible,
		},
	});

	return (
		<AriaButton
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return buttonStyles({ ...renderProps, className, variant });
			})}
		>
			<WrapperComponent href={href} target="_blank">
				{variant !== "icon-button" && startIcon}
				{renderProps.children}
				{variant !== "icon-button" && endIcon}
			</WrapperComponent>
		</AriaButton>
	);
}
