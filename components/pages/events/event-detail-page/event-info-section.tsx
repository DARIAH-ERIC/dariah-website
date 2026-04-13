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
}

export function EventInfoSection(props: Readonly<EventInfoSectionProps>): ReactNode {
	const t = useTranslations("EventsDetailPage");
	const { location, startDate, endDate } = props;

	return (
		<div className="flex flex-col gap-2">
			<div>
				<Typography variant="regular">{t("infoSection.start")}</Typography>
				<Typography className="font-semibold" variant="regular">
					{getFormattedDateForEventDetails(startDate)}
				</Typography>
			</div>
			{endDate !== undefined && (
				<div>
					<Typography variant="regular">{t("infoSection.end")}</Typography>
					<Typography className="font-semibold" variant="regular">
						{getFormattedDateForEventDetails(endDate)}
					</Typography>
				</div>
			)}
			<div>
				<Typography variant="regular">{t("infoSection.venue")}</Typography>
				<Typography className="font-semibold" variant="regular">
					{location}
				</Typography>
			</div>
			<div>
				<Typography variant="regular">{t("infoSection.website")}</Typography>
				<Link
					className="text-[18px]"
					endIcon={<OpenInNewIcon className="size-5" />}
					href="/events"
					variant="tertiary"
				>
					{"website"}
				</Link>
			</div>
		</div>
	);
}
