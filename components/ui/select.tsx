"use client";

import cn from "clsx/lite";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { Fragment, type ReactNode, useRef, useState } from "react";
import { Button } from "react-aria-components/Button";
import { Label } from "react-aria-components/Label";
import { ListBox, ListBoxItem } from "react-aria-components/ListBox";
import { Popover } from "react-aria-components/Popover";
import { Select as AriaSelect, SelectValue } from "react-aria-components/Select";
import { flushSync } from "react-dom";

export interface SelectOption<T extends string> {
	id: T;
	label: string;
}

interface SelectBaseProps<T extends string> {
	label: string;
	options: ReadonlyArray<SelectOption<T>>;
	/**
	 * `field`: a form field, with its label above it, styled like the text fields. `card`: the label is visually hidden,
	 * and the selected option, set in medium weight, reads as the control's heading.
	 */
	variant?: "card" | "field";
	/** Shown at the trigger's start, e.g. the selected option's icon. */
	icon?: ReactNode;
	className?: string;
}

interface ControlledSelectProps<T extends string> extends SelectBaseProps<T> {
	value: T;
	onChange: (value: T) => void;
	name?: never;
	defaultValue?: never;
}

interface FormSelectProps<T extends string> extends SelectBaseProps<T> {
	/** The form field's name: the value is submitted with the enclosing form. */
	name: string;
	defaultValue: T;
	value?: never;
	onChange?: never;
}

type SelectProps<T extends string> = ControlledSelectProps<T> | FormSelectProps<T>;

/**
 * A single-choice dropdown. The open list's border, shadow and item highlight match the header's navigation menu (see
 * `NavigationMenuContent`).
 *
 * It is a react-aria select rather than a native `select`, so the open list can be styled to the design - a native list
 * is drawn by the operating system. React-aria gives it the listbox semantics and keyboard interaction of a native one:
 * arrow keys, type-ahead, Escape to close.
 *
 * With a `name`, it is a form field: a hidden native `select` holds the value, and fires a bubbling `change` event on
 * each choice, so a form listening for changes - e.g. `SearchForm`, which submits on every change - sees it like any
 * other field's. Without javascript the value cannot be changed, only submitted.
 */
export function Select<T extends string>(props: Readonly<SelectProps<T>>): ReactNode {
	const { label, options, variant = "card", icon, className, name } = props;

	const [uncontrolledValue, setUncontrolledValue] = useState(props.defaultValue);
	const value = props.value ?? uncontrolledValue;

	/**
	 * A new `defaultValue` replaces the chosen one: a form field's default is read from the url, which a link can change
	 * while the field stays mounted, e.g. one which clears a filter. A choice of the user's own comes back as the same
	 * value, once the form's submission has rendered, so it is kept.
	 */
	const [previousDefaultValue, setPreviousDefaultValue] = useState(props.defaultValue);
	if (props.defaultValue !== previousDefaultValue) {
		setPreviousDefaultValue(props.defaultValue);
		setUncontrolledValue(props.defaultValue);
	}
	const hiddenSelectRef = useRef<HTMLSelectElement>(null);

	function onChange(value: T) {
		if (props.onChange != null) {
			props.onChange(value);
			return;
		}

		/** Commits the new value to the hidden select first, so the form reads it when handling the event. */
		flushSync(() => {
			setUncontrolledValue(value);
		});
		hiddenSelectRef.current?.dispatchEvent(new Event("change", { bubbles: true }));
	}

	return (
		<AriaSelect
			className={cn(variant === "field" && "flex flex-col gap-y-2", className)}
			onChange={(key) => {
				if (key != null) {
					onChange(key as T);
				}
			}}
			value={value}
		>
			<Label className={variant === "field" ? "font-bold" : "sr-only"}>{label}</Label>
			<Button
				className={cn(
					"group flex items-center gap-x-3 text-start focus-visible-outline [--focus-outline-offset:-3px] inline-full",
					variant === "field"
						? "border-be-2 border-stroke-weak bg-background-field px-4 py-2.5 shadow-[0_0_4px_0_rgb(0_0_0/0.08)] min-block-15 hover:border-stroke-accent"
						: "bg-background-base py-3 ps-4 pe-3 font-medium shadow-card-edge",
				)}
			>
				{icon}
				<SelectValue className="min-inline-0 flex-1 truncate" />
				<ChevronDownIcon
					strokeWidth={2.5}
					aria-hidden={true}
					className="size-5 shrink-0 text-icon-accent transition-transform group-aria-expanded:rotate-180 motion-reduce:transition-none"
				/>
			</Button>
			<Popover
				className="min-inline-(--trigger-width) border border-stroke-weak bg-background-base shadow-lg"
				offset={4}
			>
				<ListBox className="max-block-[inherit] overflow-y-auto py-2 outline-none">
					{options.map((option) => (
						<ListBoxItem
							key={option.id}
							className="flex cursor-default items-center justify-between gap-x-4 px-4 py-2.5 font-heading outline-none selected:text-text-accent hover:bg-background-accent focus:bg-background-accent"
							id={option.id}
							textValue={option.label}
						>
							{({ isSelected }) => (
								<Fragment>
									{option.label}
									{isSelected ? <CheckIcon aria-hidden={true} className="size-4 shrink-0" strokeWidth={2.5} /> : null}
								</Fragment>
							)}
						</ListBoxItem>
					))}
				</ListBox>
			</Popover>
			{name != null ? (
				<select
					ref={hiddenSelectRef}
					aria-hidden={true}
					hidden={true}
					name={name}
					onChange={() => {
						/** Set through the listbox only; the handler just marks the value as controlled. */
					}}
					tabIndex={-1}
					value={value}
				>
					{options.map((option) => (
						<option key={option.id} value={option.id}>
							{option.label}
						</option>
					))}
				</select>
			) : null}
		</AriaSelect>
	);
}
