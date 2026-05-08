import { cn } from "@acdh-oeaw/style-variants";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Image } from "@/components/image";
import { NavLink } from "@/components/ui/link/nav-link";
import { Tag } from "@/components/ui/tag/tag";
import { Typography } from "@/components/ui/typography/typography";
import logo from "@/public/assets/images/logo-dariah-eu.svg";
import { getFundingCallStatus } from "@/utils/funding-call-page.utils";

interface FundingCallCardProps {
	slug: string;
	index: number;
	title: string;
	startDate: Date;
	endDate?: Date;
}

const BG_POSITON_OPTIONS = [
	"bg-[position:0_0%]",
	"bg-[position:0_33.33%]",
	"bg-[position:0_66.66%]",
	"bg-[position:0_100%]",
];

export function FundingCallCard(props: Readonly<FundingCallCardProps>): ReactNode {
	const { slug, index, title, startDate, endDate } = props;
	const t = useTranslations("FundingCallsPage");

	const status = getFundingCallStatus(startDate, endDate ?? startDate);
	const href = `/get-involved/dariah-funding-call/${slug}`;

	return (
		<NavLink
			className={cn(
				"group rounded-sm z-0 shadow-funding-call-card",
				"bg-[url(/assets/images/funding-call-bg.png)] bg-cover bg-no-repeat",
				BG_POSITON_OPTIONS[index % 4],
				status === "closed" && "grayscale",
				"hover:shadow-funding-call-card-hover",
				"focus:outline-4 focus:outline-accent",
			)}
			href={href}
		>
			<div className="pt-11.5 pb-14.5 px-11 flex flex-col gap-6 bg-(image:--funding-call-bg) w-full z-1 h-57.25 md:h-54 2xl:max-w-407.5">
				<Image alt={title} className="w-39.75 h-12.25" height={49} src={logo} width={159} />
				<div className="flex gap-4">
					<Typography
						className={
							"group-hover:text-primary group-hover:underline group-focus:text-black group-focus:underline"
						}
						variant="h3"
					>
						{title}
					</Typography>
					{status === "open" && <Tag text={t("openCall")} variant="upcoming" />}
				</div>
			</div>
		</NavLink>
	);
}
