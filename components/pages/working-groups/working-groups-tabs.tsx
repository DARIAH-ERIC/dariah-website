"use client";

import { assert } from "@acdh-oeaw/lib";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { TabPanel, TabPanels, Tabs } from "react-aria-components";

import { Tab } from "@/components/ui/tabs/tab";
import { TabList } from "@/components/ui/tabs/tab-list";
import { Typography } from "@/components/ui/typography/typography";
import { WorkingGroupCard } from "@/components/ui/working-group-card/working-group-card";
import type { WorkingGroupList } from "@/lib/data/api-client";

interface WorkingGroupsTabsProps {
	items: WorkingGroupList["data"];
	status: "active" | "inactive" | undefined;
}

export function WorkingGroupsTabs(props: Readonly<WorkingGroupsTabsProps>): ReactNode {
	const { items, status } = props;
	const t = useTranslations("WorkingGroupsPage");
	const selectedKey = status === "inactive" ? "inactive" : "active";

	return (
		<Tabs selectedKey={selectedKey}>
			<TabList aria-label="Tabs">
				<Tab href={selectedKey === "inactive" ? "/network/working-groups" : undefined} id="active">
					{t("tabs.active")}
				</Tab>
				<Tab
					href={selectedKey !== "inactive" ? "/network/working-groups?status=inactive" : undefined}
					id="inactive"
				>
					{t("tabs.past")}
				</Tab>
			</TabList>
			<TabPanels>
				<TabPanel id="active">
					{items.length > 0 ? (
						<ul
							className="grid justify-center gap-5 pt-10 pb-20 px-4 bg-gray-100 md:grid-cols-2 lg:gap-8 lg:grid-cols-3 lg:pb-40 xl:grid-cols-4 xl:w-fit xl:mx-auto xl:justify-start 2xl:gap-y-20 3xl:px-38"
							role="list"
						>
							{items.map((item) => {
								const { id, image, name, entity } = item;
								assert(image);
								const href = `/network/working-groups/${entity.slug}`;

								return <WorkingGroupCard key={id} href={href} imageUrl={image.url} title={name} />;
							})}
						</ul>
					) : (
						<div className="flex flex-wrap justify-center gap-5 pt-10 pb-40 px-4 bg-gray-100 xl:px-38 lg:gap-y-20 2xl:justify-start">
							<Typography variant="regular">{t("emptyState.active")}</Typography>
						</div>
					)}
				</TabPanel>
				<TabPanel id="inactive">
					{items.length > 0 ? (
						<ul
							className="grid justify-center gap-5 pt-10 pb-20 px-4 bg-gray-100 md:grid-cols-2 lg:gap-8 lg:grid-cols-3 lg:pb-40 xl:grid-cols-4 xl:w-fit xl:mx-auto xl:justify-start 2xl:gap-y-20 3xl:px-38"
							role="list"
						>
							{items.map((item) => {
								const { id, image, name, entity } = item;
								assert(image);
								const href = `/network/working-groups/${entity.slug}`;

								return <WorkingGroupCard key={id} href={href} imageUrl={image.url} title={name} />;
							})}
						</ul>
					) : (
						<div className="flex flex-wrap justify-center gap-5 pt-10 pb-40 px-4 bg-gray-100 xl:px-38 lg:gap-y-20 2xl:justify-start">
							<Typography variant="regular">{t("emptyState.past")}</Typography>
						</div>
					)}
				</TabPanel>
			</TabPanels>
		</Tabs>
	);
}
