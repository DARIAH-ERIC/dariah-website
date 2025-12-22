"use client";

import { styles } from "@acdh-oeaw/style-variants";
import React, { type ReactNode } from "react";
import {
	Button as AriaButton,
	type ButtonProps as AriaButtonProps,
	composeRenderProps,
} from "react-aria-components";

interface ButtonProps extends AriaButtonProps {
	/** @default "primary" */
	variant?: "primary" | "secondary" | "quiet";
}

const button = styles({
	base: [
		"relative inline-flex items-center justify-center gap-2 border h-9 px-3.5 py-0 font-body text-sm font-medium text-center transition rounded-lg cursor-default",
		"[&:has(>svg:only-child)]:px-0 [&:has(>svg:only-child)]:size-8 [&>svg]:size-4",
		"outline-primary-600 outline-offset-2 outline-0 focus-visible:outline-2 forced-colors:outline-[Highlight]",
		"disabled:border-transparent disabled:bg-neutral-100 disabled:text-neutral-300 disabled:forced-colors:text-[GrayText]",
		"pending:text-transparent",
	],
	variants: {
		variant: {
			primary:
				"border-transparent bg-primary-600 hover:bg-primary-700 pressed:bg-primary-800 text-white",
			secondary:
				"border-black/10 bg-secondary-50 hover:bg-secondary-100 pressed:bg-secondary-200 text-secondary-800",
			quiet:
				"border-transparent bg-transparent hover:bg-neutral-200 pressed:bg-neutral-300 text-neutral-800",
		},
	},
	defaults: {
		variant: "primary",
	},
});

export function Button(props: Readonly<ButtonProps>): ReactNode {
	const { children, className, variant, ...rest } = props;

	return (
		<AriaButton
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return button({ ...renderProps, className, variant });
			})}
		>
			{composeRenderProps(children, (children, { isPending }) => {
				return (
					<>
						{children}
						{isPending && (
							<span
								aria-hidden={true}
								className="absolute inset-0 flex items-center justify-center"
							>
								<svg
									className="size-4 animate-spin text-white"
									stroke={variant === "secondary" || variant === "quiet" ? "black" : "white"}
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										fill="none"
										r="10"
										strokeWidth="4"
									/>
									<circle
										cx="12"
										cy="12"
										fill="none"
										pathLength="100"
										r="10"
										strokeDasharray="60 140"
										strokeDashoffset="0"
										strokeLinecap="round"
										strokeWidth="4"
									/>
								</svg>
							</span>
						)}
					</>
				);
			})}
		</AriaButton>
	);
}
