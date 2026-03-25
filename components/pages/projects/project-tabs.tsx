"use client";

import { assert } from "@acdh-oeaw/lib";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { TabPanel, TabPanels, Tabs } from "react-aria-components";

import { Project } from "@/components/ui/project/project";
import { Tab } from "@/components/ui/tabs/tab";
import { TabList } from "@/components/ui/tabs/tab-list";
import type { ProjectList } from "@/lib/data/api-client";

interface ProjectTabsProps {
	items: ProjectList["data"];
}

export function ProjectTabs(props: Readonly<ProjectTabsProps>): ReactNode {
	const t = useTranslations("ProjectsPage");
	const { items } = props;

	return (
		<Tabs>
			<TabList aria-label="Tabs">
				<Tab id="active">{t("tabs.active")}</Tab>
				<Tab id="past">{t("tabs.past")}</Tab>
			</TabList>
			<TabPanels>
				<TabPanel id="active">
					<ul
						className="flex flex-wrap justify-center gap-5 pt-10 pb-40 px-4 bg-gray-100 xl:px-38 lg:gap-y-20"
						role="list"
					>
						{items.map((item) => {
							const { duration, entity, image, name } = item;
							const { slug } = entity;
							const href = `/projects/${slug}`;
							assert(duration.end);
							assert(image);
							const endDate = new Date(duration.end);
							const startDate = new Date(duration.start);

							return (
								<Project
									key={slug}
									endDate={endDate}
									href={href}
									imageUrl={image.url}
									startDate={startDate}
									title={name}
									type={"Beneficiary"}
								/>
							);
						})}
					</ul>
				</TabPanel>
				<TabPanel id="past">
					<ul
						className="flex flex-wrap justify-center gap-5 pt-10 pb-40 px-4 bg-gray-100 xl:px-38 lg:gap-y-20"
						role="list"
					>
						{items.toReversed().map((item) => {
							const { duration, entity, image, name } = item;
							const { slug } = entity;
							const href = `/projects/${slug}`;
							assert(duration.end);
							assert(image);
							const endDate = new Date(duration.end);
							const startDate = new Date(duration.start);

							return (
								<Project
									key={slug}
									endDate={endDate}
									href={href}
									imageUrl={image.url}
									startDate={startDate}
									title={name}
									type={"Beneficiary"}
								/>
							);
						})}
					</ul>
				</TabPanel>
			</TabPanels>
		</Tabs>
	);
}
