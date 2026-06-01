"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";

import { CountrySelect } from "@/components/pages/members-and-partners/country-select";
import { Select, SelectItem } from "@/components/ui/select/select";
import { Typography } from "@/components/ui/typography/typography";
import type { MemberOrPartnerList } from "@/lib/data/api-client";

const SELECT_OPTIONS: Array<{
	value: string;
	name: "members" | "cooperating partners" | "observers";
}> = [
	{ value: "members", name: "members" },
	{ value: "partners", name: "cooperating partners" },
	{ value: "observers", name: "observers" },
];

const EMPTY_STATE_KEYS: Record<
	string,
	"membersEmptyState" | "cooperatingEmptyState" | "observersEmptyState"
> = {
	members: "membersEmptyState",
	"cooperating partners": "cooperatingEmptyState",
	observers: "observersEmptyState",
};

interface CountriesPanelProps {
	members: MemberOrPartnerList["data"];
	partners: MemberOrPartnerList["data"];
	observers: MemberOrPartnerList["data"];
	className: string;
}

export function CountriesPanel(props: Readonly<CountriesPanelProps>): ReactNode {
	const { members, partners, observers, className } = props;
	const t = useTranslations("MembersAndPartnersPage");

	const [selectedType, setSelectedType] = useState(SELECT_OPTIONS[0]?.value);
	const [selectedCountriesArray, setSelectedCountriesArray] = useState(members);

	const handleSelectedCountriesTypeChange = (value: string) => {
		setSelectedType(value);
		switch (value) {
			case "partners": {
				setSelectedCountriesArray(partners);

				break;
			}
			case "observers": {
				setSelectedCountriesArray(observers);

				break;
			}
			default: {
				setSelectedCountriesArray(members);

				break;
			}
		}
	};

	return (
		<div className={cn(className, "z-800 flex flex-col bg-white gap-4 h-full max-h-202 w-82")}>
			<div className="px-4 py-3">
				<Select
					onChange={(value) => {
						handleSelectedCountriesTypeChange(value?.toString() ?? "members");
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
				{selectedCountriesArray.length > 0 ? (
					selectedCountriesArray.map((country) => {
						const href = `/network/members-and-partners/${country.entity.slug}`;
						return (
							<CountrySelect
								key={country.id}
								href={href}
								label={country.status}
								title={country.name}
							/>
						);
					})
				) : (
					<Typography variant="regular">
						{t(EMPTY_STATE_KEYS[selectedType!] ?? "mapEmptyState")}
					</Typography>
				)}
			</div>
		</div>
	);
}
