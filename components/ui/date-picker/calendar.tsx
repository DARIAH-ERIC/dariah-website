import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";
import {
	Calendar as AriaCalendar,
	CalendarCell as AriaCalendarCell,
	type CalendarCellProps,
	CalendarGrid as AriaCalendarGrid,
	CalendarGridBody,
	CalendarGridHeader as AriaCalendarGridHeader,
	type CalendarGridProps,
	CalendarHeaderCell,
	type CalendarProps as AriaCalendarProps,
	type DateValue,
	Heading,
} from "react-aria-components";

import { Button } from "@/components/ui/button/button";
import { ChevronForwardIcon } from "@/components/ui/icons/chevron-forward";
import { ChevronLeftIcon } from "@/components/ui/icons/chevron-left";

export interface CalendarProps<T extends DateValue> extends AriaCalendarProps<T> {
	errorMessage?: string;
}

export function Calendar<T extends DateValue>(props: Readonly<CalendarProps<T>>): ReactNode {
	return (
		<AriaCalendar
			className="flex flex-col w-[calc(9*var(--spacing)*7)] max-w-full font-body @container"
			{...props}
		>
			<header className="flex items-center justify-center gap-2 pb-4 px-1 box-border">
				<Button slot="previous" variant="icon-button">
					<ChevronLeftIcon />
				</Button>
				<Heading className="text-small text-text-link-bg font-semibold" />
				<Button slot="next" variant="icon-button">
					<ChevronForwardIcon />
				</Button>
			</header>
			<CalendarGrid className="border-spacing-0">
				<CalendarGridHeader />
				<CalendarGridBody>
					{(date) => {
						return <CalendarCell date={date} />;
					}}
				</CalendarGridBody>
			</CalendarGrid>
		</AriaCalendar>
	);
}

export function CalendarCell(props: Readonly<CalendarCellProps>): ReactNode {
	return (
		<AriaCalendarCell
			className={cn(
				"w-[calc(100cqw/7)] aspect-square text-small cursor-pointer rounded-full flex items-center justify-center text-black",
				"hover:bg-button-bg hover:[&_svg]:fill-primary",
				"focus:bg-button-bg focus:outline-3 focus:outline-primary focus:[&_svg]:fill-primary",
				"pressed:bg-transparent pressed:outline-none pressed:[&_svg]:fill-primary",
				"disabled:text-gray-400",
			)}
			{...props}
			data-variant="quiet"
		/>
	);
}

export function CalendarGrid(props: Readonly<CalendarGridProps>): ReactNode {
	return <AriaCalendarGrid {...props} />;
}

export function CalendarGridHeader(): ReactNode {
	return (
		<AriaCalendarGridHeader>
			{(day) => {
				return (
					<CalendarHeaderCell className="text-caption text-text-link-bg font-semibold">
						{day}
					</CalendarHeaderCell>
				);
			}}
		</AriaCalendarGridHeader>
	);
}
