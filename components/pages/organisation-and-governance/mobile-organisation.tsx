import type { ReactNode } from "react";

import { GovernanceBodyCard } from "@/components/ui/governance-body-card/governance-body-card";
import type { GovernanceBodyList } from "@/lib/data/api-client";
import type { GovernanceBody } from "@/types/governance-body";
import {
	getGovernanceRelationships,
	getGovernanceVariant,
	sortGovernanceBodiesForMobile,
} from "@/utils/organisation-and-governance.utils";

interface MobileOrganisationProps {
	governanceBodies: Array<GovernanceBodyList["data"][number]>;
}

export function MobileOrganisation(props: Readonly<MobileOrganisationProps>): ReactNode {
	const { governanceBodies } = props;

	const sortedBodies = sortGovernanceBodiesForMobile(governanceBodies);

	return (
		<div className="flex flex-col py-12 px-4 gap-10">
			{sortedBodies.map((item) => {
				const {
					id,
					persons,
					name,
					summary,
					entity: { slug },
				} = item;

				const variant = getGovernanceVariant(slug as GovernanceBody);

				if (variant === undefined) return null;

				const relationships = getGovernanceRelationships(slug as GovernanceBody);

				return (
					<GovernanceBodyCard
						key={id}
						description={summary ?? undefined}
						href={`/about/organisation-and-governance?selectedBody=${slug}#userList`}
						name={name}
						relationships={relationships}
						usersCount={persons.length}
						variant={variant}
					/>
				);
			})}
		</div>
	);
}
