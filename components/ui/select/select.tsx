"use client";

import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";
import {
	Button,
	Label,
	ListBox,
	ListBoxItem,
	type ListBoxItemProps,
	Select as AriaSelect,
	type SelectProps as AriaSelectProps,
	SelectValue,
	type ValidationResult,
} from "react-aria-components";

import { Popover } from "@/components/popover";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { ChevronUpIcon } from "@/components/ui/icons/chevron-up";

export interface SelectProps<T extends object> extends Omit<AriaSelectProps<T>, "children"> {
	label?: string;
	description?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
	items?: Iterable<T>;
	noOptionsText?: string;
	children?: React.ReactNode | ((item: T) => React.ReactNode);
}

export function Select<T extends object>(props: Readonly<SelectProps<T>>): ReactNode {
	const { label, noOptionsText = "No options found", isOpen, children, ...rest } = props;

	return (
		<AriaSelect className="flex flex-col gap-1" {...rest}>
			<Label className="text-regular font-semibold text-black">{label}</Label>
			<Button
				className={cn(
					"flex w-full h-14.75 items-center gap-2.5 px-3.25 pt-4.5 pb-4 text-regular text-black placeholder-gray-700 text-[16px]",
					"border-b-2 border-gray-200 border-b-gray-400 bg-gray-200",
					"hover:border-b-primary hover:bg-gray-200",
					"focus:px-2.75 focus:pt-4 focus:outline-none focus:border-2 focus:border-primary hover:focus:border-primary",
				)}
			>
				<SelectValue className="bg-transparent text-regular w-full items-center flex gap-2 focus:outline-none">
					{({ selectedText, defaultChildren }) => {
						return defaultChildren ?? selectedText;
					}}
				</SelectValue>

				{isOpen === true ? (
					<ChevronUpIcon className="text-primary" />
				) : (
					<ChevronDownIcon className="text-primary" />
				)}
			</Button>
			<Popover className="min-w-(--trigger-width) overflow-auto p-2 outline-none!">
				<ListBox
					className="outline-none"
					renderEmptyState={() => {
						return <div className="p-2">{noOptionsText}</div>;
					}}
				>
					{children}
				</ListBox>
			</Popover>
		</AriaSelect>
	);
}

export function SelectItem(props: Readonly<ListBoxItemProps>): ReactNode {
	const { textValue } = props;

	return (
		<ListBoxItem
			className={cn(
				"px-5 h-9 leading-9 flex gap-2 items-center cursor-pointer text-regular text-text-link-bg bg-transparent font-normal rounded-none",
				"hover:bg-button-bg hover:text-text-link-bg",
				"data-focused:bg-button-bg data-focused:text-text-link-bg data-focused:outline-3 data-focused:outline-primary",
				"pressed:text-primary pressed:bg-transparent pressed:outline-none",
				"selected:text-primary selected:bg-transparent selected:outline-none selected:[&_svg]:fill-primary",
			)}
			{...props}
			textValue={textValue}
		/>
	);
}
