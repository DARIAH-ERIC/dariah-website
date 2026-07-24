"use client";

import { cn } from "@acdh-oeaw/style-variants";
import type { JSONContent } from "@tiptap/core";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { type ReactNode, useEffect, useRef } from "react";

import { ContentBlocks } from "@/components/content-blocks";
import { NavLink } from "@/components/navigation";
import { GovernanceBodyTag } from "@/components/ui/governance-body-card/governance-body-tag";
import { CloseIcon } from "@/components/ui/icons/close";
import { Link } from "@/components/ui/link/link";
import { PersonCard } from "@/components/ui/person-card/person-card";
import { PersonCardDetails } from "@/components/ui/person-card/person-card-details";
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

	useEffect(() => {
		if (!userListRef.current) return;

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
						{selectedBodyVariant}
					</Typography>
					<div className="flex gap-2">
						<Typography>{selectedBodyItem.acronym}</Typography>
						<Typography>{selectedBody}</Typography>
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
						<Typography className="font-bold" variant="regular">
							{t("bodyDetails.membersCount", {
								count: selectedBodyItem.persons.length.toString(),
							})}
						</Typography>
					</div>
					<div className="flex flex-wrap gap-10 py-6 px-4 lg:px-34 2xl:px-45 3xl:px-78">
						{usersForSelectedBody.length > 0 &&
							usersForSelectedBody.map((user) => {
								const { id, name, positions, slug, image: userImage } = user;

								const { url: imageUrl } = userImage ?? { url: null };

								return (
									<PersonCard
										key={id}
										href={`/about/organisation-and-governance?selectedBody=${selectedBody}&selectedUser=${slug}`}
										imageUrl={imageUrl}
										name={name}
										position={positions}
									/>
								);
							})}
					</div>
				</>
			) : (
				<div className="flex flex-col flex-wrap gap-10 pt-6 pb-14 px-4 lg:px-34 2xl:px-78">
					<Link
						href={`/about/organisation-and-governance?selectedBody=${selectedBody}`}
						variant="primary"
						withDefaultLeftIcon={true}
					>
						{t("bodyDetails.backToList")}
					</Link>
					<PersonCardDetails
						description={
							selectedPerson.biography.find((content) => {
								return content.type === "rich_text";
							}) as JSONContent
						}
						email={selectedPerson.email ?? undefined}
						imageUrl={selectedPerson.image?.url}
						name={selectedPerson.name}
						position={selectedPerson.positions}
					/>
				</div>
			)}
		</div>
	);
}
