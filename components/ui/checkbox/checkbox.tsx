"use client";

import { cn } from "@acdh-oeaw/style-variants";
import React, { type ReactNode } from "react";
import {
	Checkbox as AriaCheckbox,
	type CheckboxProps as AriaCheckboxProps,
} from "react-aria-components";

import { CheckIcon } from "@/components/ui/icons/check";
import { Typography } from "@/components/ui/typography/typography";

interface CheckboxProps extends AriaCheckboxProps {
	label?: string;
}

export function Checkbox(props: Readonly<CheckboxProps>): ReactNode {
	const { label } = props;
	return (
		<AriaCheckbox className="group flex items-center cursor-pointer w-fit" {...props}>
			<div
				className={cn(
					"m-1 flex size-8 items-center justify-center rounded-full bg-transparent",
					"hover:bg-gray-200",
					"group-data-focus-visible:bg-accent-100",
					"group-pressed:bg-primary-200",
					"group-data-disabled:bg-transparent",
				)}
			>
				<div
					className={cn(
						"flex size-4.5 items-center justify-center rounded-sm border border-gray-600 bg-white",
						"group-data-focus-visible:border-2 group-data-focus-visible:border-black",
						"group-pressed:border group-pressed:border-primary-500",
						"group-data-disabled:border-gray-400 group-data-disabled:bg-gray-100",
						"group-selected:bg-primary",
						"group-selected:group-data-focus-visible:bg-black",
						"group-selected:group-data-disabled:bg-gray-200",
					)}
				>
					<CheckIcon
						aria-hidden="true"
						className={cn("fill-white", "group-selected:group-data-disabled:fill-gray-400")}
					/>
				</div>
			</div>
			{label !== undefined && <Typography variant="small">{label}</Typography>}
		</AriaCheckbox>
	);
}
