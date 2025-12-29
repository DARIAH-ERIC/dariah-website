"use client";

import cn from "clsx/lite";
import { CheckIcon, MinusIcon } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import {
	Checkbox as AriaCheckbox,
	CheckboxGroup as AriaCheckboxGroup,
	type CheckboxGroupProps as AriaCheckboxGroupProps,
	type CheckboxProps as AriaCheckboxProps,
	composeRenderProps,
	type ValidationResult as AriaValidationResult,
} from "react-aria-components";

import { Description, FieldError, Label } from "@/components/field";

export interface CheckboxGroupProps extends Omit<AriaCheckboxGroupProps, "children"> {
	label?: string;
	children?: ReactNode;
	description?: string;
	errorMessage?: string | ((validation: AriaValidationResult) => string);
}

export function CheckboxGroup(props: Readonly<CheckboxGroupProps>): ReactNode {
	const { children, className, description, errorMessage, label, ...rest } = props;

	return (
		<AriaCheckboxGroup
			{...rest}
			className={composeRenderProps(className, (className) => {
				return cn("flex flex-col gap-2 font-body", className);
			})}
		>
			<Label>{label}</Label>
			{children}
			{description != null ? <Description>{description}</Description> : null}
			<FieldError>{errorMessage}</FieldError>
		</AriaCheckboxGroup>
	);
}

export function Checkbox(props: Readonly<AriaCheckboxProps>): ReactNode {
	const { children, className, ...rest } = props;

	return (
		<AriaCheckbox
			{...rest}
			className={composeRenderProps(className, (className) => {
				return cn(
					"group relative flex items-center gap-2 font-body text-sm text-neutral-800 transition",
					"disabled:text-neutral-300 disabled:forced-colors:text-[GrayText]",
					className,
				);
			})}
		>
			{composeRenderProps(children, (children, renderProps) => {
				const { isSelected, isIndeterminate } = renderProps;

				return (
					<Fragment>
						<div
							className={cn(
								"flex size-4.5 shrink-0 items-center justify-center rounded-sm border transition",
								"border-(--color) bg-white [--color:var(--color-neutral-400)] group-pressed:[--color:var(--color-neutral-500)]",
								"group-selected:border-(--color) group-selected:bg-(--color) group-selected:[--color:var(--color-neutral-700)] group-selected:group-pressed:[--color:var(--color-neutral-800)] group-selected:forced-colors:[--color:Highlight]!",
								"group-indeterminate:border-(--color) group-indeterminate:bg-(--color) group-indeterminate:[--color:var(--color-neutral-700)] group-indeterminate:group-pressed:[--color:var(--color-neutral-800)] group-indeterminate:forced-colors:[--color:Highlight]!",
								"outline-0 outline-offset-2 outline-primary-600 group-focus-visible:outline-2 forced-colors:outline-[Highlight]",
								"group-invalid:[--color:var(--color-negative-700)] group-invalid:group-pressed:[--color:var(--color-negative-800)] group-invalid:forced-colors:[--color:Mark]!",
								"group-disabled:[--color:var(--color-neutral-200)] group-disabled:forced-colors:[--color:GrayText]!",
							)}
						>
							{isIndeterminate ? (
								<MinusIcon
									aria-hidden={true}
									className="size-3.5 text-white group-disabled:text-neutral-400 forced-colors:text-[HighlightText]"
								/>
							) : isSelected ? (
								<CheckIcon
									aria-hidden={true}
									className="size-3.5 text-white group-disabled:text-neutral-400 forced-colors:text-[HighlightText]"
								/>
							) : null}
						</div>
						{children}
					</Fragment>
				);
			})}
		</AriaCheckbox>
	);
}
