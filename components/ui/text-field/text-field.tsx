"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { type ForwardedRef, forwardRef, type ReactNode } from "react";
import {
	Input,
	Label,
	TextField as AriaTextField,
	type TextFieldProps as AriaTextFieldProps,
} from "react-aria-components";

type TextFieldProps = AriaTextFieldProps & {
	label?: string;
	placeholder?: string;
	startIcon?: ReactNode;
	endIcon?: ReactNode;
};

export const TextField = forwardRef(function TextField(
	props: Readonly<TextFieldProps>,
	forwardedRef: ForwardedRef<HTMLInputElement>,
): ReactNode {
	const { label, placeholder, startIcon, endIcon, ...rest } = props;

	return (
		<AriaTextField ref={forwardedRef} className="group flex flex-col gap-1" {...rest}>
			<Label className="text-medium text-black">{label}</Label>
			<div
				className={cn(
					"flex items-center gap-2 px-2.5 py-2 text-regular text-black placeholder-gray-700",
					"mb-0.5 rounded-t-1 border border-b-2 border-gray-200 border-b-gray-400 bg-gray-100",
					"hover:border-b-black hover:bg-gray-200",
					"focus-within:mb-0 focus-within:border-b-4 focus-within:border-b-accent-600 hover:focus-within:border-b-accent-600",
				)}
			>
				{startIcon}
				<Input className="bg-transparent focus:outline-none" placeholder={placeholder} />
				{endIcon}
			</div>
		</AriaTextField>
	);
});
