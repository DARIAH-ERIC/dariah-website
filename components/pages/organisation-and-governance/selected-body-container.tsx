"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { type ReactNode, useEffect, useRef } from "react";

import { ContentBlocks } from "@/components/content-blocks";
import { NavLink } from "@/components/navigation";
import { GovernanceBodyTag } from "@/components/ui/governance-body-card/governance-body-tag";
import { CloseIcon } from "@/components/ui/icons/close";
import { PersonCard } from "@/components/ui/person-card/person-card";
import { PersonCardDetailsContainer } from "@/components/ui/person-card/person-card-details-container";
import { Typography } from "@/components/ui/typography/typography";
import type { components } from "@/lib/api/types";
import type { GovernanceBody, Person } from "@/lib/data/api-client";
import type {
	GovernanceBody as GovernanceBodyNames,
	GovernanceVariants,
	RelationshipType,
} from "@/types/governance-body";

interface SelectedBodyContainerProps {
	selectedPerson?: Person;
	selectedBodyBgColor?: string;
	selectedBodyBorderColor?: string;
	selectedBodyRelationships: Array<RelationshipType>;
	usersForSelectedBody: components["schemas"]["GovernanceBodyList"][number]["persons"];
	selectedBodyVariant?: GovernanceVariants;
	selectedBody: GovernanceBodyNames;
	selectedBodyItem?: GovernanceBody;
}

export function SelectedBodyContainer(props: Readonly<SelectedBodyContainerProps>): ReactNode {
	const {
		selectedBodyBgColor,
		selectedPerson,
		selectedBodyBorderColor,
		selectedBodyRelationships,
		usersForSelectedBody,
		selectedBodyVariant,
		selectedBodyItem,
		selectedBody,
	} = props;

	const t = useTranslations("OrganisationAndGovernance");
	const searchParams = useSearchParams();
	const userListRef = useRef<HTMLDivElement | null>(null);
	const bodyNameRef = useRef<HTMLHeadingElement | HTMLParagraphElement | null>(null);

	useEffect(() => {
		if (!userListRef.current || !bodyNameRef.current) return;

		bodyNameRef.current.focus();
		userListRef.current.scrollIntoView();
	}, [searchParams]);

	if (!selectedBodyVariant || !selectedBodyItem) return null;

	return (
		<div className="relative">
			<div ref={userListRef} className="absolute -top-10" />
			<div
				className={cn(
					"w-full px-4 py-3 flex justify-between text-white! lg:px-34 2xl:px-45 3xl:px-78",
					selectedBodyBgColor,
				)}
			>
				<div className="flex flex-col gap-2">
					<Typography className="uppercase" variant="caption">
						{selectedBodyVariant.replaceAll("-", " ")}
					</Typography>
					<div className="flex gap-2">
						<Typography
							ref={bodyNameRef}
							className="capitalize text-regular font-body"
							tabIndex={-1}
							variant="h2"
						>
							{selectedBodyItem.acronym} {selectedBody.replaceAll("-", " ")}
						</Typography>
					</div>
				</div>
				<NavLink href="/about/organisation-and-governance">
					<CloseIcon aria-label="close" className="fill-white! size-10!" />
				</NavLink>
			</div>
			{selectedPerson === undefined ? (
				<>
					<div className="flex flex-col gap-4 py-6 px-4 lg:px-34 2xl:px-45 3xl:px-78">
						<div
							className={cn("border-l-4 pl-4 [&>p:first-of-type]:mt-0!", selectedBodyBorderColor)}
						>
							<ContentBlocks fields={selectedBodyItem.description} />
						</div>
						<div className="flex flex-wrap gap-6">
							{selectedBodyRelationships.map((relationship) => {
								return <GovernanceBodyTag key={relationship} relationship={relationship} />;
							})}
						</div>
						<Typography className="font-bold text-regular font-body" variant="h3">
							{t("bodyDetails.membersCount", {
								count: selectedBodyItem.persons.length.toString(),
							})}
						</Typography>
					</div>
					<div className="flex flex-wrap gap-10 py-6 px-4 lg:px-34 2xl:px-45 3xl:px-78">
						{usersForSelectedBody.length > 0 &&
							usersForSelectedBody.map((user) => {
								const { id, name, positions, slug, image: userImage } = user;

								return (
									<PersonCard
										key={id}
										href={`/about/organisation-and-governance?selectedBody=${selectedBody}&selectedUser=${slug}`}
										image={userImage}
										name={name}
										position={positions}
									/>
								);
							})}
					</div>
				</>
			) : (
				<PersonCardDetailsContainer
					backToListText={t("bodyDetails.backToList")}
					className="pt-6 pb-14 px-4 lg:px-34 2xl:px-78"
					href={`/about/organisation-and-governance?selectedBody=${selectedBody}`}
					selectedPerson={selectedPerson}
				/>
			)}
		</div>
	);
}
