import React, { type ReactNode } from "react";

import { Image } from "@/components/image";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";

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

	return (
		<section className="w-full px-6 py-20 items-center flex flex-col lg:px-26.25 lg:py-22.5">
			<Typography
				className="font-heading text-[56px] font-light w-full lg:px-7.25 lg:text-[85px]"
				variant="h1"
			>
				{"Our Network"}
			</Typography>
			<div className="flex flex-col justify-center gap-6 mt-7.75 lg:flex-row lg:flex-wrap lg:mt-0">
				<div className="flex flex-col gap-6 items-center">
					<div className="flex flex-col items-center mt-7.75 lg:flex-wrap lg:flex-row lg:justify-center lg:mt-0 3xl:justify-between">
						<div className="relative w-78 h-111.5 flex justify-center lg:w-102.25 lg:h-155.75">
							<Image
								alt="DARIAH Campus Logo"
								className="size-78"
								height={514}
								src="/assets/images/network-countries.svg"
								width={514}
							/>
							<div className="text-text-link-bg flex items-end gap-7.25 absolute bottom-0 left-1/2 -translate-x-1/2">
								<p className="font-heading text-[128px] font-black leading-[1.3] tracking-[0.02em]">
									{stats.memberCountries}
								</p>
								<Typography className="pb-5.5 text-[24px]" variant="h3">
									{"Member countries"}
								</Typography>
							</div>
						</div>

						<div className="relative w-78 h-111.5 flex justify-center lg:w-102.25 lg:h-155.75">
							<Image
								alt="DARIAH Campus Logo"
								className="size-78"
								height={514}
								src="/assets/images/network-institution.svg"
								width={514}
							/>
							<div className="text-text-link-bg flex items-end gap-7.25 absolute bottom-0 left-1/2 -translate-x-1/2">
								<p className="font-heading text-[128px] font-black leading-[1.3] tracking-[0.02em]">
									{stats.partnerInstitutions}
								</p>
								<Typography className="pb-5.5 text-[24px]" variant="h3">
									{"National Partner Institution"}
								</Typography>
							</div>
						</div>

						<div className="relative w-78 h-111.5 flex justify-center lg:w-102.25 lg:h-155.75">
							<Image
								alt="DARIAH Campus Logo"
								className="size-78"
								height={514}
								src="/assets/images/network-partner.svg"
								width={514}
							/>
							<div className="text-text-link-bg flex items-end gap-7.25 absolute bottom-0 left-1/2 -translate-x-1/2">
								<p className="font-heading text-[128px] font-black leading-[1.3] tracking-[0.02em]">
									{stats.cooperatingPartners}
								</p>
								<Typography className="pb-5.5 text-[24px]" variant="h3">
									{"Cooperating Partners"}
								</Typography>
							</div>
						</div>
					</div>

					<div className="bg-gray-200 w-78 max-w-full py-5 px-6.25 flex justify-center mt-8.75 lg:w-full">
						<Link href={"/"} variant="primary" withDefaultRightIcon={true}>
							{"Read more about Members and Partners"}
						</Link>
					</div>
				</div>

				<div className="flex flex-col gap-6">
					<div className="relative w-78 h-111.5 flex justify-center lg:w-102.25 lg:h-155.75">
						<Image
							alt="DARIAH Campus Logo"
							className="size-78"
							height={514}
							src="/assets/images/network-partner.svg"
							width={514}
						/>
						<div className="text-text-link-bg flex items-end gap-7.25 absolute bottom-0 left-1/2 -translate-x-1/2">
							<p className="font-heading text-[128px] font-black leading-[1.3] tracking-[0.02em]">
								{stats.workingGroups}
							</p>
							<Typography className="pb-5.5 text-[24px]" variant="h3">
								{"Working Groups"}
							</Typography>
						</div>
					</div>

					<div className="bg-text-link-bg w-78 max-w-102.25 py-5 px-6.25 flex justify-center mt-8.75 lg:w-102.25">
						<Link href={"/"} variant="color-bg" withDefaultRightIcon={true}>
							{"Read more about Working Groups"}
						</Link>
					</div>
				</div>
			</div>
		</section>
	);
}
