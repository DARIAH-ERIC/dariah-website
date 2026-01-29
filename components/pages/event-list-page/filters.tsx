"use client";

import {
	type CalendarDate,
	type CalendarDateTime,
	type DateValue,
	parseDate,
	type ZonedDateTime,
} from "@internationalized/date";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { type ReactNode, useState } from "react";
import type { Key } from "react-aria";

import { Button } from "@/components/ui/button/button";
import { DatePicker } from "@/components/ui/date-picker/date-picker";
import { CalendarIcon } from "@/components/ui/icons/calendar";
import { ListIcon } from "@/components/ui/icons/list";
import { SearchIcon } from "@/components/ui/icons/search";
import { Select, SelectItem } from "@/components/ui/select/select";
import { TextField } from "@/components/ui/text-field/text-field";
import { formatDateToIso } from "@/utils/event-page.utils";

const VIEW_OPTIONS: Array<{
	value: string;
	name: "list" | "calendar";
	icon: React.JSX.Element;
}> = [
	{ value: "list", name: "list", icon: <ListIcon className="size-5 fill-black" /> },
	{ value: "calendar", name: "calendar", icon: <CalendarIcon className="size-5 fill-black" /> },
];

export function Filters(): ReactNode {
	const t = useTranslations("EventsPage");
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const currentDate = formatDateToIso(new Date());
	const selectedView = searchParams.get("view") ?? "list";

	const [date, setDate] = useState<DateValue>((): DateValue => {
		return parseDate(searchParams.get("date") ?? currentDate);
	});
	const [searchString, setSearchString] = useState<string | undefined>(
		searchParams.get("search") ?? undefined,
	);

	const handleSelectedViewChange = (value: Key | null) => {
		const params = new URLSearchParams(searchParams.toString());

		if (value !== null && value !== "list") params.set("view", value.toString());
		else params.delete("view");

		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	};

	const handleSearchStringChange = (value: string) => {
		if (value === "") setSearchString(undefined);
		else setSearchString(value);
	};

	const handleDateChange = (value: CalendarDate | CalendarDateTime | ZonedDateTime | null) => {
		setDate(parseDate(value?.toString() ?? currentDate));
	};

	const handleEventCriteriaChange = () => {
		const params = new URLSearchParams(searchParams.toString());

		if (date.toString() !== currentDate) params.set("date", date.toString());
		else params.delete("date");

		if (searchString !== undefined) params.set("search", searchString);
		else params.delete("search");

		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	};

	return (
		<div className="flex gap-20 items-end">
			<div className="flex gap-4 flex-1 items-end">
				<DatePicker label={t("filters.date")} onChange={handleDateChange} value={date} />
				<div className="flex flex-1 gap-0.5">
					<TextField
						className="flex-1"
						onChange={handleSearchStringChange}
						placeholder={t("filters.search")}
						startIcon={<SearchIcon className="text-black size-6" />}
						value={searchString}
					/>
					<Button onClick={handleEventCriteriaChange} variant="secondary-blue">
						{t("filters.confirm")}
					</Button>
				</div>
			</div>
			<Select
				className="w-48 max-w-full"
				label={t("filters.select")}
				onChange={handleSelectedViewChange}
				value={selectedView}
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
