"use client";

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
import { Tab } from "@/components/ui/tabs/tab";
import { TabList } from "@/components/ui/tabs/tab-list";
import { Typography } from "@/components/ui/typography/typography";
import type { MemberOrPartner } from "@/lib/data/api-client";
import { config as socialMediaConfig } from "@/lib/social-media/social-media.config";

interface MembersAndPartnersTabsProps {
	memberOrPartner: MemberOrPartner;
}

export function MembersAndPartnersTabs(props: Readonly<MembersAndPartnersTabsProps>): ReactNode {
	const [displayAllInstitutions, setDisplayAllInstitutions] = useState(false);
	const t = useTranslations("MembersAndPartnersDetailPage");
	const {
		memberOrPartner: { name, description, socialMedia, contributors, institutions },
	} = props;

	const displayShowMoreButton = institutions.length > 10;

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

	const handleShowMoreButtonClick = () => {
		setDisplayAllInstitutions((prev) => {
			return !prev;
		});
	};

	const institutionsToDisplay = displayAllInstitutions ? institutions : institutions.slice(0, 10);

	return (
		<Tabs>
			<TabList aria-label="Tabs" className="lg:px-0!">
				<Tab id="details">{t("tabs.details")}</Tab>
				<Tab id="institutions">{t("tabs.institutions")}</Tab>
			</TabList>
			<TabPanels>
				<TabPanel id="details">
					<div className="flex flex-col px-2 py-4">
						<div className="flex flex-col w-full justify-between lg:flex-row lg:flex-wrap">
							<Typography className="uppercase" variant="h4">
								{name}
							</Typography>
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
									<div className="flex gap-6 items-center">
										<Typography variant="regular">{t("socialMedia.other")}</Typography>
										{otherSocialMedia.map((item) => {
											const Icon = socialMediaConfig[item.type].icon;
											return (
												<Link key={item.url} href={item.url} target="_blank">
													<Icon className="size-10" />
												</Link>
											);
										})}
									</div>
								)}
							</div>
						</div>
						<div>
							<ContentBlocks fields={description} />
						</div>
						<div className="flex flex-col gap-10 pt-6 pb-9">
							<Typography variant="h4">{t("contributors.title")}</Typography>
							{contributors.length > 0 ? (
								<div className="flex flex-wrap justify-center gap-x-15 gap-y-10">
									{contributors.map((contributor) => {
										const {
											id,
											name,
											position,
											image: { url: imageUrl },
										} = contributor;

										const positionNames = position
											? position.map((positionObj) => {
													return positionObj.name;
												})
											: [];

										return (
											<PersonCard
												key={id}
												imageUrl={imageUrl}
												name={name}
												position={positionNames.join(", ")}
											/>
										);
									})}
								</div>
							) : (
								<Typography variant="regular">{t("contributors.empty")}</Typography>
							)}
						</div>
					</div>
				</TabPanel>
				<TabPanel id="institutions">
					<div className="flex flex-col gap-6 pt-10">
						{institutionsToDisplay.length > 0 ? (
							<>
								{institutionsToDisplay.map((institution) => {
									const { slug, name, website } = institution;
									return (
										<Link
											key={slug}
											endIcon={<OpenInNewIcon className="size-5" />}
											href={website ?? ""}
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
							<Typography variant="regular">{t("institutions.empty")}</Typography>
						)}
					</div>
				</TabPanel>
			</TabPanels>
		</Tabs>
	);
}
