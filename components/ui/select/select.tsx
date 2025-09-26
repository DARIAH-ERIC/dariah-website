"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { type ForwardedRef, forwardRef, type ReactNode, useState } from "react";
import {
	Button,
	ComboBox,
	type ComboBoxProps as AriaComboBoxProps,
	Input,
	Label,
	ListBox,
	ListBoxItem,
	Popover,
} from "react-aria-components";

import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { ChevronUpIcon } from "@/components/ui/icons/chevron-up";

type SelectProps<T extends object> = AriaComboBoxProps<T> & {
	label: string;
	noOptionsText?: string;
	isLoading?: boolean;
	loadingText?: string;
	menuTrigger?: "focus" | "input" | "manual";
};

export const Select = forwardRef(function Select<T extends object>(
	props: Readonly<SelectProps<T>>,
	forwardedRef: ForwardedRef<HTMLInputElement>,
): ReactNode {
	const {
		label,
		menuTrigger = "focus",
		onOpenChange,
		noOptionsText = "No options found",
		allowsEmptyCollection,
		...rest
	} = props;

	const [open, setOpen] = useState(false);

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		onOpenChange?.(isOpen);
	};

	return (
		<ComboBox
			ref={forwardedRef}
			allowsEmptyCollection={allowsEmptyCollection ?? true}
			className="flex flex-col gap-1"
			menuTrigger={menuTrigger}
			onOpenChange={handleOpenChange}
			{...rest}
		>
			<Label className="text-medium text-black">{label}</Label>
			<div
				className={cn(
					"flex items-center rounded-1 border border-gray-300 bg-gray-100 px-2.5 py-2 text-regular text-black placeholder-gray-700",
					"hover:border-gray-400 hover:bg-gray-200",
					"focus-within:border-accent-600 focus-within:bg-gray-200 hover:focus-within:border-accent-600",
				)}
			>
				<Input className="bg-transparent text-regular focus:outline-none" />
				<Button className="text-primary-500">
					{open ? <ChevronUpIcon /> : <ChevronDownIcon />}
				</Button>
			</div>
			<Popover className="-ml-2.5 box-content w-[--trigger-width] bg-white px-2.5 text-regular text-black">
				<ListBox
					renderEmptyState={() => {
						return <div className="p-2">{noOptionsText}</div>;
					}}
				>
					{(item) => {
						return <ListBoxItem className="p-2">{Object.values(item)[1]}</ListBoxItem>;
					}}
				</ListBox>
			</Popover>
		</ComboBox>
	);
});
