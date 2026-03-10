"use client";

import React, { type ReactNode } from "react";
import {
	DatePicker as AriaDatePicker,
	type DatePickerProps as AriaDatePickerProps,
	type DateValue,
	FieldError,
	Label,
	type ValidationResult,
} from "react-aria-components";

import { Popover } from "@/components/popover";
import { DateInput } from "@/components/ui/date-input/date-input";
import { Calendar } from "@/components/ui/date-picker/calendar";

export interface DatePickerProps<T extends DateValue> extends AriaDatePickerProps<T> {
	label?: string;
	errorMessage?: string | ((validation: ValidationResult) => string);
}

export function DatePicker<T extends DateValue>(props: Readonly<DatePickerProps<T>>): ReactNode {
	const { label, errorMessage, ...rest } = props;

	return (
		<AriaDatePicker className="group flex flex-col gap-1" {...rest}>
			{label !== undefined && (
				<Label className="text-regular font-semibold text-black">{label}</Label>
			)}
			<DateInput />
			<FieldError>{errorMessage}</FieldError>
			<Popover className="p-2" placement="bottom">
				<Calendar />
			</Popover>
		</AriaDatePicker>
	);
}
