"use client";

import cn from "clsx/lite";
import { CheckIcon } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import {
	Collection as AriaCollection,
	composeRenderProps,
	Header as AriaHeader,
	ListBox as AriaListBox,
	ListBoxItem as AriaListBoxItem,
	type ListBoxItemProps as AriaListBoxItemProps,
	type ListBoxProps as AriaListBoxProps,
	ListBoxSection as AriaListBoxSection,
	type SectionProps as AriaSectionProps,
} from "react-aria-components";

interface ListBoxProps<T extends object> extends Omit<
	AriaListBoxProps<T>,
	"layout" | "orientation"
> {}

export function ListBox<T extends object>(props: Readonly<ListBoxProps<T>>): ReactNode {
	const { children, className, ...rest } = props;

	return (
		<AriaListBox
			{...rest}
			className={composeRenderProps(className, (className) => {
				return cn(
					"w-50 rounded-lg border border-neutral-300 bg-white p-1 font-body outline-0",
					className,
				);
			})}
		>
			{children}
		</AriaListBox>
	);
}

interface ListBoxItemProps<T extends object> extends AriaListBoxItemProps<T> {}

export function ListBoxItem<T extends object>(props: Readonly<ListBoxItemProps<T>>): ReactNode {
	const { children, className, textValue, ...rest } = props;

	return (
		<AriaListBoxItem
			{...rest}
			className={cn(
				"group relative flex cursor-default items-center gap-8 rounded-md px-2.5 py-1.5 text-sm will-change-transform forced-color-adjust-none select-none",
				"outline-0 outline-offset-2 outline-primary-600 focus-visible:outline-2 forced-colors:outline-[Highlight]",
				"disabled:text-neutral-300 disabled:forced-colors:text-[GrayText]",
				"text-neutral-700 -outline-offset-2 hover:bg-neutral-100 pressed:bg-neutral-100",
				"forced-colors:outline-[HighlightText] selected:bg-primary-600 selected:text-white selected:-outline-offset-4 selected:outline-white selected:forced-colors:bg-[Highlight] selected:forced-colors:text-[HighlightText] selected:[&+[data-selected]]:rounded-t-none selected:[&:has(+[data-selected])]:rounded-b-none",
				className,
			)}
			textValue={textValue ?? (typeof children === "string" ? children : undefined)}
		>
			{composeRenderProps(children, (children) => {
				return (
					<Fragment>
						{children}
						<div className="absolute right-4 bottom-0 left-4 hidden h-px bg-white/20 forced-colors:bg-[HighlightText] [.group[data-selected]:has(+[data-selected])_&]:block" />
					</Fragment>
				);
			})}
		</AriaListBoxItem>
	);
}

interface DropdownItemProps<T extends object> extends AriaListBoxItemProps<T> {}

export function DropdownItem<T extends object>(props: Readonly<DropdownItemProps<T>>): ReactNode {
	const { children, className, textValue, ...rest } = props;

	return (
		<AriaListBoxItem
			{...rest}
			className={cn(
				"group flex cursor-default items-center gap-4 rounded-lg px-3 py-2 text-sm text-neutral-900 no-underline outline-0 forced-color-adjust-none select-none selected:pr-1 [[href]]:cursor-pointer",
				"pressed:bg-neutral-100",
				"focus:bg-primary-600 focus:text-white focus:forced-colors:bg-[Highlight] focus:forced-colors:text-[HighlightText]",
				"disabled:text-neutral-300 disabled:forced-colors:text-[GrayText]",
				"focus:open:bg-neutral-100",
				className,
			)}
			textValue={textValue ?? (typeof children === "string" ? children : undefined)}
		>
			{composeRenderProps(children, (children, { isSelected }) => {
				return (
					<Fragment>
						<span className="flex flex-1 items-center gap-2 truncate font-normal group-selected:font-semibold">
							{children}
						</span>
						<span className="flex w-5 items-center">
							{isSelected ? <CheckIcon className="size-4" /> : null}
						</span>
					</Fragment>
				);
			})}
		</AriaListBoxItem>
	);
}

interface DropdownSectionProps<T extends object> extends AriaSectionProps<T> {
	title?: string;
	items?: Array<T>;
}

export function DropdownSection<T extends object>(
	props: Readonly<DropdownSectionProps<T>>,
): ReactNode {
	const { children, items, title, ...rest } = props;

	return (
		<AriaListBoxSection
			{...rest}
			className="after:block after:h-1.25 first:-mt-1.25 last:after:hidden"
		>
			<AriaHeader className="sticky -top-1.25 z-10 -mx-1 -mt-px truncate border-y border-y-neutral-200 bg-neutral-100/60 px-4 py-1 text-sm font-semibold text-neutral-500 backdrop-blur-md supports-[-moz-appearance:none]:bg-neutral-100 [&+*]:mt-1">
				{title}
			</AriaHeader>
			<AriaCollection items={items}>{children}</AriaCollection>
		</AriaListBoxSection>
	);
}
