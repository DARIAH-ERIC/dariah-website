"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { type KeyboardEvent, type ReactNode, useState } from "react";
import type { Key } from "react-aria";

import { Button } from "@/components/ui/button/button";
import { SearchIcon } from "@/components/ui/icons/search";
import { Select, SelectItem } from "@/components/ui/select/select";
import { TextField } from "@/components/ui/text-field/text-field";

const AVAILABILITY_OPTIONS: Array<{
	value: string;
	name: "open" | "closed";
}> = [
	{ value: "open", name: "open" },
	{ value: "closed", name: "closed" },
];

const SOURCE_OPTIONS: Array<{
	value: string;
	name: "dariah" | "external";
}> = [
	{ value: "dariah", name: "dariah" },
	{ value: "external", name: "external" },
];

export function Filters(): ReactNode {
	const t = useTranslations("Opportunities");
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const selectedAvailability = searchParams.get("availability") ?? null;
	const selectedSource = searchParams.get("source") ?? null;

	const [searchString, setSearchString] = useState<string | undefined>(
		searchParams.get("search") ?? undefined,
	);

	const handleSelectParamChange = (
		value: Key | null | undefined,
		param: "availability" | "source" | "search",
	) => {
		const params = new URLSearchParams(searchParams.toString());

		if (value !== null && value !== undefined && value !== "") params.set(param, value.toString());
		else params.delete(param);

		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	};

	const handleSearchStringChange = (value: string) => {
		if (value === "") setSearchString(undefined);
		else setSearchString(value);
	};

	const handleKeyDownOnKeywords = (e: KeyboardEvent) => {
		if (e.code === "Enter") {
			handleSelectParamChange(searchString, "search");
			return;
		}
	};

	return (
		<div className="flex flex-col gap-6 lg:justify-between lg:flex-row lg:flex-wrap">
			<div className="flex gap-0.5 flex-wrap flex-col md:items-end md:flex-row lg:w-140 xl:w-200">
				<TextField
					className="flex-1 min-w-59.5 max-w-full"
					onChange={handleSearchStringChange}
					onKeyDown={handleKeyDownOnKeywords}
					placeholder={t("filters.search")}
					startIcon={<SearchIcon className="text-black size-6" />}
					value={searchString}
				/>
				<Button
					onClick={() => {
						handleSelectParamChange(searchString, "search");
					}}
					variant="secondary-blue"
				>
					{t("filters.confirm")}
				</Button>
			</div>
			<div className="flex flex-col gap-6 lg:flex-row">
				<Select
					className="max-w-full lg:w-48"
					label={t("filters.availability.select")}
					onChange={(value) => {
						handleSelectParamChange(value, "availability");
					}}
					placeholder={t("filters.availability.placeholder")}
					value={selectedAvailability}
				>
					<SelectItem id={""}>{t("filters.availability.placeholder")}</SelectItem>
					{AVAILABILITY_OPTIONS.map((option) => {
						return (
							<SelectItem key={option.value} id={option.value} textValue={option.name}>
								{t(`filters.availability.${option.name}`)}
							</SelectItem>
						);
					})}
				</Select>
				<Select
					className="max-w-full lg:w-48"
					label={t("filters.source.select")}
					onChange={(value) => {
						handleSelectParamChange(value, "source");
					}}
					placeholder={t("filters.source.placeholder")}
					value={selectedSource}
				>
					<SelectItem id={""} textValue="">
						{t("filters.source.placeholder")}
					</SelectItem>
					{SOURCE_OPTIONS.map((option) => {
						return (
							<SelectItem key={option.value} id={option.value} textValue={option.name}>
								{t(`filters.source.${option.name}`)}
							</SelectItem>
						);
					})}
				</Select>
			</div>
		</div>
	);
}
