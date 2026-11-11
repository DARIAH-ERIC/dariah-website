import type { Metadata } from "next";
import { useExtracted as useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode, Suspense } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { useOpportunityDeadline } from "#/app/(app)/(default)/get-involved/opportunities/_components/opportunity-deadline.tsx";
import { ContentLayout } from "#/components/content-layout.tsx";
import { PageHeader, PageHeaderSkeleton } from "#/components/page-header.tsx";
import type { Opportunity } from "#/lib/api/schemas.ts";
import { getOpportunityBySlug, getOpportunitySlugs } from "#/lib/data/opportunities.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href, unsafeHref } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

interface OpportunityPageProps extends PageProps<"/get-involved/opportunities/[slug]"> {}

/**
 * A link's prefetch of this page - see `Link`'s `prefetch="intent"` - is served from static output, never rendered per
 * request. Every slug known at build time is prerendered; for one that is not, the prefetch holds the skeleton.
 */
export const ensureStatic = "prefetch";

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
	const slugs = await getOpportunitySlugs();

	return slugs.map((slug) => {
		return { slug };
	});
}

/**
 * An unknown slug is answered with `notFound()` here as well as in the page: html-limited bots (see `htmlLimitedBots`)
 * get metadata before the response starts, so for them that is a real `404` status, where the page's own call, inside a
 * Suspense boundary, comes too late for anything but a `noindex`.
 */
export async function generateMetadata(props: Readonly<OpportunityPageProps>): Promise<Metadata> {
	const { slug } = await props.params;

	const item = await getOpportunityBySlug(slug);

	if (item == null) {
		notFound();
	}

	return createMetadata({
		href: href({ pathname: "/get-involved/opportunities/[slug]", params: { slug } }),
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
export default function OpportunityPage(props: Readonly<OpportunityPageProps>): ReactNode {
	return (
		<Main className="px-main">
			<Suspense
				fallback={
					<PageHeaderSkeleton
						parent={href({ pathname: "/get-involved/opportunities" })}
						titleLines={{ base: 4, sm: 2, lg: 2 }}
					/>
				}
			>
				<OpportunityContent params={props.params} />
			</Suspense>
		</Main>
	);
}

async function OpportunityContent(props: Pick<OpportunityPageProps, "params">): Promise<ReactNode> {
	const { slug } = await props.params;

	const item = await getOpportunityBySlug(slug);

	if (item == null) {
		notFound();
	}

	return (
		<Fragment>
			<PageHeader
				current={href({ pathname: "/get-involved/opportunities/[slug]", params: { slug } })}
				image={null}
				parent={href({ pathname: "/get-involved/opportunities" })}
				title={item.title}
			/>
			<ContentLayout
				related="quick-links"
				meta={<OpportunityFacts item={item} />}
				blocks={item.content}
				relatedEntities={item.relatedEntities}
				relatedResources={item.relatedResources}
				tableOfContents={item.showTableOfContents}
			/>
		</Fragment>
	);
}

/**
 * The deadline and the website, each a term beside its value, as an event's facts are (see `EventFacts`): the deadline,
 * or the day it opens when there is none (see `useOpportunityDeadline`), then the website, when there is one, spelled
 * out, so a reader sees where it leads.
 */
function OpportunityFacts(props: Readonly<{ item: Opportunity }>): ReactNode {
	const { item } = props;

	const t = useTranslations();
	const deadline = useOpportunityDeadline(item.duration);

	const facts: Array<{ term: string; value: ReactNode }> = [{ term: deadline.term, value: deadline.date }];

	if (item.website != null) {
		facts.push({
			term: t("Website"),
			value: (
				<Link
					className="font-medium break-all text-text-accent underline focus-visible-outline hover:no-underline"
					href={unsafeHref(item.website, true)}
				>
					{item.website}
				</Link>
			),
		});
	}

	return (
		<dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-8 gap-y-3">
			{facts.map((fact) => (
				<div key={fact.term} className="col-span-full grid grid-cols-subgrid">
					<dt className="font-bold text-text-strong">{fact.term}</dt>
					<dd>{fact.value}</dd>
				</div>
			))}
		</dl>
	);
}
