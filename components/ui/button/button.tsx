"use client";

import type { GetVariantProps } from "@acdh-oeaw/style-variants";
import React, { type ReactNode } from "react";
import { useFocusRing, useHover, usePress } from "react-aria";
import {
	Button as AriaButton,
	type ButtonProps as AriaButtonProps,
	composeRenderProps,
	useRenderProps,
} from "react-aria-components";

import { buttonStyles } from "@/components/ui/button/button.styles";

type ButtonStyleProps = GetVariantProps<typeof buttonStyles>;

interface ButtonProps extends AriaButtonProps, ButtonStyleProps {
	startIcon?: ReactNode;
	endIcon?: ReactNode;
}

export function Button(props: Readonly<ButtonProps>): ReactNode {
	const { className, variant, isDisabled, isPending, startIcon, endIcon, ...rest } = props;

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
			<span>
				{variant !== "icon-button" && startIcon}
				{renderProps.children}
				{variant !== "icon-button" && endIcon}
			</span>
		</AriaButton>
	);
}
