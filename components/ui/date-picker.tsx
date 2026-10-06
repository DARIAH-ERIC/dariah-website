"use client";

import { parseDate } from "@internationalized/date";
import cn from "clsx/lite";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "react-aria-components/Button";
import {
	Calendar,
	CalendarCell,
	CalendarGrid,
	CalendarGridBody,
	CalendarGridHeader,
	CalendarHeaderCell,
} from "react-aria-components/Calendar";
import { DateInput, DateSegment } from "react-aria-components/DateField";
import { DatePicker as AriaDatePicker } from "react-aria-components/DatePicker";
import { Dialog } from "react-aria-components/Dialog";
import { Group } from "react-aria-components/Group";
import { Heading } from "react-aria-components/Heading";
import { Label } from "react-aria-components/Label";
import { Popover } from "react-aria-components/Popover";

interface DatePickerProps {
	label: string;
	/** The form field's name: the date is submitted with the enclosing form, as `YYYY-MM-DD`. */
	name: string;
	/** `YYYY-MM-DD`. */
	defaultValue: string;
	className?: string;
}

/**
 * A date field, with its label above it, styled like the text fields. The date is typed segment by segment, in the
 * locale's order, or picked from a calendar the button at its end opens. The open calendar's border and shadow match
 * `Select`'s list.
 *
 * It is a react-aria date picker rather than a native `input type="date"`, so the calendar can be styled to the design
 * and reads the same in every browser. A hidden input holds the value for the form. Without javascript the date cannot
 * be changed, only submitted.
 */
export function DatePicker(props: Readonly<DatePickerProps>): ReactNode {
	const { label, name, defaultValue, className } = props;

	return (
		<AriaDatePicker
			className={cn("flex flex-col gap-y-2", className)}
			defaultValue={parseDate(defaultValue)}
			name={name}
		>
			<Label className="font-bold">{label}</Label>
			<Group className="flex items-center border-be-2 border-stroke-weak bg-background-field ps-4 shadow-[0_0_4px_0_rgb(0_0_0/0.08)] min-block-15 hover:border-stroke-accent focus-within:outline-3 focus-within:-outline-offset-3 focus-within:outline-focus-outline focus-within:outline-solid">
				<DateInput className="flex flex-1 py-2.5 tabular-nums">
					{(segment) => (
						<DateSegment
							className="px-0.5 outline-none data-placeholder:text-text-weak focus:bg-background-accent-strong focus:text-text-inverse"
							segment={segment}
						/>
					)}
				</DateInput>
				<Button className="flex items-center self-stretch px-4 text-icon-accent outline-none hover:text-text-strong">
					<CalendarIcon aria-hidden={true} className="size-5" />
				</Button>
			</Group>
			<Popover className="border border-stroke-weak bg-background-base shadow-lg" offset={4} placement="bottom start">
				<Dialog className="p-4 outline-none">
					<Calendar>
						<header className="flex items-center justify-between gap-x-4 pbe-4">
							<Button
								className="flex size-9 items-center justify-center text-icon-accent hover:bg-background-accent focus-visible-outline"
								slot="previous"
							>
								<ChevronLeftIcon aria-hidden={true} className="size-4" strokeWidth={2.5} />
							</Button>
							<Heading className="font-heading font-bold" />
							<Button
								className="flex size-9 items-center justify-center text-icon-accent hover:bg-background-accent focus-visible-outline"
								slot="next"
							>
								<ChevronRightIcon aria-hidden={true} className="size-4" strokeWidth={2.5} />
							</Button>
						</header>
						<CalendarGrid className="border-collapse">
							<CalendarGridHeader>
								{(day) => (
									<CalendarHeaderCell className="pbe-2 text-small font-bold text-text-weak uppercase">
										{day}
									</CalendarHeaderCell>
								)}
							</CalendarGridHeader>
							<CalendarGridBody>
								{(date) => (
									<CalendarCell
										className="flex size-10 cursor-default items-center justify-center tabular-nums outline-none outside-month:text-text-weak selected:bg-background-accent-strong selected:font-bold selected:text-text-inverse hover:bg-background-accent selected:hover:bg-background-accent-strong focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-focus-outline focus-visible:outline-solid"
										date={date}
									/>
								)}
							</CalendarGridBody>
						</CalendarGrid>
					</Calendar>
				</Dialog>
			</Popover>
		</AriaDatePicker>
	);
}
