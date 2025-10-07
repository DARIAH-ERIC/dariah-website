"use client";

import { type GetVariantProps, styles } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";
import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";

const buttonStyles = styles({
	base: ["inline-flex items-center justify-center"],
	variants: {
		size: {
			sm: ["gap-x-2 border px-6 py-2 text-regular font-semibold"],
			lg: ["gap-x-2 border-2 px-6 py-4 text-h4"],
		},
		variant: {
			primary: [
				"rounded-full border-transparent bg-primary-500 text-white shadow-light-button",
				"hover:bg-primary-600 hover:shadow-medium-button",
				"focus-visible:shadow-large-button focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600",
				"pressed:bg-primary-700 pressed:shadow-medium-button",
				"disabled:bg-neutral-500 disabled:text-neutral-200 disabled:shadow-medium-button",
			],
			secondary: [
				"rounded-full border-primary-500 bg-white text-primary-600 shadow-light-button",
				"hover:bg-primary-100 hover:shadow-medium-button",
				"focus-visible:shadow-large-button focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600",
				"pressed:bg-primary-200 pressed:shadow-medium-button",
				"disabled:border-neutral-400 disabled:bg-neutral-300 disabled:text-neutral-500 disabled:shadow-medium-button",
			],
			"text-primary": [
				"gap-x-2 bg-transparent text-primary-500",
				"hover:text-primary-600",
				"focus-visible:text-neutral-900",
				"pressed:text-primary-700 pressed:[&>span]:mb-px",
				"[&>span]:mb-px [&>span]:border-b [&>span]:border-primary-500 [&>span]:py-1",
				"hover:[&>span]:mb-0 hover:[&>span]:border-b-2",
				"focus-visible:[&>span]:mb-0 focus-visible:[&>span]:border-b-2 focus-visible:[&>span]:border-neutral-900 focus-visible:[&>span]:bg-accent-300",
				"pressed:[&>span]:border-b pressed:[&>span]:border-primary-700 pressed:[&>span]:bg-transparent",
			],
			"text-standard": [
				"gap-x-4 bg-transparent py-2 text-neutral-900",
				"hover:text-primary-600",
				"focus-visible:text-neutral-900",
				"pressed:text-primary-700",
				"[&>span]:mb-px [&>span]:border-b [&>span]:py-1",
				"hover:[&>span]:mb-0 hover:[&>span]:border-b-2",
				"focus-visible:[&>span]:mb-0 focus-visible:[&>span]:border-b-2 focus-visible:[&>span]:border-neutral-900 focus-visible:[&>span]:bg-accent-300",
				"pressed:[&>span]:mb-px pressed:[&>span]:border-b pressed:[&>span]:border-primary-700 pressed:[&>span]:bg-transparent",
			],
			icon: [
				"rounded-sm bg-neutral-100 p-2 text-primary-500",
				"hover:bg-primary-200",
				"focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent-600",
				"disabled:text-neutral-400",
			],
		},
	},
	defaults: {
		size: "sm",
		variant: "primary",
	},
});

type ButtonStyleProps = GetVariantProps<typeof buttonStyles>;

interface ButtonProps extends AriaButtonProps, ButtonStyleProps {}

export function Button(props: Readonly<ButtonProps>): ReactNode {
	const { children, className, size, variant, ...rest } = props;

	return (
		<AriaButton {...rest} className={buttonStyles({ className, size, variant })}>
			{children}
		</AriaButton>
	);
}
