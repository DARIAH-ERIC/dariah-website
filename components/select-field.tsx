"use client";

import type { ReactNode } from "react";
import {
	Label as AriaLabel,
	Select as AriaSelect,
	type SelectProps as AriaSelectProps,
} from "react-aria-components";

interface SelectProps extends AriaSelectProps {
	label: ReactNode;
}

export function Select(props: Readonly<SelectProps>): ReactNode {
	const { label, ...rest } = props;

	return (
		<AriaSelect {...rest}>
			<AriaLabel>{label}</AriaLabel>
		</AriaSelect>
	);
}
