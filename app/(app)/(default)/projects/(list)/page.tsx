import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";

import { PageTopScrollTarget } from "#/app/(app)/(default)/_components/page-top-scroll-target.tsx";
import { ProjectList } from "#/app/(app)/(default)/projects/_components/project-list.tsx";
import { getPageBySlug } from "#/lib/data/pages.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";

interface ActiveProjectsPageProps extends PageProps<"/projects"> {}

/**
 * Nothing on this page depends on the request, so it is prerendered whole, and `next build` fails if a change makes any
 * of it render per request.
 */
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const page = await getPageBySlug("projects");

	if (page == null) {
		return {};
	}

	return createMetadata({
		href: href({ pathname: "/projects" }),
		title: page.title,
		description: page.summary,
		image: page.image,
	});
}

/** The active projects - see the layout. */
export default function ActiveProjectsPage(_props: Readonly<ActiveProjectsPageProps>): ReactNode {
	return (
		<Fragment>
			<PageTopScrollTarget />
			<ProjectList status="active" />
		</Fragment>
	);
}
