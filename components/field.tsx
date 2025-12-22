"use client";

import cn from "clsx/lite";
import type { ReactNode } from "react";
import {
	composeRenderProps,
	FieldError as AriaFieldError,
	type FieldErrorProps as AriaFieldErrorProps,
	Group as AriaGroup,
	type GroupProps as AriaGroupProps,
	Input as AriaInput,
	type InputProps as AriaInputProps,
	Label as AriaLabel,
	type LabelProps as AriaLabelProps,
	Text as AriaText,
	type TextProps as AriaTextProps,
} from "react-aria-components";

interface LabelProps extends AriaLabelProps {}

export function Label(props: Readonly<LabelProps>): ReactNode {
	const { className, ...rest } = props;

	return (
		<AriaLabel
			{...rest}
			className={cn(
				"w-fit cursor-default font-body text-sm font-medium text-neutral-600",
				className,
			)}
		/>
	);
}

interface DescriptionProps extends Omit<AriaTextProps, "slot"> {}

export function Description(props: Readonly<DescriptionProps>): ReactNode {
	const { className, ...rest } = props;

	return (
		<AriaText {...rest} className={cn("text-sm text-neutral-600", className)} slot="description" />
	);
}
interface FieldErrorProps extends AriaFieldErrorProps {}

export function FieldError(props: Readonly<FieldErrorProps>): ReactNode {
	const { className, ...rest } = props;

	return (
		<AriaFieldError
			{...rest}
			className={composeRenderProps(className, (className) => {
				return cn("text-sm text-negative-600 forced-colors:text-[Mark]", className);
			})}
		/>
	);
}

export const fieldBorderStyles = cn(
	"transition",
	"border-neutral-300 hover:border-neutral-400 forced-colors:border-[ButtonBorder]",
	"focus-within:border-neutral-600 focus-within:forced-colors:border-[Highlight]",
	"invalid:border-negative-600 invalid:forced-colors:border-[Mark]",
	"disabled:border-neutral-200 disabled:forced-colors:border-[GrayText]",
);

export const fieldGroupStyles = cn(
	"group box-border flex h-9 items-center overflow-hidden rounded-lg border bg-white transition forced-colors:bg-[Field]",
	"outline-0 outline-offset-2 outline-blue-600 focus-visible:outline-2 dark:outline-blue-500 forced-colors:outline-[Highlight]",
	"border-neutral-300 hover:border-neutral-400 forced-colors:border-[ButtonBorder]",
	"focus-within:border-neutral-600 focus-within:forced-colors:border-[Highlight]",
	"invalid:border-negative-600 invalid:forced-colors:border-[Mark]",
	"disabled:border-neutral-200 disabled:forced-colors:border-[GrayText]",
);

interface FieldGroupProps extends AriaGroupProps {}

export function FieldGroup(props: Readonly<FieldGroupProps>): ReactNode {
	const { className, ...rest } = props;

	return (
		<AriaGroup
			{...rest}
			className={composeRenderProps(className, (className) => {
				return cn(fieldGroupStyles, className);
			})}
		/>
	);
}

interface InputProps extends AriaInputProps {}

export function Input(props: Readonly<InputProps>): ReactNode {
	const { className, ...rest } = props;

	return (
		<AriaInput
			{...rest}
			className={composeRenderProps(className, (className) => {
				return cn(
					"min-h-9 min-w-0 flex-1 border-0 bg-white px-3 py-0 font-body text-sm text-neutral-800 outline-0 placeholder:text-neutral-600 disabled:text-neutral-200 disabled:placeholder:text-neutral-200",
					className,
				);
			})}
		/>
	);
}
