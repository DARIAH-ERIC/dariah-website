import type { Metadata } from "next";
import type { ReactNode } from "react";

import { FundingCallList } from "#/app/(app)/(default)/get-involved/funding-calls/_components/funding-call-list.tsx";
import { getPageBySlug } from "#/lib/data/pages.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";

interface FundingCallsPageProps extends PageProps<"/get-involved/funding-calls"> {}

/**
 * A link's prefetch of this page is served from static output, never rendered per request. Not `"navigation"`: a call's
 * status is relative to today, and renders per request (see `FundingCallStatusBadge`).
 */
export const ensureStatic = "prefetch";

export async function generateMetadata(): Promise<Metadata> {
	const page = await getPageBySlug("funding-calls");

	if (page == null) {
		return {};
	}

	return createMetadata({
		href: href({ pathname: "/get-involved/funding-calls" }),
		title: page.title,
		description: page.summary,
		image: page.image,
	});
}

/** The first page of the funding calls - see the layout. */
export default function FundingCallsPage(_props: Readonly<FundingCallsPageProps>): ReactNode {
	return <FundingCallList page={1} />;
}
