import { useTranslations } from "next-intl";
import React, { type ReactNode } from "react";

import { Image } from "@/components/image";
import { Button } from "@/components/ui/button/button";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";
import logoDariahCampus from "@/public/assets/images/logo-dariah-campus.svg";
import logoDariahTransformations from "@/public/assets/images/logo-dariah-transformations.svg";
import logoSshoc from "@/public/assets/images/logo-sshoc.svg";

export function ResourcesSection(): ReactNode {
	const t = useTranslations("HomePage");

	return (
		<section className="relative w-full bg-[url(/assets/images/background-resources.svg)]">
			<div className="absolute top-0 left-0 backdrop-blur-[50px] bg-(image:--section-news-bg) size-full opacity-80 z-1">
				<div className="absolute top-0 left-0 w-full h-176.75 bg-section-resources-top-bg opacity-40 backdrop-blur-[13.4px] z-3" />
			</div>
			<div className="relative z-2 px-6 py-14 flex flex-col gap-38.5 lg:py-32.75 lg:px-30.25">
				<div className="flex flex-wrap gap-14 2xl:gap-56.25">
					<Typography
						className="text-white font-heading text-[56px] font-light w-95 tracking-(--letter-spacing-medium) lg:text-[85px]"
						variant="h2"
					>
						{t("ResourcesSection.title")}
					</Typography>
					<div className="flex flex-col w-full gap-6 text-white pt-7 lg:w-178.25">
						<Typography className="text-[24px]" variant="h3">
							{t("ResourcesSection.description.header")}
						</Typography>
						<Typography className="font-normal text-[24px]" variant="h3">
							{t("ResourcesSection.description.content")}
						</Typography>
						<Button className="w-full mt-2 lg:w-62.75 [&>span]:py-0.5!" variant="primary">
							{t("ResourcesSection.description.button")}
						</Button>
					</div>
				</div>
				<div className="flex flex-wrap justify-center gap-30.5 px-1.5">
					<div className="w-117.25">
						<div className="pl-5.5 flex items-center h-34.5 bg-resource-container-bg lg:h-37.75 lg:pl-10.75">
							<Image
								alt="DARIAH Campus Logo"
								className="w-59.5 lg:w-96.75"
								src={logoDariahCampus}
							/>
						</div>
						<div className="flex flex-col gap-1 px-4 py-6 bg-white lg:px-10 lg:pt-8 lg:pb-6">
							<Typography className="h-27 line-clamp-4" variant="regular">
								{t("ResourcesSection.dariahCampus")}
							</Typography>
							<Link href={"/resources/dariah-campus"} variant="primary" withDefaultRightIcon={true}>
								{t("ResourcesSection.explore")}
							</Link>
						</div>
					</div>
					<div className="w-117.25">
						<div className="flex items-center pl-5.5 h-34.5 bg-resource-container-bg lg:h-37.75 lg:pl-10.75">
							<Image
								alt="DARIAH Transformations Logo"
								className="w-59.5 lg:w-96.75"
								src={logoDariahTransformations}
							/>
						</div>
						<div className="flex flex-col gap-1 px-4 py-6 bg-white lg:px-10 lg:pt-8 lg:pb-6">
							<Typography className="h-27 line-clamp-4" variant="regular">
								{t("ResourcesSection.transformations")}
							</Typography>
							<Link
								href={"/resources/transformations"}
								variant="primary"
								withDefaultRightIcon={true}
							>
								{t("ResourcesSection.explore")}
							</Link>
						</div>
					</div>
					<div className="w-117.25">
						<div className="pl-5.5 flex items-center h-34.5 bg-resource-container-bg lg:h-37.75 lg:pl-10.75">
							<Image alt="DARIAH Campus Logo" className="w-59.5 lg:w-96.75" src={logoSshoc} />
						</div>
						<div className="flex flex-col gap-1 px-4 py-6 bg-white lg:px-10 lg:pt-8 lg:pb-6">
							<Typography className="h-27 line-clamp-4" variant="regular">
								{t("ResourcesSection.sshOpenMarketplace")}
							</Typography>
							<Link
								href={"/resources/ssh-open-marketplace"}
								variant="primary"
								withDefaultRightIcon={true}
							>
								{t("ResourcesSection.explore")}
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
