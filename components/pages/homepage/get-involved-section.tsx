import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";

import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";

export function GetInvolvedSection(): ReactNode {
	const t = useTranslations("HomePage");

	return (
		<section className="bg-[url(/assets/images/background-get-involved.jpg)] bg-cover bg-position-[center_60%] w-full h-201 flex items-end justify-center mb-25.5">
			<div className="bg-event-card-details-bg flex flex-col gap-2 w-284.5 max-w-full items-center px-6 py-3.25">
				<Typography
					className="text-[32px] text-text-link-bg text-center lg:text-[40px]"
					variant="h3"
				>
					{t("GetInvolvedSection.title.part1")}
					<span className="font-normal">{t("GetInvolvedSection.title.part2")}</span>
					{t("GetInvolvedSection.title.part3")}
				</Typography>
				<Link href="/get-involved/join-dariah" variant="button-primary">
					{t("GetInvolvedSection.button")}
				</Link>
			</div>
		</section>
	);
}
