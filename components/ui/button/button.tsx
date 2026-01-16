"use client";

import { cn, type GetVariantProps, styles } from "@acdh-oeaw/style-variants";
import React, { type ReactNode } from "react";
import { useFocusRing, useHover, usePress } from "react-aria";
import {
	Button as AriaButton,
	type ButtonProps as AriaButtonProps,
	composeRenderProps,
	useRenderProps,
} from "react-aria-components";

const buttonStyles = styles({
	base: [
		"cursor-pointer p-1.5 box-border flex justify-center items-center [&>span]:size-full [&>span]:py-2.5 [&>span]:px-4.5",
	],
	variants: {
		variant: {
			primary: cn(
				"bg-white outline-2 outline-primary text-in-text-link text-h3 text-[18px] w-58.75",
				"hover:bg-primary hover:outline-white hover:text-white",
				"focus:bg-white focus:outline-primary focus:text-in-text-link focus:[&>span]:outline-2 focus:[&>span]:outline-primary",
			),
			"secondary-blue": cn(
				"bg-primary outline-2 outline-white text-white text-h4 shadow-light",
				"hover:bg-white hover:outline-primary hover:text-primary",
				"focus:bg-primary focus:text-white focus:outline-white focus:[&>span]:outline-2 focus:[&>span]:outline-white",
			),
			"secondary-black": cn(
				"bg-text-link-bg outline-2 outline-white text-white text-regular shadow-light",
				"hover:bg-white hover:outline-text-link-bg hover:text-text-link-bg",
				"focus:bg-text-link-bg focus:text-white focus:outline-white focus:[&>span]:outline-2 focus:[&>span]:outline-white",
			),
			"icon-button": cn(
				"p-2.5 bg-gray-100 [&_svg]:fill-black [&>span]:p-0!",
				"hover:bg-button-bg hover:[&_svg]:fill-primary",
				"focus:bg-button-bg focus:outline-3 focus:outline-primary focus:[&_svg]:fill-primary",
				"pressed:bg-transparent pressed:outline-none pressed:[&_svg]:fill-primary",
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

interface ButtonProps extends AriaButtonProps, ButtonStyleProps {}

export function Button(props: Readonly<ButtonProps>): ReactNode {
	const { className, variant, isDisabled, isPending, ...rest } = props;

	const { isPressed } = usePress({ ...rest });
	const { isHovered } = useHover(rest);
	const { isFocused, isFocusVisible } = useFocusRing();

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
			<span>{renderProps.children}</span>
		</AriaButton>
	);
}
