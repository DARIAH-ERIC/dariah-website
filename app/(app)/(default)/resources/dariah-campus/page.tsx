import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { LatestResources } from "#/app/(app)/(default)/resources/_components/latest-resources.tsx";
import logoDariahCampus from "#/assets/images/logo-dariah-campus.svg";
import { ContentLayout } from "#/components/content-layout.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { getPageBySlug } from "#/lib/data/pages.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";

interface DariahCampusPageProps extends PageProps<"/resources/dariah-campus"> {}

/**
 * Nothing on this page depends on the request, so it is prerendered whole, and `next build` fails if a change makes any
 * of it render per request.
 */
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const page = await getPageBySlug("dariah-campus");

	if (page == null) {
		return {};
	}

	return createMetadata({
		href: href({ pathname: "/resources/dariah-campus" }),
		title: page.title,
		description: page.summary,
	});
}

export default async function DariahCampusPage(_props: Readonly<DariahCampusPageProps>): Promise<ReactNode> {
	const page = await getPageBySlug("dariah-campus");

	if (page == null) {
		notFound();
	}

	return (
		<Main className="px-main">
			<PageHeader
				current={href({ pathname: "/resources/dariah-campus" })}
				image={null}
				logo={logoDariahCampus}
				title={page.title}
			/>
			<ContentLayout
				related="quick-links"
				blocks={page.content}
				relatedEntities={page.relatedEntities}
				relatedResources={page.relatedResources}
				tableOfContents={page.showTableOfContents}
			/>
			<LatestResources source="dariah-campus" upstreamUrl="https://campus.dariah.eu/resources" />
		</Main>
	);
}
