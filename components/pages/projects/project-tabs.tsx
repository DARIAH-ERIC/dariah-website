"use client";

import type { ReactNode } from "react";
import { TabPanel, TabPanels, Tabs } from "react-aria-components";

import { Project } from "@/components/ui/project/project";
import { Tab } from "@/components/ui/tabs/tab";
import { TabList } from "@/components/ui/tabs/tab-list";

interface ProjectTabsProps {
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
		startDate: Date;
		endDate: Date;
		slug: string;
		publishedAt: Date;
	}>;
}

export function ProjectTabs(props: Readonly<ProjectTabsProps>): ReactNode {
	const { items } = props;

	return (
		<Tabs>
			<TabList aria-label="Tabs">
				<Tab id="active">{"Active Projects"}</Tab>
				<Tab id="past">{"Past Projects"}</Tab>
			</TabList>
			<TabPanels>
				<TabPanel id="active">
					<ul
						className="flex flex-wrap justify-center gap-5 pt-10 pb-40 px-4 bg-gray-100 xl:px-38 lg:gap-y-20"
						role="list"
					>
						{items.map((item) => {
							const { endDate, image, name, slug, startDate } = item;

							const href = `/projects/${slug}`;

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
							const { endDate, image, name, slug, startDate } = item;

							const href = `/projects/${slug}`;

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
