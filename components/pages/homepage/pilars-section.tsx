import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";

import { Pillar } from "@/components/pillar/pillar";
import { Typography } from "@/components/ui/typography/typography";
import pillarCommunities from "@/public/assets/images/pillar-communities.svg";
import pillarKnowledge from "@/public/assets/images/pillar-knowledge.svg";
import pillarPolicy from "@/public/assets/images/pillar-policy.svg";
import pillarTechnology from "@/public/assets/images/pillar-technology.svg";

export function PilarsSection(): ReactNode {
	const t = useTranslations("HomePage");
	return (
		<section className="px-4 pt-7.75 pb-23 xl:px-12 2xl:px-30.5">
			<Typography
				className="font-heading text-[3.5rem] font-light w-full px-2.5 py-17.5 lg:text-[5.3125rem]"
				variant="h2"
			>
				{t("PillarsSection.header")}
			</Typography>
			<div className="flex flex-col items-center justify-center gap-10 xl:gap-6 xl:flex-row 3xl:gap-10 3xl:justify-between">
				<Pillar
					description={t("PillarsSection.technology.description")}
					href="/about/strategy#technology"
					image={pillarTechnology}
					title={t("PillarsSection.technology.title")}
				/>
				<Pillar
					description={t("PillarsSection.knowledge.description")}
					href="/about/strategy#knowledge"
					image={pillarKnowledge}
					title={t("PillarsSection.knowledge.title")}
				/>
				<Pillar
					description={t("PillarsSection.communities.description")}
					href="/about/strategy#communities"
					image={pillarCommunities}
					title={t("PillarsSection.communities.title")}
				/>
				<Pillar
					description={t("PillarsSection.policy.description")}
					href="/about/strategy#policy"
					image={pillarPolicy}
					title={t("PillarsSection.policy.title")}
				/>
			</div>
		</section>
	);
}
