import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";

import { Image } from "@/components/image";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";
import getInvolvedBackground from "@/public/assets/images/background-get-involved.jpg";

export function GetInvolvedSection(): ReactNode {
	const t = useTranslations("HomePage");

	return (
		<section className="relative isolate w-full h-201 flex items-end justify-center mb-25.5 overflow-hidden">
			<Image
				alt=""
				className="object-cover object-[center_60%] z-0"
				fill={true}
				sizes="(min-width: 1920px) 1920px, 100vw"
				src={getInvolvedBackground}
			/>
			<div className="relative z-1 bg-event-card-details-bg flex flex-col gap-2 w-284.5 max-w-full items-center px-6 py-3.25">
				<Typography
					className="text-h3 text-[2rem] text-text-link-bg text-center lg:text-[2.5rem]"
					variant="h2"
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
