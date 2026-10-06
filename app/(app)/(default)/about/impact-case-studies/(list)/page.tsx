import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ImpactCaseStudyList } from "#/app/(app)/(default)/about/impact-case-studies/_components/impact-case-study-list.tsx";
import { getPageBySlug } from "#/lib/data/pages.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";

interface ImpactCaseStudiesPageProps extends PageProps<"/about/impact-case-studies"> {}

/**
 * Nothing on this page depends on the request, so it is prerendered whole, and `next build` fails if a change makes any
 * of it render per request.
 */
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const page = await getPageBySlug("impact-case-studies");

	if (page == null) {
		return {};
	}

	return createMetadata({
		href: href({ pathname: "/about/impact-case-studies" }),
		title: page.title,
		description: page.summary,
		image: page.image,
	});
}

/** The first page of the case studies - see the layout. */
export default function ImpactCaseStudiesPage(_props: Readonly<ImpactCaseStudiesPageProps>): ReactNode {
	return <ImpactCaseStudyList page={1} />;
}
