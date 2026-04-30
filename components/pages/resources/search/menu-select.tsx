import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useMenu, type UseMenuProps } from "react-instantsearch";

import { Select, SelectItem } from "@/components/ui/select/select";

interface SELECT_OPTION {
	label:
		| "country"
		| "document-or-policy"
		| "event"
		| "funding-call"
		| "impact-case-study"
		| "institution"
		| "national-consortium"
		| "news-item"
		| "opportunity"
		| "page"
		| "person"
		| "project"
		| "spotlight-article"
		| "working-group"
		| "publication"
		| "service"
		| "software"
		| "training-material"
		| "workflow";
	value: string;
}

export function MenuSelect(props: Readonly<UseMenuProps>): ReactNode {
	const t = useTranslations("SearchPage");
	const { items, refine } = useMenu(props);
	const { value: selectedValue } = items.find((item) => {
		return item.isRefined;
	}) ?? {
		value: "",
	};

	return (
		<Select
			className="w-48 max-w-full"
			label={t("category.label")}
			onChange={(value) => {
				refine(value?.toString() ?? "");
			}}
			value={selectedValue || null}
		>
			<SelectItem id={""} textValue="">
				{""}
			</SelectItem>
			{items.map((item) => {
				return (
					<SelectItem key={item.value} id={item.value} textValue={item.label}>
						{t(`categories.${item.label as SELECT_OPTION["label"]}`)}
					</SelectItem>
				);
			})}
		</Select>
	);
}
