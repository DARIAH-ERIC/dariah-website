"use client";

import { assert } from "@acdh-oeaw/lib";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { TabPanel, TabPanels, Tabs } from "react-aria-components";

import { Tab } from "@/components/ui/tabs/tab";
import { TabList } from "@/components/ui/tabs/tab-list";
import { WorkingGroupCard } from "@/components/ui/working-group-card/working-group-card";
import type { WorkingGroupList } from "@/lib/data/api-client";

interface WorkingGroupsTabsProps {
	items: WorkingGroupList["data"];
	status: "active" | "inactive" | undefined;
}

export function WorkingGroupsTabs(props: Readonly<WorkingGroupsTabsProps>): ReactNode {
	const { items, status } = props;
	const t = useTranslations("WorkingGroupsPage");

	return (
		<Tabs defaultSelectedKey={status === "inactive" ? "inactive" : "active"}>
			<TabList aria-label="Tabs">
				<Tab href={status === "inactive" ? "/network/working-groups" : null} id="active">
					{t("tabs.active")}
				</Tab>
				<Tab
					href={status !== "inactive" ? "/network/working-groups?status=inactive" : null}
					id="inactive"
				>
					{t("tabs.past")}
				</Tab>
			</TabList>
			<TabPanels>
				<TabPanel id="active">
					<ul
						className="flex flex-wrap justify-center gap-5 pt-10 pb-20 px-4 bg-gray-100 lg:pb-40 lg:gap-y-20 xl:px-38"
						role="list"
					>
						{items.map((item) => {
							const { id, image, name, entity } = item;
							assert(image);
							const href = `/network/working-groups/${entity.slug}`;

							return <WorkingGroupCard key={id} href={href} imageUrl={image.url} title={name} />;
						})}
					</ul>
				</TabPanel>
				<TabPanel id="inactive">
					<ul
						className="flex flex-wrap justify-center gap-5 pt-10 pb-40 px-4 bg-gray-100 xl:px-38 lg:gap-y-20"
						role="list"
					>
						{items.toReversed().map((item) => {
							const { id, image, name, entity } = item;
							assert(image);
							const href = `/network/working-groups/${entity.slug}`;

							return <WorkingGroupCard key={id} href={href} imageUrl={image.url} title={name} />;
						})}
					</ul>
				</TabPanel>
			</TabPanels>
		</Tabs>
	);
}
