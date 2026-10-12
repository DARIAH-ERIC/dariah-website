import { useExtracted as useTranslations } from "next-intl";

import type { WebsiteDocumentType } from "#/lib/search/index.ts";

/** Shared by the search page and the analytics page, which reports the categories searched. */
export function useWebsiteTypeLabels(): Record<WebsiteDocumentType, string> {
	const t = useTranslations();

	return {
		country: t("Country"),
		"document-or-policy": t("Document or policy"),
		event: t("Event"),
		"funding-call": t("Funding call"),
		"governance-body": t("Governance body"),
		"impact-case-study": t("Impact case study"),
		institution: t("Institution"),
		"national-consortium": t("National consortium"),
		"news-item": t("News"),
		opportunity: t("Opportunity"),
		page: t("Page"),
		person: t("Person"),
		project: t("Project"),
		"spotlight-article": t("Spotlight article"),
		"working-group": t("Working group"),
		publication: t("Publication"),
		service: t("Service"),
		software: t("Software"),
		"training-material": t("Training material"),
		workflow: t("Workflow"),
	};
}
