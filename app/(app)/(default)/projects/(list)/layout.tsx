import { getExtracted as getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { TabNavigation } from "#/app/(app)/(default)/_components/tab-navigation.tsx";
import { ContentBlocks } from "#/components/content-blocks.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { getPageBySlug } from "#/lib/data/pages.ts";
import { href } from "#/lib/navigation/href.ts";

interface ProjectsLayoutProps extends LayoutProps<"/projects"> {}

/**
 * The active projects are listed at `/projects` and the past ones at `/projects/inactive`, each a static route, so both
 * are prerendered whole, and each list has a single url. The header, the content and the status tabs are shared, here,
 * so they are not remounted when switching tabs - see `TabNavigation`.
 *
 * The page's content flows in two columns from `lg` up, set larger than a content page's body text, as an introduction
 * to the projects below rather than a text to read at length - as on the impact case studies page. A paragraph is never
 * split across the columns.
 *
 * The tab bar's rule and the panel's background run the page's full width, so only the header and content are inset.
 */
export default async function ProjectsLayout(props: Readonly<ProjectsLayoutProps>): Promise<ReactNode> {
	const { children } = props;

	const t = await getTranslations();
	const page = await getPageBySlug("projects");

	if (page == null) {
		notFound();
	}

	return (
		<Main>
			<div className="px-main">
				<PageHeader current={href({ pathname: "/projects" })} image={page.image} title={page.title} />
				<ContentBlocks
					blocks={page.content}
					className="gap-x-gutter lg:columns-2 [&_.prose]:text-lead [&_.prose]:font-regular [&_.prose]:leading-body [&_.prose_p]:break-inside-avoid"
				/>
			</div>
			<TabNavigation
				className="mbs-16"
				label={t("Project status")}
				tabs={[
					{
						segment: null,
						label: t("Active Projects"),
						href: href({ pathname: "/projects" }),
					},
					{
						segment: "inactive",
						label: t("Past Projects"),
						href: href({ pathname: "/projects/inactive" }),
					},
				]}
			/>
			{children}
		</Main>
	);
}
