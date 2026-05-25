import { cn } from "@acdh-oeaw/style-variants";
import type { JSONContent } from "@tiptap/core";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { OrganisationContainer } from "@/components/pages/organisation-and-governance/organisation-container";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { GovernanceBodyTag } from "@/components/ui/governance-body-card/governance-body-tag";
import { CloseIcon } from "@/components/ui/icons/close";
import { InfoIcon } from "@/components/ui/icons/info";
import { Link } from "@/components/ui/link/link";
import { NavLink } from "@/components/ui/link/nav-link";
import { PersonCard } from "@/components/ui/person-card/person-card";
import { PersonCardDetails } from "@/components/ui/person-card/person-card-details";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import type { GovernanceBody } from "@/types/governance-body";
import {
	getColorsForGovernanceVariant,
	getGovernanceRelationships,
	getGovernanceVariant,
	getNameAcronym,
} from "@/utils/organisation-and-governance.utils";

interface ContactPageSearchParams {
	selectedBody?: GovernanceBody;
	selectedUser?: string;
}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("OrganisationAndGovernance");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function ContactPage({
	searchParams,
}: Readonly<{
	searchParams: Promise<ContactPageSearchParams>;
}>): Promise<ReactNode> {
	const params = await searchParams;
	const { selectedBody, selectedUser } = params;
	const t = await getTranslations("OrganisationAndGovernance");
	const personTranslations = await getTranslations("(default).PersonCard");

	const response = await client.governanceBodies.list();
	const breadcrumbs = navigation().breadcrumbs.organisationAndGovernance;

	const { data: selectedPerson } =
		selectedUser !== undefined ? await client.persons.bySlug({ slug: selectedUser }) : {};

	const selectedBodyVariant =
		selectedBody !== undefined ? getGovernanceVariant(selectedBody) : undefined;

	const { bg: selectedBodyBgColor, border: selectedBodyBorderColor } =
		selectedBodyVariant !== undefined ? getColorsForGovernanceVariant(selectedBodyVariant) : {};

	const {
		data: { data: items },
	} = response;

	const selectedBodyItem = items.find((item) => {
		return item.entity.slug === selectedBody;
	});

	const selectedBodyRelationships = selectedBodyItem
		? getGovernanceRelationships(selectedBodyItem.entity.slug as GovernanceBody)
		: [];

	const usersForSelectedBody = selectedBodyItem?.persons ?? [];

	return (
		<Main className="container flex flex-col mb-16 relative lg:gap-0 lg:mb-0">
			<div className="flex flex-1 flex-col gap-8 px-4 pt-8 lg:px-8 lg:pb-12 xl:px-20 2xl:px-40">
				{breadcrumbs.length > 0 && (
					<Breadcrumbs>
						{breadcrumbs.map(({ label, href }) => {
							return (
								<Breadcrumb key={label} href={href}>
									{label}
								</Breadcrumb>
							);
						})}
					</Breadcrumbs>
				)}
				<Typography className="text-[45px] font-light" variant="h2">
					{t("title")}
				</Typography>
			</div>
			<div className="py-12 px-4 flex flex-col gap-14 lg:px-34 2xl:px-78">
				<Typography variant="h3">{t("description.header")}</Typography>
				<Typography className="whitespace-pre-line">{t("description.part1")}</Typography>
			</div>
			<div className="flex flex-col gap-2">
				<div className="py-2 flex gap-2 bg-gray-100 shadow-light justify-center items-center w-full">
					<InfoIcon className="size-4" />
					<Typography className="text-[15px]" variant="small">
						{t("infoText")}
					</Typography>
				</div>
				<div>
					<OrganisationContainer governanceBodies={items} />
				</div>
			</div>
			{selectedBody && (
				<div className="relative">
					<div className="absolute -top-10" id="userList" />
					<div
						className={cn(
							"w-full px-4 py-3 flex justify-between text-white! lg:px-34 2xl:px-78",
							selectedBodyBgColor,
						)}
					>
						<div className="flex flex-col gap-2">
							<Typography className="uppercase" variant="caption">
								{selectedBodyVariant}
							</Typography>
							<div className="flex gap-2">
								<Typography>{getNameAcronym(selectedBody)}</Typography>
								<Typography>{selectedBody}</Typography>
							</div>
						</div>
						<NavLink href="/about/organisation-and-governance">
							<CloseIcon className="fill-white! size-10!" />
						</NavLink>
					</div>
					{selectedPerson === undefined ? (
						<>
							<div className="flex flex-col gap-4 py-6 px-4 lg:px-34 2xl:px-78">
								<Typography className={cn("border-l-4", selectedBodyBorderColor)} variant="regular">
									{selectedBodyItem?.summary}
								</Typography>
								<div className="flex flex-wrap gap-6">
									{selectedBodyRelationships.map((relationship) => {
										return <GovernanceBodyTag key={relationship} relationship={relationship} />;
									})}
								</div>
								<Typography className="font-bold" variant="regular">
									{t("bodyDetails.membersCount", {
										count: selectedBodyItem?.persons.length.toString() ?? "0",
									})}
								</Typography>
							</div>
							<div className="flex flex-wrap gap-10 py-6 px-4 lg:px-34 2xl:px-78">
								{usersForSelectedBody.length > 0 &&
									usersForSelectedBody.map((user) => {
										const {
											id,
											name,
											position,
											slug,
											image: { url: imageUrl },
										} = user;

										const positionNames = position
											? position.map((positionObj) => {
													const { role, name } = positionObj;

													return personTranslations(`roles.${role}`, {
														name,
													});
												})
											: [];
										return (
											<PersonCard
												key={id}
												href={`/about/organisation-and-governance?selectedBody=${selectedBody}&selectedUser=${slug}#userList`}
												imageUrl={imageUrl}
												name={name}
												position={positionNames.join(", ")}
											/>
										);
									})}
							</div>
						</>
					) : (
						<div className="flex flex-col flex-wrap gap-10 pt-6 pb-14 px-4 lg:px-34 2xl:px-78">
							<Link
								href={`/about/organisation-and-governance?selectedBody=${selectedBody}#userList`}
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
								imageUrl={selectedPerson.image.url}
								name={selectedPerson.name}
								position={
									selectedPerson.position
										?.map((pos) => {
											return pos.name;
										})
										.join(", ") ?? undefined
								}
							/>
						</div>
					)}
				</div>
			)}
		</Main>
	);
}
