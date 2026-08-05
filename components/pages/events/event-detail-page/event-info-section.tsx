import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { OpenInNewIcon } from "@/components/ui/icons/open-in-new";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";
import { getFormattedDateForEventDetails } from "@/utils/event-page.utils";

interface EventInfoSectionProps {
	location: string;
	startDate: Date;
	endDate?: Date;
	website?: string;
	isFullDay: boolean;
}

export function EventInfoSection(props: Readonly<EventInfoSectionProps>): ReactNode {
	const t = useTranslations("EventsDetailPage");
	const { location, startDate, endDate, website, isFullDay } = props;

	return (
		<div className="flex flex-col gap-2">
			<div>
				<Typography variant="regular">{t("infoSection.start")}</Typography>
				<Typography className="font-semibold" variant="regular">
					{getFormattedDateForEventDetails(startDate, isFullDay)}
				</Typography>
			</div>
			{endDate !== undefined && (
				<div>
					<Typography variant="regular">{t("infoSection.end")}</Typography>
					<Typography className="font-semibold" variant="regular">
						{getFormattedDateForEventDetails(endDate, isFullDay)}
					</Typography>
				</div>
			)}
			<div>
				<Typography variant="regular">{t("infoSection.venue")}</Typography>
				<Typography className="font-semibold" variant="regular">
					{location}
				</Typography>
			</div>
			{website !== undefined && (
				<div>
					<Typography variant="regular">{t("infoSection.website.title")}</Typography>
					<Link
						className="text-[1.25rem] break-all"
						endIcon={<OpenInNewIcon className="size-5" />}
						href={website}
						variant="tertiary"
					>
						{website}
					</Link>
				</div>
			)}
		</div>
	);
}
