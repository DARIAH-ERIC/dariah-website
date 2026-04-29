import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Typography } from "@/components/ui/typography/typography";

export function SearchError(): ReactNode {
	const t = useTranslations("DariahResourceCataloguePage");

	return (
		<div className="flex-col px-8 gap-16 w-full flex pt-8 xl:px-79">
			<Typography className="font-heading text-[45px] font-light" variant="h1">
				{t("title")}
			</Typography>
			<Typography variant="regular">{t("error")}</Typography>
		</div>
	);
}
