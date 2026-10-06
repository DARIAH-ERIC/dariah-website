import { getExtracted as getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { TabNavigation } from "#/app/(app)/(default)/_components/tab-navigation.tsx";
import { ContentBlocks } from "#/components/content-blocks.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { getPageBySlug } from "#/lib/data/pages.ts";
import { href } from "#/lib/navigation/href.ts";

interface WorkingGroupsLayoutProps extends LayoutProps<"/network/working-groups"> {}

/**
 * Split into a static route per status, as the projects are, with the header, content and tab bar set as on the
 * projects page - see `app/(app)/(default)/projects/(list)/layout.tsx`.
 */
export default async function WorkingGroupsLayout(props: Readonly<WorkingGroupsLayoutProps>): Promise<ReactNode> {
	const { children } = props;

	const t = await getTranslations();
	const page = await getPageBySlug("working-groups");

	if (page == null) {
		notFound();
	}

	return (
		<Main>
			<div className="px-main">
				<PageHeader current={href({ pathname: "/network/working-groups" })} image={page.image} title={page.title} />
				<ContentBlocks
					blocks={page.content}
					className="gap-x-gutter lg:columns-2 [&_.prose]:text-lead [&_.prose]:font-regular [&_.prose]:leading-body [&_.prose_p]:break-inside-avoid"
				/>
			</div>
			<TabNavigation
				className="mbs-16"
				label={t("Working group status")}
				tabs={[
					{
						segment: null,
						label: t("Active Working Groups"),
						href: href({ pathname: "/network/working-groups" }),
					},
					{
						segment: "inactive",
						label: t("Past Working Groups"),
						href: href({ pathname: "/network/working-groups/inactive" }),
					},
				]}
			/>
			{children}
		</Main>
	);
}
