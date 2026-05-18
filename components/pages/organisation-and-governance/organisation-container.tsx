"use client";
import type { ReactNode } from "react";

import { DesktopOrganisation } from "@/components/pages/organisation-and-governance/desktop-organisation";
import { MobileOrganisation } from "@/components/pages/organisation-and-governance/mobile-organisation";
import type { GovernanceBodyList } from "@/lib/data/api-client";
import { useMediaQuery } from "@/utils/hooks/use-media-query";

interface OrganisationContainerProps {
	governanceBodies: Array<GovernanceBodyList["data"][number]>;
}

export function OrganisationContainer(props: Readonly<OrganisationContainerProps>): ReactNode {
	const { governanceBodies } = props;
	const isLg = useMediaQuery("lg");

	if (isLg === undefined || isLg)
		return <DesktopOrganisation governanceBodies={governanceBodies} />;

	return <MobileOrganisation governanceBodies={governanceBodies} />;
}
