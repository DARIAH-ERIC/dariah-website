"use client";

import type { ReactNode } from "react";
import {
	Input as AriaInput,
	Label as AriaLabel,
	TextField as AriaTextField,
	type TextFieldProps as AriaTextFieldProps,
} from "react-aria-components";

interface TextFieldProps extends AriaTextFieldProps {
	label: ReactNode;
}

export function TextField(props: Readonly<TextFieldProps>): ReactNode {
	const { label, ...rest } = props;

	return (
		<AriaTextField {...rest}>
			<AriaLabel>{label}</AriaLabel>
			<AriaInput />
		</AriaTextField>
	);
}
