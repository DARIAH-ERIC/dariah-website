import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Typography } from "@/components/ui/typography/typography";

export function MapLegend(): ReactNode {
	const t = useTranslations("MembersAndPartnersPage");
	return (
		<div className="flex flex-col gap-6 p-4 rounded-[5px] z-800 absolute bottom-6 right-4 bg-white lg:bottom-8.5 lg:right-20 lg:flex-row">
			<div className="flex gap-2">
				<div className="size-6.75 bg-primary text-white flex items-center justify-center">
					{t("legend.members").slice(0, 1)}
				</div>
				<Typography variant="regular">{t("legend.members")}</Typography>
			</div>
			<div className="flex gap-2">
				<div className="size-6.75 bg-primary-400 text-white flex items-center justify-center">
					{t("legend.cooperating partners").slice(0, 1)}
				</div>
				<Typography variant="regular">{t("legend.cooperating partners")}</Typography>
			</div>
		</div>
	);
}
