import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { type ReactNode, Suspense } from "react";

import {
	FundingCallList,
	FundingCallListSkeleton,
} from "#/app/(app)/(default)/get-involved/funding-calls/_components/funding-call-list.tsx";
import { getFundingCallsPage } from "#/lib/data/funding-calls.ts";
import { getPageBySlug } from "#/lib/data/pages.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";
import { pageSegmentParams, parsePageSegment } from "#/lib/navigation/page-segment.ts";

interface FundingCallsListPageProps extends PageProps<"/get-involved/funding-calls/page/[page]"> {}

/**
 * Every page the list has at build time, as on the news list (see
 * `app/(app)/(default)/news/(list)/page/[page]/page.tsx`).
 */
/**
 * A link's prefetch of this page - the pagination's, with `prefetch={true}` - is served from static output, never
 * rendered per request. Not `"navigation"`: a page number not known at build time is answered with the route's skeleton
 * while it is generated, rather than holding up the navigation.
 */
export const ensureStatic = "prefetch";

export async function generateStaticParams(): Promise<Array<{ page: string }>> {
	const list = await getFundingCallsPage(1);

	return pageSegmentParams(list?.pages ?? 1);
}

/**
 * Each page of the list is its own canonical url. A malformed or out-of-range page is answered with `notFound()` here
 * as well as in the page, as on the news list.
 */
export async function generateMetadata(props: Readonly<FundingCallsListPageProps>): Promise<Metadata> {
	const { page } = await props.params;

	const number = parsePageSegment(page);

	if (number == null || (await getFundingCallsPage(number)) == null) {
		notFound();
	}

	const content = await getPageBySlug("funding-calls");

	if (content == null) {
		return {};
	}

	return createMetadata({
		href: href({ pathname: "/get-involved/funding-calls/page/[page]", params: { page } }),
		title: content.title,
		description: content.summary,
		image: content.image,
	});
}

/**
 * A later page of the funding calls - see the layout. The list depends on the page, so it streams in behind its
 * skeleton.
 */
export default function FundingCallsListPage(props: Readonly<FundingCallsListPageProps>): ReactNode {
	return (
		<Suspense fallback={<FundingCallListSkeleton />}>
			<FundingCallListForParams params={props.params} />
		</Suspense>
	);
}

async function FundingCallListForParams(props: Pick<FundingCallsListPageProps, "params">): Promise<ReactNode> {
	const page = parsePageSegment((await props.params).page);

	if (page == null) {
		notFound();
	}

	return <FundingCallList page={page} />;
}
