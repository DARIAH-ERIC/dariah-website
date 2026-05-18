"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Typography } from "@/components/ui/typography/typography";
import type { RelationshipType } from "@/types/governance-body";

interface GovernanceBodyTagProps {
	relationship: RelationshipType;
}

const COLORS_FOR_RELATIONSHIPS = {
	"appoints-bod": {
		bg: "bg-governance-body-tag-appoints-bod-bg",
		text: "text-governance-body-tag-appoints-bod-text",
	},
	"appoints-sab": {
		bg: "bg-governance-body-tag-appoints-sab-bg",
		text: "text-governance-body-tag-appoints-sab-text",
	},

	"appoints-dco-and-jrc": {
		bg: "bg-governance-body-tag-appoints-dco-and-jrc-bg",
		text: "text-governance-body-tag-appoints-dco-and-jrc-text",
	},
	"advises-bod": {
		bg: "bg-governance-body-tag-advises-bod-bg",
		text: "text-governance-body-tag-advises-bod-text",
	},
	"represented-in-smt": {
		bg: "bg-governance-body-tag-represented-in-smt-bg",
		text: "text-governance-body-tag-represented-in-smt-text",
	},
	"oversees-wg": {
		bg: "bg-governance-body-tag-oversees-wg-bg",
		text: "text-primary",
	},
	"supports-wg": {
		bg: "bg-governance-body-tag-supports-wg-smt-bg",
		text: "text-primary",
	},
	"supports-ncc-and-jrc": {
		bg: "bg-governance-body-tag-supports-ncc-and-jrc-bg",
		text: "text-governance-body-tag-supports-ncc-and-jrc-text",
	},
};

export function GovernanceBodyTag(props: Readonly<GovernanceBodyTagProps>): ReactNode {
	const t = useTranslations("OrganisationAndGovernance");
	const { relationship } = props;
	const { bg, text } = COLORS_FOR_RELATIONSHIPS[relationship];

	return (
		<Typography className={`py-0.5 px-2 ${bg} ${text}`} variant="small">
			{t(`tag.${relationship}`)}
		</Typography>
	);
}
