"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import type { Key } from "react-aria";

import { Select, SelectItem } from "@/components/ui/select/select";

const AVAILABILITY_OPTIONS: Array<{
	value: string;
	name: "open" | "closed" | "upcoming";
}> = [
	{ value: "closed", name: "closed" },
	{ value: "open", name: "open" },
	{ value: "upcoming", name: "upcoming" },
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

	const handleSelectParamChange = (
		value: Key | null | undefined,
		param: "availability" | "source" | "search",
	) => {
		const params = new URLSearchParams(searchParams.toString());

		if (value !== null && value !== undefined && value !== "") params.set(param, value.toString());
		else params.delete(param);

		router.push(`${pathname}?${params.toString()}`, { scroll: false });
	};

	return (
		<div className="flex flex-col gap-6 lg:justify-between lg:flex-row lg:flex-wrap">
			<div className="flex flex-col gap-6 lg:flex-row">
				<Select
					className="max-w-full lg:w-82"
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
					className="max-w-full lg:w-82"
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
