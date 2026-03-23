"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";

import { CountrySelect } from "@/components/pages/members-and-partners/country-select";
import { Select, SelectItem } from "@/components/ui/select/select";
import type { Country } from "@/types/map";

const SELECT_OPTIONS: Array<{
	value: string;
	name: "members" | "cooperating partners";
}> = [
	{ value: "members", name: "members" },
	{ value: "partners", name: "cooperating partners" },
];

interface CountriesPanelProps {
	members: Array<Country>;
	partners: Array<Country>;
	className: string;
}

export function CountriesPanel(props: Readonly<CountriesPanelProps>): ReactNode {
	const { members, partners, className } = props;
	const t = useTranslations("MembersAndPartnersPage");

	const [selectedType, setSelectedType] = useState(SELECT_OPTIONS[0]?.value);
	const [selectedCountriesArray, setSelectedCountriesArray] = useState(members);

	return (
		<div className={cn(className, "z-800 flex flex-col bg-white gap-4 h-full max-h-202 w-82")}>
			<div className="px-4 py-3">
				<Select
					onChange={(value) => {
						setSelectedType(value?.toString());
						setSelectedCountriesArray(value === "members" ? members : partners);
					}}
					value={selectedType}
				>
					{SELECT_OPTIONS.map((option) => {
						return (
							<SelectItem key={option.value} id={option.value} textValue={option.name}>
								{t(`filters.${option.name}`)}
							</SelectItem>
						);
					})}
				</Select>
			</div>
			<div className="pt-4 pb-20 px-6 flex flex-col gap-3 overflow-auto">
				{selectedCountriesArray.map((country) => {
					const href = `/network/members-and-partners/${country.code}`;
					return (
						<CountrySelect
							key={country.id}
							href={href}
							label={country.statusName}
							title={country.name}
						/>
					);
				})}
			</div>
		</div>
	);
}
