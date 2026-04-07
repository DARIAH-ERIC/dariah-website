"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { TabPanel, TabPanels, Tabs } from "react-aria-components";

import { ContentBlocks } from "@/components/content-blocks";
import { OpenInNewIcon } from "@/components/ui/icons/open-in-new";
import { Link } from "@/components/ui/link/link";
import { Tab } from "@/components/ui/tabs/tab";
import { TabList } from "@/components/ui/tabs/tab-list";
import { Typography } from "@/components/ui/typography/typography";
import type { MemberOrPartner } from "@/lib/data/api-client";
import { config as socialMediaConfig } from "@/lib/social-media/social-media.config";

interface MembersAndPartnersTabsProps {
	memberOrPartner: MemberOrPartner;
}

export function MembersAndPartnersTabs(props: Readonly<MembersAndPartnersTabsProps>): ReactNode {
	const t = useTranslations("MembersAndPartnersDetailPage");
	const {
		memberOrPartner: { name, description, socialMedia },
	} = props;

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

	return (
		<Tabs>
			<TabList aria-label="Tabs" className="lg:px-0!">
				<Tab id="details">{t("tabs.details")}</Tab>
				<Tab id="institutions">{t("tabs.institutions")}</Tab>
			</TabList>
			<TabPanels>
				<TabPanel id="details">
					<div className="flex flex-col px-2 py-4">
						<div className="flex w-full justify-between">
							<Typography className="uppercase" variant="h4">
								{name}
							</Typography>
							<div className="flex gap-6">
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
									<>
										<Typography variant="regular">{t("socialMedia.other")}</Typography>
										{otherSocialMedia.map((item) => {
											const Icon = socialMediaConfig[item.type].icon;
											return (
												<Link key={item.url} href={item.url} target="_blank">
													<Icon className="size-10" />
												</Link>
											);
										})}
									</>
								)}
							</div>
						</div>
						<div>
							<ContentBlocks fields={description} />
						</div>
						<div className="flex flex-col gap-10 pt-6 pb-9">
							<Typography variant="h4">{t("contributors.title")}</Typography>
							<Typography variant="regular">{t("contributors.empty")}</Typography>
						</div>
					</div>
				</TabPanel>
				<TabPanel id="institutions">
					<div className="flex flex-col gap-6 pt-10">
						<Typography variant="regular">{t("institutions.empty")}</Typography>
					</div>
				</TabPanel>
			</TabPanels>
		</Tabs>
	);
}
