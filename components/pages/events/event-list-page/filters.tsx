"use client";

import {
	type CalendarDate,
	type CalendarDateTime,
	type DateValue,
	parseDate,
	type ZonedDateTime,
} from "@internationalized/date";
import { redirect, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { type ReactNode, useState } from "react";
import type { Key } from "react-aria";

import { Button } from "@/components/ui/button/button";
import { DatePicker } from "@/components/ui/date-picker/date-picker";
import { CalendarIcon } from "@/components/ui/icons/calendar";
import { ListIcon } from "@/components/ui/icons/list";
import { Select, SelectItem } from "@/components/ui/select/select";
import { formatDateToIso } from "@/utils/event-page.utils";

const VIEW_OPTIONS: Array<{
	value: string;
	name: "list" | "calendar";
	icon: React.JSX.Element;
}> = [
	{ value: "list", name: "list", icon: <ListIcon className="size-5 fill-black" /> },
	{ value: "calendar", name: "calendar", icon: <CalendarIcon className="size-5 fill-black" /> },
];

interface FiltersProps {
	currentView: "list" | "calendar";
}

export function Filters(props: Readonly<FiltersProps>): ReactNode {
	const { currentView } = props;
	const t = useTranslations("EventsPage");
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const currentDate = formatDateToIso(new Date());

	const [date, setDate] = useState<DateValue>((): DateValue => {
		return parseDate(searchParams.get("date") ?? currentDate);
	});

	const handleSelectedViewChange = (value: Key | null) => {
		if (value !== null && value !== "list") redirect(`/events/calendar`);
		else redirect(`/events/`);
	};

	const handleDateChange = (value: CalendarDate | CalendarDateTime | ZonedDateTime | null) => {
		setDate(parseDate(value?.toString() ?? currentDate));
	};

	const handleEventCriteriaChange = () => {
		const params = new URLSearchParams(searchParams.toString());

		if (date.toString() !== currentDate) params.set("date", date.toString());
		else params.delete("date");

		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	};

	return (
		<div className="flex flex-col flex-wrap items-start gap-y-10 gap-x-20 w-full md:items-end md:flex-row">
			<div className="flex flex-wrap flex-1 items-end gap-y-6 gap-x-4">
				<DatePicker label={t("filters.date")} onChange={handleDateChange} value={date} />
				<Button onClick={handleEventCriteriaChange} variant="secondary-blue">
					{t("filters.confirm")}
				</Button>
			</div>
			<Select
				className="w-48 max-w-full"
				label={t("filters.select")}
				onChange={handleSelectedViewChange}
				value={currentView}
			>
				{VIEW_OPTIONS.map((option) => {
					return (
						<SelectItem key={option.value} id={option.value} textValue={option.name}>
							{option.icon} {t(`filters.${option.name}`)}
						</SelectItem>
					);
				})}
			</Select>
		</div>
	);
}
