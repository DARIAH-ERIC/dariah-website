import type { Metadata } from "next";
import { getExtracted as getTranslations } from "next-intl/server";
import { Fragment, type ReactNode } from "react";

import { PageTopScrollTarget } from "#/app/(app)/(default)/_components/page-top-scroll-target.tsx";
import { WorkingGroupList } from "#/app/(app)/(default)/network/working-groups/_components/working-group-list.tsx";
import { getPageBySlug } from "#/lib/data/pages.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";

interface PastWorkingGroupsPageProps extends PageProps<"/network/working-groups/inactive"> {}

/** Titled after the tab, so it is not a duplicate of the active working groups' title. */
/**
 * Nothing on this page depends on the request, so it is prerendered whole, and `next build` fails if a change makes any
 * of it render per request.
 */
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations();
	const page = await getPageBySlug("working-groups");

	if (page == null) {
		return {};
	}

	return createMetadata({
		href: href({ pathname: "/network/working-groups/inactive" }),
		title: t("Past Working Groups"),
		description: page.summary,
		image: page.image,
	});
}

/** The past working groups - see the layout. */
export default function PastWorkingGroupsPage(_props: Readonly<PastWorkingGroupsPageProps>): ReactNode {
	return (
		<Fragment>
			<PageTopScrollTarget />
			<WorkingGroupList status="inactive" />
		</Fragment>
	);
}
