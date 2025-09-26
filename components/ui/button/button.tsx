"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { type ForwardedRef, forwardRef, type ReactElement, type ReactNode } from "react";
import { useFocusRing, useHover, usePress } from "react-aria";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";

import { type ButtonVariantProps, buttonVariants } from "@/components/ui/button/button.variants";
import { useRenderProps } from "@/lib/use-render-props";

type ButtonProps = AriaButtonProps &
	ButtonVariantProps & {
		startIcon?: ReactElement;
		endIcon?: ReactElement;
	};

export const Button = forwardRef(function Button(
	props: Readonly<ButtonProps>,
	ref: ForwardedRef<HTMLButtonElement>,
): ReactNode {
	const { variant, size, className, startIcon, endIcon, ...rest } = props;

	const isDisabled = props.isDisabled === true;
	const isPending = props.isPending ?? false;
	const { isPressed } = usePress({ ...rest });
	const { isHovered } = useHover(rest);
	const { isFocused, isFocusVisible } = useFocusRing();

	const renderProps = useRenderProps({
		...props,
		values: {
			isDisabled,
			isPending,
			isPressed,
			isHovered,
			isFocused,
			isFocusVisible,
		},
	});

	return (
		<AriaButton ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...rest}>
			{variant !== "icon" && startIcon}
			<span>{renderProps.children}</span>
			{variant !== "icon" && endIcon}
		</AriaButton>
	);
});
