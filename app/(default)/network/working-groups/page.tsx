import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { WorkingGroupsTabs } from "@/components/pages/working-groups/working-groups-tabs";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";

interface WorkingGroupsPageProps extends PageProps<"/network/working-groups"> {}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("WorkingGroupsPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function WorkingGroupsPage(
	props: Readonly<WorkingGroupsPageProps>,
): Promise<ReactNode> {
	const { searchParams } = props;
	const { status = "active" } = await searchParams;

	const parsedStatus = status.toString() as "active" | "inactive" | undefined;

	const response = await client.workingGroups.list({
		status: parsedStatus,
		limit: 50,
	});
	const staticContentResponse = await client.pages.bySlug({ slug: "working-groups-list" });
	const breadcrumbs = navigation().breadcrumbs.workingGroups;

	const { data: items } = response.data;

	const {
		data: { content },
	} = staticContentResponse;

	return (
		<Main className="container flex flex-1 flex-col gap-8 xl:gap-0">
			<div className="flex flex-col gap-12 px-4 py-8 xl:px-12 2xl:px-31">
				{breadcrumbs.length > 0 && (
					<Breadcrumbs>
						{breadcrumbs.map(({ label, href }) => {
							return (
								<Breadcrumb key={label} href={href}>
									{label}
								</Breadcrumb>
							);
						})}
					</Breadcrumbs>
				)}
				<div className="gap-4 xl:columns-2 3xl:gap-x-23.5 [&>*:first-child]:pb-4 [&>*:first-child]:[column-span:all] [&>*:nth-child(2)]:mt-0!">
					<ContentBlocks fields={content} />
				</div>
			</div>
			<WorkingGroupsTabs items={items} status={parsedStatus} />
		</Main>
	);
}
