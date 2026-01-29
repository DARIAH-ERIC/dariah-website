"use client";

import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";
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

export function TextField(props: Readonly<TextFieldProps>): ReactNode {
	const { label, placeholder, startIcon, endIcon, ...rest } = props;

	return (
		<AriaTextField className="group flex flex-col gap-1" {...rest}>
			<Label className="text-regular font-semibold text-black">{label}</Label>
			<div
				className={cn(
					"flex h-14.75 items-center gap-2.5 px-3.25 pt-4.5 pb-4 text-regular text-black placeholder-gray-700 text-[16px]",
					"border-b-2 border-gray-200 border-b-gray-400 bg-gray-200",
					"hover:border-b-primary hover:bg-gray-200",
					"focus-within:px-2.75 focus-within:pt-4 focus-within:border-2 focus-within:border-primary hover:focus-within:border-primary",
				)}
			>
				{startIcon}
				<Input className="bg-transparent w-full focus:outline-none" placeholder={placeholder} />
				{endIcon}
			</div>
		</AriaTextField>
	);
}
