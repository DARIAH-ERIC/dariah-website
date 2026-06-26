"use client";

import { cn } from "@acdh-oeaw/style-variants";
import type { JSONContent } from "@tiptap/core";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";
import { TabPanel, TabPanels, Tabs } from "react-aria-components";

import { ContentBlocks } from "@/components/content-blocks";
import { Button } from "@/components/ui/button/button";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { ChevronUpIcon } from "@/components/ui/icons/chevron-up";
import { OpenInNewIcon } from "@/components/ui/icons/open-in-new";
import { Link } from "@/components/ui/link/link";
import { PersonCard } from "@/components/ui/person-card/person-card";
import { PersonCardDetails } from "@/components/ui/person-card/person-card-details";
import { Tab } from "@/components/ui/tabs/tab";
import { TabList } from "@/components/ui/tabs/tab-list";
import { Typography } from "@/components/ui/typography/typography";
import type { components } from "@/lib/api/types";
import type { MemberOrPartner, Person } from "@/lib/data/api-client";
import { config as socialMediaConfig } from "@/lib/social-media/social-media.config";
import { getGrouppedPersonMembers } from "@/utils/global.utils";

interface MembersAndPartnersTabsProps {
	memberOrPartner:
		| components["schemas"]["MemberOrObserver"]
		| components["schemas"]["CooperatingPartner"];
	selectedPerson?: Person;
}

export function MembersAndPartnersTabs(props: Readonly<MembersAndPartnersTabsProps>): ReactNode {
	const [displayAllInstitutions, setDisplayAllInstitutions] = useState(false);
	const t = useTranslations("MembersAndPartnersDetailPage");

	const pathname = usePathname();

	const { memberOrPartner, selectedPerson } = props;

	const { description, socialMedia, institutions, status } = memberOrPartner;

	const displayShowMoreButton = institutions.length > 10;
	const isCooperatingPartner = status === "is_cooperating_partner_of";
	const isMemberCountry = status === "is_member_of";

	let contributors, nationalCoordinatingInstitution, nationalRepresentativeInstitution;

	if (
		"contributors" in memberOrPartner &&
		"nationalCoordinatingInstitution" in memberOrPartner &&
		"nationalRepresentativeInstitution" in memberOrPartner
	) {
		contributors = memberOrPartner.contributors;
		nationalCoordinatingInstitution = memberOrPartner.nationalCoordinatingInstitution;
		nationalRepresentativeInstitution = memberOrPartner.nationalRepresentativeInstitution;
	}

	const { website, otherSocialMedia } = socialMedia.reduce(
		(acc, item) => {
			if (item.type === "website") {
				acc.website = item;
			} else {
				acc.otherSocialMedia.push(item);
			}
			return acc;
		},
		{
			website: undefined as MemberOrPartner["socialMedia"][number] | undefined,
			otherSocialMedia: [] as MemberOrPartner["socialMedia"],
		},
	);

	const grouppedContributors =
		contributors !== undefined ? getGrouppedPersonMembers(contributors) : undefined;
	const grouppedContributorsKeys = [
		"national_coordinator",
		"national_coordinator_deputy",
		"national_representative",
		"national_representative_deputy",
	];

	otherSocialMedia.sort((socialMediaA, socialMediaB) => {
		return socialMediaA.type.localeCompare(socialMediaB.type);
	});

	const handleShowMoreButtonClick = () => {
		setDisplayAllInstitutions((prev) => {
			return !prev;
		});
	};

	const institutionsToDisplay = displayAllInstitutions ? institutions : institutions.slice(0, 10);

	return (
		<Tabs>
			<TabList aria-label="Tabs" className="lg:px-0!">
				{isMemberCountry && <Tab id="details">{t("tabs.details")}</Tab>}
				<Tab id="institutions">
					{isCooperatingPartner ? t("tabs.cooperatingPartners") : t("tabs.partnerInstitutions")}
				</Tab>
			</TabList>
			<TabPanels>
				{isMemberCountry && (
					<TabPanel id="details">
						<div className="flex flex-col px-2 py-4">
							<div className="flex flex-col w-full justify-between lg:flex-row lg:flex-wrap">
								<div className="flex flex-col gap-x-6 lg:items-center lg:flex-row lg:flex-wrap">
									{website && (
										<Link
											endIcon={<OpenInNewIcon className="size-5" />}
											href={website.url}
											target="_blank"
											variant="primary"
										>
											{t("socialMedia.website")}
										</Link>
									)}
									{otherSocialMedia.length > 0 && (
										<div className="flex gap-4 items-center">
											<Typography variant="regular">{t("socialMedia.other")}</Typography>
											<div className="flex gap-4 items-center flex-wrap">
												{otherSocialMedia.map((item) => {
													const { type, url, name } = item;
													const Icon = socialMediaConfig[type].icon;
													return (
														<Link
															key={url}
															aria-label={name}
															className="group focus:border-b-2 focus:py-1.5"
															href={url}
															target="_blank"
														>
															<Icon
																className={cn(
																	"size-5",
																	type !== "website" && type !== "other"
																		? "fill-gray-700 group-hover:fill-primary"
																		: "stroke-gray-700 group-hover:stroke-primary",
																)}
															/>
														</Link>
													);
												})}
											</div>
										</div>
									)}
								</div>
							</div>
							<div>
								<ContentBlocks fields={description} />
							</div>
							<div className="pt-6 flex flex-col gap-2">
								{nationalCoordinatingInstitution && (
									<div className="flex gap-1">
										<Typography className="font-bold" variant="regular">
											{t("institutions.nationalCoordinatingInstitution")}
										</Typography>
										<Typography variant="regular">
											{nationalCoordinatingInstitution.name}
										</Typography>
									</div>
								)}
								{nationalRepresentativeInstitution && (
									<div className="flex gap-1">
										<Typography className="font-bold" variant="regular">
											{t("institutions.nationalRepresentativeInstitution")}
										</Typography>
										<Typography variant="regular">
											{nationalRepresentativeInstitution.name}
										</Typography>
									</div>
								)}
							</div>
							<div className="flex flex-col gap-10 pt-6 pb-9 relative">
								<div className="absolute -top-20" id="contributors" />
								<Typography variant="h4">{t("contributors.title")}</Typography>
								{!selectedPerson ? (
									grouppedContributorsKeys.length > 0 ? (
										<div className="flex flex-wrap gap-x-15 gap-y-10">
											{grouppedContributorsKeys.map((contributorGroupKey) => {
												if (
													grouppedContributors === undefined ||
													grouppedContributors[contributorGroupKey]?.length === 0 ||
													grouppedContributors[contributorGroupKey] === undefined
												)
													return null;

												return (
													<div key={contributorGroupKey} className="flex flex-col flex-wrap gap-6">
														<div className="flex flex-col justify-between h-10">
															<Typography className="font-bold" variant="small">
																{t(
																	`contributors.groups.${
																		contributorGroupKey as
																			| "national_coordinator"
																			| "national_coordinator_deputy"
																			| "national_representative"
																			| "national_representative_deputy"
																	}`,
																)}
															</Typography>
															<hr className="w-17.5 h-0.5 border-t-2 border-gray-200" />
														</div>
														<div className="flex flex-wrap justify-between gap-6">
															{grouppedContributors[contributorGroupKey].map((contributor) => {
																const {
																	id,
																	name,
																	position,
																	image: contributorImage,
																	slug,
																} = contributor;

																const { url: imageUrl } = contributorImage ?? { url: null };

																return (
																	<PersonCard
																		key={id}
																		href={`${pathname}?person=${slug}#contributors`}
																		imageUrl={imageUrl}
																		name={name}
																		position={position}
																	/>
																);
															})}
														</div>
													</div>
												);
											})}
										</div>
									) : (
										<Typography variant="regular">{t("contributors.empty")}</Typography>
									)
								) : (
									<div className="flex flex-col flex-wrap gap-10 w-full">
										<Link
											href={`${pathname}#contributors`}
											variant="primary"
											withDefaultLeftIcon={true}
										>
											{t("contributors.backToList")}
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
						</div>
					</TabPanel>
				)}
				<TabPanel id="institutions">
					<div className="flex flex-col gap-6 pt-10 pb-80">
						{nationalCoordinatingInstitution &&
							(nationalCoordinatingInstitution.website !== null ? (
								<Link
									endIcon={<OpenInNewIcon className="size-5" />}
									href={nationalCoordinatingInstitution.website}
									variant="paragraph"
								>
									{nationalCoordinatingInstitution.name}
								</Link>
							) : (
								<Typography className="w-fit cursor-default" variant="regular">
									{nationalCoordinatingInstitution.name}
								</Typography>
							))}
						{institutionsToDisplay.length > 0 ? (
							<>
								{institutionsToDisplay.map((institution) => {
									const { slug, name, website } = institution;

									if (website === null) {
										return (
											<Typography key={slug} className="w-fit cursor-default" variant="regular">
												{name}
											</Typography>
										);
									}

									return (
										<Link
											key={slug}
											endIcon={<OpenInNewIcon className="size-5" />}
											href={website}
											variant="paragraph"
										>
											{name}
										</Link>
									);
								})}
								{displayShowMoreButton && (
									<Button
										endIcon={
											displayAllInstitutions ? (
												<ChevronUpIcon className="size-5" />
											) : (
												<ChevronDownIcon className="size-5" />
											)
										}
										onClick={handleShowMoreButtonClick}
										variant="link-primary"
									>
										{displayAllInstitutions ? t("showLess") : t("showMore")}
									</Button>
								)}
							</>
						) : (
							<Typography variant="regular">
								{isCooperatingPartner
									? t("empty.cooperatingPartners")
									: t("empty.partnerInstitutions")}
							</Typography>
						)}
					</div>
				</TabPanel>
			</TabPanels>
		</Tabs>
	);
}
