"use client";

import { cn } from "@acdh-oeaw/style-variants";
import type { ReactNode } from "react";
import {
	Button,
	DateInput as AriaDateInput,
	type DateInputProps,
	DateSegment,
	Group as AriaGroup,
} from "react-aria-components";

import { CalendarIcon } from "@/components/ui/icons/calendar";

export function DateInput(props: Readonly<Omit<DateInputProps, "children">>): ReactNode {
	return (
		<AriaGroup
			className={cn(
				"flex items-center gap-2.5 px-3.25 pt-4.5 pb-4 h-14.75",
				"border-b-2 border-gray-200 border-b-gray-400 bg-gray-200",
				"hover:border-b-primary hover:bg-gray-200",
				"focus-within:px-2.75 focus-within:pt-4 focus-within:border-2 focus-within:border-primary hover:focus-within:border-primary",
			)}
		>
			<AriaDateInput className="bg-transparent w-full focus:outline-none" {...props}>
				{(segment) => {
					if (segment.type === "literal") segment.text = "-";

					return (
						<DateSegment
							aria-hidden={true}
							className="text-regular text-black text-[16px] placeholder-gray-700 focus:outline-primary"
							segment={segment}
						/>
					);
				}}
			</AriaDateInput>
			<Button>
				<CalendarIcon className="fill-primary size-5 cursor-pointer" />
			</Button>
		</AriaGroup>
	);
}
