"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { TabPanel, TabPanels, Tabs } from "react-aria-components";

import { Tab } from "@/components/ui/tabs/tab";
import { TabList } from "@/components/ui/tabs/tab-list";
import { WorkingGroupCard } from "@/components/ui/working-group-card/working-group-card";

interface WorkingGroupsTabsProps {
	items: Array<{
		id: string;
		name: string;
		image: {
			readonly id: string;
			readonly url: string;
			readonly license: {
				id: string;
				name: string;
				url: string;
			};
		};
	}>;
}

export function WorkingGroupsTabs(props: Readonly<WorkingGroupsTabsProps>): ReactNode {
	const { items } = props;
	const t = useTranslations("WorkingGroupsPage");

	return (
		<Tabs>
			<TabList aria-label="Tabs">
				<Tab id="active">{t("tabs.active")}</Tab>
				<Tab id="past">{t("tabs.past")}</Tab>
			</TabList>
			<TabPanels>
				<TabPanel id="active">
					<ul
						className="flex flex-wrap justify-center gap-5 pt-10 pb-20 px-4 bg-gray-100 lg:pb-40 lg:gap-y-20 xl:px-38"
						role="list"
					>
						{items.map((item) => {
							const { id, image, name } = item;

							const href = `/network/working-groups/${id}`;

							return <WorkingGroupCard key={id} href={href} imageUrl={image.url} title={name} />;
						})}
					</ul>
				</TabPanel>
				<TabPanel id="past">
					<ul
						className="flex flex-wrap justify-center gap-5 pt-10 pb-40 px-4 bg-gray-100 xl:px-38 lg:gap-y-20"
						role="list"
					>
						{items.toReversed().map((item) => {
							const { id, image, name } = item;

							const href = `/network/working-groups/${id}`;

							return <WorkingGroupCard key={id} href={href} imageUrl={image.url} title={name} />;
						})}
					</ul>
				</TabPanel>
			</TabPanels>
		</Tabs>
	);
}
