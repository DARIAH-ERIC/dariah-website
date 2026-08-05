"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import type { Key } from "react-aria";

import { Select, SelectItem } from "@/components/ui/select/select";
import { getSelectOptionsForNewsletters } from "@/utils/newsletter-page.utils";

interface NewslettersFilterProps {
	year: string | Array<string> | undefined;
}

export function NewslettersFilter(props: Readonly<NewslettersFilterProps>): ReactNode {
	const { year } = props;
	const t = useTranslations("NewslettersPage");
	const yearOptions = getSelectOptionsForNewsletters();
	const router = useRouter();
	const pathname = usePathname();

	const handleSelectedYearChange = (value: Key | null) => {
		if (value === null || !yearOptions.includes(value.toString())) {
			router.push(pathname);
			return;
		}
		router.push(`${pathname}?year=${value.toString()}`, { scroll: false });
	};

	return (
		<Select
			className="w-48 max-w-full"
			label={t("select.label")}
			onChange={handleSelectedYearChange}
			placeholder={t("select.placeholder")}
			value={year?.toString() ?? null}
		>
			{yearOptions.map((yearOption) => {
				return (
					<SelectItem key={yearOption} id={yearOption} textValue={yearOption}>
						{yearOption ?? t("select.showAll")}
					</SelectItem>
				);
			})}
		</Select>
	);
}
