import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";

import { Button } from "@/components/ui/button/button";
import { Typography } from "@/components/ui/typography/typography";

export function HeroSection(): ReactNode {
	const t = useTranslations("HomePage");

	return (
		<section
			className={`w-full h-165 bg-[url(/assets/images/background-hero-section.svg)] relative lg:h-241.25`}
		>
			<div className="flex flex-col items-center mt-35 gap-11.5 lg:items-start lg:mt-57.75 lg:ml-26">
				<Typography
					className="text-[32px] p-6 text-white bg-text-link-bg/60 max-w-330 lg:pl-9 lg:pt-7.5 lg:pb-13.75 lg:text-[84px]"
					variant="h1"
				>
					{t("HeroSection.header")}
				</Typography>
				<div className="flex flex-col w-74 gap-6 lg:w-full lg:gap-16.25 lg:flex-row">
					<Button href="/get-involved/join-dariah" variant="secondary-blue">
						{t("HeroSection.getInvolved")}
					</Button>
					<Button href="/about/dariah-in-a-nutshell" variant="secondary-black">
						{t("HeroSection.learnMore")}
					</Button>
				</div>
			</div>
			<div className="h-27.75 justify-center bg-white w-full flex items-center absolute bottom-0 left-0 lg:justify-start lg:h-42.5 lg:pl-32.5 lg:w-221">
				<Typography className="font-heading text-[56px] font-light lg:text-[85px]" variant="h1">
					{t("HeroSection.stayUpdated")}
				</Typography>
			</div>
		</section>
	);
}
