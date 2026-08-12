import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";

import { Image } from "@/components/image";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";
import cooperatingPartnersImage from "@/public/assets/images/DARIAH-EU_Cooperating Partners.gif";
import memberCountriesImage from "@/public/assets/images/DARIAH-EU_Member Countries.gif";
import nationalPartnersImage from "@/public/assets/images/DARIAH-EU_National Partners.gif";
import workingGroupsImage from "@/public/assets/images/DARIAH-EU_Working Groups.gif";

interface NetworkSectionProps {
	stats: {
		memberCountries: number;
		partnerInstitutions: number;
		cooperatingPartners: number;
		workingGroups: number;
	};
}

export function NetworkSection(props: Readonly<NetworkSectionProps>): ReactNode {
	const { stats } = props;

	const t = useTranslations("HomePage");

	return (
		<section className="w-full px-6 py-20 items-center flex flex-col 3xl:px-26.25 3xl:py-22.5">
			<Typography
				className="font-heading text-[3.5rem] font-light w-full lg:px-7.25 lg:text-[5.3125rem]"
				variant="h2"
			>
				{t("NetworkSection.title")}
			</Typography>
			<div className="flex flex-col justify-center gap-6 mt-7.75 lg:flex-row lg:flex-wrap lg:mt-0">
				<div className="flex flex-col gap-6 items-center">
					<div className="flex flex-col items-center mt-7.75 xl:flex-row lg:justify-center lg:gap-4 lg:mt-0 3xl:justify-between">
						<div className="relative w-78 h-111.5 flex justify-center 3xl:w-102.25 lg:h-125.75">
							<Image
								alt=""
								className="size-78"
								height={514}
								src={memberCountriesImage}
								width={514}
							/>
							<div className="text-text-link-bg flex items-end gap-x-7.25 gap-y-2 absolute bottom-0 left-1/2 -translate-x-1/2 xl:justify-center xl:items-center xl:flex-wrap 3xl:flex-nowrap">
								<p className="font-heading text-[8rem] font-black leading-[1.3] tracking-[0.02em] xl:text-[6.25rem] 3xl:text-[8rem]">
									{stats.memberCountries}
								</p>
								<Typography
									className="pb-5.5 text-[1.5rem] text-start xl:text-center 3xl:text-start"
									variant="h3"
								>
									{t("NetworkSection.countries")}
								</Typography>
							</div>
						</div>

						<div className="relative w-78 h-111.5 flex justify-center 3xl:w-102.25 lg:h-125.75">
							<Image
								alt=""
								className="size-78"
								height={514}
								src={nationalPartnersImage}
								width={514}
							/>
							<div className="text-text-link-bg flex items-end gap-x-7.25 gap-y-2 absolute bottom-0 left-1/2 -translate-x-1/2 xl:justify-center xl:items-center xl:flex-wrap 3xl:flex-nowrap">
								<p className="font-heading text-[8rem] font-black leading-[1.3] tracking-[0.02em] xl:text-[6.25rem] 3xl:text-[8rem]">
									{stats.partnerInstitutions}
								</p>
								<Typography
									className="pb-5.5 text-[1.5rem] text-start xl:text-center 3xl:text-start"
									variant="h3"
								>
									{t("NetworkSection.partnerInstitutions")}
								</Typography>
							</div>
						</div>

						<div className="relative w-78 h-111.5 flex justify-center 3xl:w-102.25 lg:h-125.75">
							<Image
								alt=""
								className="size-78"
								height={514}
								src={cooperatingPartnersImage}
								width={514}
							/>
							<div className="text-text-link-bg flex items-end gap-x-7.25 gap-y-2 absolute bottom-0 left-1/2 -translate-x-1/2 xl:justify-center xl:items-center xl:flex-wrap 3xl:flex-nowrap">
								<p className="font-heading text-[8rem] font-black leading-[1.3] tracking-[0.02em] xl:text-[6.25rem] 3xl:text-[8rem]">
									{stats.cooperatingPartners}
								</p>
								<Typography
									className="pb-5.5 text-[1.5rem] text-start xl:text-center 3xl:text-start"
									variant="h3"
								>
									{t("NetworkSection.cooperatingPartners")}
								</Typography>
							</div>
						</div>
						<div className="relative w-78 h-111.5 flex justify-center 3xl:w-102.25 lg:h-125.75">
							<Image alt="" className="size-78" height={514} src={workingGroupsImage} width={514} />
							<div className="text-text-link-bg flex items-end gap-x-7.25 gap-y-2 absolute bottom-0 left-1/2 -translate-x-1/2 xl:justify-center xl:items-center xl:flex-wrap 3xl:flex-nowrap">
								<p className="font-heading text-[8rem] font-black leading-[1.3] tracking-[0.02em] xl:text-[6.25rem] 3xl:text-[8rem]">
									{stats.workingGroups}
								</p>
								<Typography
									className="pb-5.5 text-[1.5rem] text-start xl:text-center 3xl:text-start"
									variant="h3"
								>
									{t("NetworkSection.workingGroups")}
								</Typography>
							</div>
						</div>
					</div>
				</div>

				<div className="flex flex-col gap-6 w-full px-6 xl:flex-row">
					<div className="bg-gray-200 w-78 max-w-full py-5 px-6.25 flex justify-center xl:mt-8.75 lg:w-full">
						<Link
							href={"/network/members-and-partners"}
							variant="primary"
							withDefaultRightIcon={true}
						>
							{t("NetworkSection.readMore.membersAndPartners")}
						</Link>
					</div>

					<div className="bg-text-link-bg w-78 max-w-102.25 py-5 px-6.25 flex justify-center xl:mt-8.75 lg:w-127.25">
						<Link href={"/network/working-groups"} variant="color-bg" withDefaultRightIcon={true}>
							{t("NetworkSection.readMore.workingGroups")}
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
