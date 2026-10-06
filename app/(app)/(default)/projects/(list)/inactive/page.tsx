import type { Metadata } from "next";
import { getExtracted as getTranslations } from "next-intl/server";
import { Fragment, type ReactNode } from "react";

import { PageTopScrollTarget } from "#/app/(app)/(default)/_components/page-top-scroll-target.tsx";
import { ProjectList } from "#/app/(app)/(default)/projects/_components/project-list.tsx";
import { getPageBySlug } from "#/lib/data/pages.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";

interface PastProjectsPageProps extends PageProps<"/projects/inactive"> {}

/** Titled after the tab, so it is not a duplicate of the active projects' title. */
/**
 * Nothing on this page depends on the request, so it is prerendered whole, and `next build` fails if a change makes any
 * of it render per request.
 */
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations();
	const page = await getPageBySlug("projects");

	if (page == null) {
		return {};
	}

	return createMetadata({
		href: href({ pathname: "/projects/inactive" }),
		title: t("Past Projects"),
		description: page.summary,
		image: page.image,
	});
}

/** The past projects - see the layout. */
export default function PastProjectsPage(_props: Readonly<PastProjectsPageProps>): ReactNode {
	return (
		<Fragment>
			<PageTopScrollTarget />
			<ProjectList status="inactive" />
		</Fragment>
	);
}
