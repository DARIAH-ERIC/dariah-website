import type { ReactNode } from "react";

import { GovernanceBodyCard } from "@/components/ui/governance-body-card/governance-body-card";
import { GovernanceBodyRelationArrow } from "@/components/ui/governance-body-card/governance-body-relation-arrow";
import type { GovernanceBodyList } from "@/lib/data/api-client";
import type { GovernanceBody } from "@/types/governance-body";
import {
	getGovernanceBodiesForDesktop,
	getGovernanceRelationships,
	getGovernanceVariant,
} from "@/utils/organisation-and-governance.utils";

interface DesktopOrganisationProps {
	governanceBodies: Array<GovernanceBodyList["data"][number]>;
}

export function DesktopOrganisation(props: Readonly<DesktopOrganisationProps>): ReactNode {
	const { governanceBodies } = props;

	const {
		generalAssembly,
		boardOfDirectors,
		coordinationOffice,
		researchComitee,
		nationalComitee,
		workingGroup,
		scientificAdvisoryBoard,
		seniorManagementTeam,
	} = getGovernanceBodiesForDesktop(governanceBodies);

	return (
		<div className="flex p-12 xl:px-30 2xl:px-45 3xl:px-78">
			<div className="w-full max-w-245.25">
				<div className="flex flex-col items-center w-full">
					{generalAssembly && (
						<div className="flex items-center w-full">
							<GovernanceBodyCard
								description={generalAssembly.summary ?? undefined}
								href={`/about/organisation-and-governance?selectedBody=${generalAssembly.entity.slug}#userList`}
								name={generalAssembly.name}
								relationships={getGovernanceRelationships(
									generalAssembly.entity.slug as GovernanceBody,
								)}
								usersCount={generalAssembly.persons.length}
								variant={getGovernanceVariant(generalAssembly.entity.slug as GovernanceBody)!}
							/>
							<GovernanceBodyRelationArrow direction="right" text="Appoints" />
						</div>
					)}
					<GovernanceBodyRelationArrow direction="down" text="Appoints" />
					{boardOfDirectors && (
						<div className="flex w-full">
							<GovernanceBodyCard
								description={boardOfDirectors.summary ?? undefined}
								href={`/about/organisation-and-governance?selectedBody=${boardOfDirectors.entity.slug}#userList`}
								name={boardOfDirectors.name}
								relationships={getGovernanceRelationships(
									boardOfDirectors.entity.slug as GovernanceBody,
								)}
								usersCount={boardOfDirectors.persons.length}
								variant={getGovernanceVariant(boardOfDirectors.entity.slug as GovernanceBody)!}
							/>
							<div className="flex flex-col justify-between">
								<GovernanceBodyRelationArrow direction="left" text="Advises" />
								<GovernanceBodyRelationArrow direction="left" text="Advises" />
							</div>
						</div>
					)}
				</div>
				<div className="pr-20 flex items-center">
					{coordinationOffice && (
						<div className="flex flex-col items-center w-full max-w-99">
							<GovernanceBodyRelationArrow direction="down" text="Appoints" />
							<GovernanceBodyCard
								description={coordinationOffice.summary ?? undefined}
								href={`/about/organisation-and-governance?selectedBody=${coordinationOffice.entity.slug}#userList`}
								name={coordinationOffice.name}
								relationships={getGovernanceRelationships(
									coordinationOffice.entity.slug as GovernanceBody,
								)}
								usersCount={coordinationOffice.persons.length}
								variant={getGovernanceVariant(coordinationOffice.entity.slug as GovernanceBody)!}
							/>
						</div>
					)}
					<GovernanceBodyRelationArrow direction="right" text="Supports" />
					{researchComitee && (
						<div className="flex flex-col items-center w-full max-w-99">
							<GovernanceBodyRelationArrow direction="down" text="Appoints" />
							<GovernanceBodyCard
								description={researchComitee.summary ?? undefined}
								href={`/about/organisation-and-governance?selectedBody=${researchComitee.entity.slug}#userList`}
								name={researchComitee.name}
								relationships={getGovernanceRelationships(
									researchComitee.entity.slug as GovernanceBody,
								)}
								usersCount={researchComitee.persons.length}
								variant={getGovernanceVariant(researchComitee.entity.slug as GovernanceBody)!}
							/>
						</div>
					)}
				</div>
				<div className="flex items-center gap-32 pr-20">
					<div className="flex flex-col items-center w-full max-w-96.5">
						<GovernanceBodyRelationArrow direction="down" text="Supports" />
						{nationalComitee && (
							<GovernanceBodyCard
								description={nationalComitee.summary ?? undefined}
								href={`/about/organisation-and-governance?selectedBody=${nationalComitee.entity.slug}#userList`}
								name={nationalComitee.name}
								relationships={getGovernanceRelationships(
									nationalComitee.entity.slug as GovernanceBody,
								)}
								usersCount={nationalComitee.persons.length}
								variant={getGovernanceVariant(nationalComitee.entity.slug as GovernanceBody)!}
							/>
						)}
					</div>
					{workingGroup && (
						<div className="flex flex-col items-center w-full max-w-96.5">
							<GovernanceBodyRelationArrow direction="down" text="Oversees" />
							<GovernanceBodyCard
								description={workingGroup.summary ?? undefined}
								href={`/about/organisation-and-governance?selectedBody=${workingGroup.entity.slug}#userList`}
								name={workingGroup.name}
								relationships={getGovernanceRelationships(
									workingGroup.entity.slug as GovernanceBody,
								)}
								usersCount={workingGroup.persons.length}
								variant={getGovernanceVariant(workingGroup.entity.slug as GovernanceBody)!}
							/>
						</div>
					)}
				</div>
			</div>
			<div className="flex flex-col gap-13.75 py-15.25 max-w-78.75">
				{scientificAdvisoryBoard && (
					<GovernanceBodyCard
						description={scientificAdvisoryBoard.summary ?? undefined}
						href={`/about/organisation-and-governance?selectedBody=${scientificAdvisoryBoard.entity.slug}#userList`}
						name={scientificAdvisoryBoard.name}
						relationships={getGovernanceRelationships(
							scientificAdvisoryBoard.entity.slug as GovernanceBody,
						)}
						usersCount={scientificAdvisoryBoard.persons.length}
						variant={getGovernanceVariant(scientificAdvisoryBoard.entity.slug as GovernanceBody)!}
					/>
				)}
				{seniorManagementTeam && (
					<GovernanceBodyCard
						description={seniorManagementTeam.summary ?? undefined}
						href={`/about/organisation-and-governance?selectedBody=${seniorManagementTeam.entity.slug}#userList`}
						name={seniorManagementTeam.name}
						relationships={getGovernanceRelationships(
							seniorManagementTeam.entity.slug as GovernanceBody,
						)}
						usersCount={seniorManagementTeam.persons.length}
						variant={getGovernanceVariant(seniorManagementTeam.entity.slug as GovernanceBody)!}
					/>
				)}
			</div>
		</div>
	);
}
