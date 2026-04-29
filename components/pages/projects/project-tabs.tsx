"use client";

import { assert, includes } from "@acdh-oeaw/lib";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { TabPanel, TabPanels, Tabs } from "react-aria-components";

import { Project } from "@/components/ui/project/project";
import { Tab } from "@/components/ui/tabs/tab";
import { TabList } from "@/components/ui/tabs/tab-list";
import type { ProjectList } from "@/lib/data/api-client";

interface ProjectTabsProps {
	items: ProjectList["data"];
	status: "active" | "inactive" | undefined;
}

export function ProjectTabs(props: Readonly<ProjectTabsProps>): ReactNode {
	const t = useTranslations("ProjectsPage");
	const { items, status } = props;

	return (
		<Tabs defaultSelectedKey={status === "inactive" ? "inactive" : "active"}>
			<TabList aria-label="Tabs">
				<Tab href={status === "inactive" ? "/projects" : null} id="active">
					{t("tabs.active")}
				</Tab>
				<Tab href={status !== "inactive" ? "/projects?status=inactive" : null} id="inactive">
					{t("tabs.past")}
				</Tab>
			</TabList>
			<TabPanels>
				<TabPanel id="active">
					<ul
						className="flex flex-wrap justify-center gap-5 pt-10 pb-40 px-4 bg-gray-100 xl:px-38 lg:gap-y-20"
						role="list"
					>
						{items.map((item) => {
							const { duration, entity, image, name, role } = item;
							const { slug } = entity;
							const href = `/projects/${slug}`;
							assert(duration.end);
							assert(image);
							assert(includes(["coordinator", "participant"] as const, role));

							return (
								<Project
									key={slug}
									endDate={duration.end}
									href={href}
									imageUrl={image.url}
									startDate={duration.start}
									title={name}
									type={role}
								/>
							);
						})}
					</ul>
				</TabPanel>
				<TabPanel id="inactive">
					<ul
						className="flex flex-wrap justify-center gap-5 pt-10 pb-40 px-4 bg-gray-100 xl:px-38 lg:gap-y-20"
						role="list"
					>
						{items.toReversed().map((item) => {
							const { duration, entity, image, name, role } = item;
							const { slug } = entity;
							const href = `/projects/${slug}`;
							assert(duration.end);
							assert(image);
							assert(includes(["coordinator", "participant"] as const, role));

							return (
								<Project
									key={slug}
									endDate={duration.end}
									href={href}
									imageUrl={image.url}
									startDate={duration.start}
									title={name}
									type={role}
								/>
							);
						})}
					</ul>
				</TabPanel>
			</TabPanels>
		</Tabs>
	);
}
