import { useExtracted as useTranslations } from "next-intl";
import type { ReactNode } from "react";

import type { Announcement } from "#/lib/api/schemas.ts";

interface AnnouncementTypeProps {
	type: Announcement["type"];
}

/** An announcement's type, as its card's label names it: "News", "Opportunity" or "Funding call". */
export function AnnouncementType(props: Readonly<AnnouncementTypeProps>): ReactNode {
	const { type } = props;

	const t = useTranslations();

	switch (type) {
		case "news": {
			return t("News");
		}
		case "opportunities": {
			return t("Opportunity");
		}
		case "funding_calls": {
			return t("Funding call");
		}
	}
}
