import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";

import { Pillar } from "@/components/pillar/pillar";
import { Typography } from "@/components/ui/typography/typography";

export function PilarsSection(): ReactNode {
	const t = useTranslations("HomePage");
	return (
		<section className="px-4 pt-7.75 pb-23 2xl:px-30.5">
			<Typography
				className="font-heading text-[56px] font-light w-full px-2.5 py-17.5 lg:text-[85px]"
				variant="h1"
			>
				{t("PillarsSection.header")}
			</Typography>
			<div className="flex flex-col items-center justify-center gap-10 xl:flex-row 3xl:justify-between">
				<Pillar
					description={t("PillarsSection.technology.description")}
					href="/about/strategy#technology"
					image={"/assets/images/pillar-technology.svg"}
					title={t("PillarsSection.technology.title")}
				/>
				<Pillar
					description={t("PillarsSection.knowledge.description")}
					href="/about/strategy#knowledge"
					image={"/assets/images/pillar-knowledge.svg"}
					title={t("PillarsSection.knowledge.title")}
				/>
				<Pillar
					description={t("PillarsSection.communities.description")}
					href="/about/strategy#communities"
					image={"/assets/images/pillar-communities.svg"}
					title={t("PillarsSection.communities.title")}
				/>
				<Pillar
					description={t("PillarsSection.policy.description")}
					href="/about/strategy#policy"
					image={"/assets/images/pillar-policy.svg"}
					title={t("PillarsSection.policy.title")}
				/>
			</div>
		</section>
	);
}
