import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode, Suspense } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { ContentLayout } from "#/components/content-layout.tsx";
import { DateRange } from "#/components/date-range.tsx";
import { PageHeader, PageHeaderSkeleton } from "#/components/page-header.tsx";
import { getFundingCallBySlug, getFundingCallSlugs } from "#/lib/data/funding-calls.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";

interface FundingCallPageProps extends PageProps<"/get-involved/funding-calls/[slug]"> {}

/**
 * A link's prefetch of this page - see `Link`'s `prefetch="intent"` - is served from static output, never rendered per
 * request. Every slug known at build time is prerendered; for one that is not, the prefetch holds the skeleton.
 */
export const ensureStatic = "prefetch";

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
	const slugs = await getFundingCallSlugs();

	return slugs.map((slug) => {
		return { slug };
	});
}

/**
 * An unknown slug is answered with `notFound()` here as well as in the page: html-limited bots (see `htmlLimitedBots`)
 * get metadata before the response starts, so for them that is a real `404` status, where the page's own call, inside a
 * Suspense boundary, comes too late for anything but a `noindex`.
 */
export async function generateMetadata(props: Readonly<FundingCallPageProps>): Promise<Metadata> {
	const { slug } = await props.params;

	const item = await getFundingCallBySlug(slug);

	if (item == null) {
		notFound();
	}

	return createMetadata({
		href: href({ pathname: "/get-involved/funding-calls/[slug]", params: { slug } }),
		title: item.title,
		description: item.summary,
		image: item.image,
	});
}

/**
 * The page depends on the slug, so it streams in behind the header's skeleton. The skeleton is the route's app shell,
 * which a link to any such page prefetches, so following one shows it at once; a slug known at build time is
 * prerendered whole.
 *
 * There is no featured image: what a reader comes for is the dates and the details, which a banner would push down. The
 * image is still the page's social preview image (see `generateMetadata`).
 */
export default function FundingCallPage(props: Readonly<FundingCallPageProps>): ReactNode {
	return (
		<Main className="px-main">
			<Suspense
				fallback={
					<PageHeaderSkeleton
						parent={href({ pathname: "/get-involved/funding-calls" })}
						titleLines={{ base: 3, sm: 2, lg: 1 }}
					/>
				}
			>
				<FundingCallContent params={props.params} />
			</Suspense>
		</Main>
	);
}

async function FundingCallContent(props: Pick<FundingCallPageProps, "params">): Promise<ReactNode> {
	const { slug } = await props.params;

	const item = await getFundingCallBySlug(slug);

	if (item == null) {
		notFound();
	}

	return (
		<Fragment>
			<PageHeader
				current={href({ pathname: "/get-involved/funding-calls/[slug]", params: { slug } })}
				image={null}
				parent={href({ pathname: "/get-involved/funding-calls" })}
				title={item.title}
			/>
			<ContentLayout
				related="quick-links"
				meta={<DateRange className="font-bold" end={item.duration.end} start={item.duration.start} />}
				blocks={item.content}
				relatedEntities={item.relatedEntities}
				relatedResources={item.relatedResources}
				tableOfContents={item.showTableOfContents}
			/>
		</Fragment>
	);
}
