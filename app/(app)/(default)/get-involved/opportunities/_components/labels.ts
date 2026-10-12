import { useExtracted as useTranslations } from "next-intl";

import type { OpportunitySource, OpportunityStatus } from "#/lib/data/opportunities.ts";

/** Shared by the opportunities page and the analytics page, which reports the filters used. */
export function useOpportunityStatusLabels(): Record<OpportunityStatus, string> {
	const t = useTranslations();

	return {
		open: t("Open"),
		upcoming: t("Upcoming"),
		closed: t("Closed"),
	};
}

export function useOpportunitySourceLabels(): Record<OpportunitySource, string> {
	const t = useTranslations();

	return {
		dariah: t("DARIAH"),
		external: t("External"),
	};
}
