"use client";

import { assert } from "@acdh-oeaw/lib";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { type ReactNode, useEffect, useRef } from "react";
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
	const searchParams = useSearchParams();
	const currentStatusParam = searchParams.get("status");
	const { items, status } = props;
	const t = useTranslations("WorkingGroupsPage");
	const selectedKey = status === "inactive" ? "inactive" : "active";

	const firstActiveCardRef = useRef<HTMLAnchorElement | null>(null);
	const firstInactiveCardRef = useRef<HTMLAnchorElement | null>(null);

	useEffect(() => {
		if (currentStatusParam === "null" || !["active", "past"].includes(currentStatusParam ?? ""))
			return;

		if (currentStatusParam === "active" && firstActiveCardRef.current !== null) {
			firstActiveCardRef.current.focus();
		}

		if (currentStatusParam === "past" && firstInactiveCardRef.current !== null) {
			firstInactiveCardRef.current.focus();
		}
	}, [currentStatusParam]);

	return (
		<Tabs keyboardActivation="manual" selectedKey={selectedKey}>
			<TabList aria-label="Tabs">
				<Tab
					href={selectedKey === "inactive" ? "/network/working-groups?status=active" : undefined}
					id="active"
				>
					<Typography className="text-small font-body" variant="h2">
						{t("tabs.active")}
					</Typography>
				</Tab>
				<Tab
					href={selectedKey !== "inactive" ? "/network/working-groups?status=past" : undefined}
					id="inactive"
				>
					<Typography className="text-small font-body" variant="h2">
						{t("tabs.past")}
					</Typography>
				</Tab>
			</TabList>
			<TabPanels>
				<TabPanel className="bg-gray-100" id="active">
					{items.length > 0 ? (
						<ul
							className="grid justify-center gap-5 pt-10 pb-20 px-4 md:grid-cols-2 lg:gap-8 lg:grid-cols-3 lg:pb-40 xl:grid-cols-4 xl:w-fit xl:mx-auto xl:justify-start 2xl:gap-y-20 3xl:px-38"
							role="list"
						>
							{items.map((item, index) => {
								const { id, image, name, entity } = item;
								assert(image);
								const href = `/network/working-groups/${entity.slug}`;

								const isFirst = index === 0;

								return (
									<WorkingGroupCard
										key={id}
										ref={isFirst ? firstActiveCardRef : undefined}
										href={href}
										image={image}
										tabIndex={isFirst ? 0 : undefined}
										title={name}
									/>
								);
							})}
						</ul>
					) : (
						<div className="flex flex-wrap justify-center gap-5 pt-10 pb-40 px-4 bg-gray-100 xl:px-38 lg:gap-y-20 2xl:justify-start">
							<Typography variant="regular">{t("emptyState.active")}</Typography>
						</div>
					)}
				</TabPanel>
				<TabPanel className="bg-gray-100" id="inactive">
					{items.length > 0 ? (
						<ul
							className="grid justify-center gap-5 pt-10 pb-20 px-4 md:grid-cols-2 lg:gap-8 lg:grid-cols-3 lg:pb-40 xl:grid-cols-4 xl:w-fit xl:mx-auto xl:justify-start 2xl:gap-y-20 3xl:px-38"
							role="list"
						>
							{items.map((item, index) => {
								const { id, image, name, entity } = item;
								assert(image);
								const href = `/network/working-groups/${entity.slug}`;

								const isFirst = index === 0;

								return (
									<WorkingGroupCard
										key={id}
										ref={isFirst ? firstInactiveCardRef : undefined}
										href={href}
										image={image}
										tabIndex={isFirst ? 0 : undefined}
										title={name}
									/>
								);
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
