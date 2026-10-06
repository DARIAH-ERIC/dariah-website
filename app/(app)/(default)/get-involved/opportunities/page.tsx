import cn from "clsx/lite";
import { ExternalLinkIcon } from "lucide-react";
import type { Metadata } from "next";
import { useExtracted as useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Fragment, type ReactNode, Suspense, useId } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { Pagination } from "#/app/(app)/(default)/_components/pagination.tsx";
import { OpportunitiesFilterForm } from "#/app/(app)/(default)/get-involved/opportunities/_components/opportunities-filter-form.tsx";
import {
	opportunitySources,
	opportunityStatuses,
	searchParams,
} from "#/app/(app)/(default)/get-involved/opportunities/search-params.ts";
import opportunitiesImage from "#/assets/images/opportunities.png";
import { Breadcrumbs } from "#/components/breadcrumbs.tsx";
import { ContentBlocks } from "#/components/content-blocks.tsx";
import { DateRange } from "#/components/date-range.tsx";
import { Image } from "#/components/image.tsx";
import { NoResults } from "#/components/no-results.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Select } from "#/components/ui/select.tsx";
import { Skeleton, SkeletonField, SkeletonShape, SkeletonText } from "#/components/ui/skeleton.tsx";
import { today } from "#/lib/data/events.ts";
import {
	type ListedOpportunity,
	type OpportunitySource,
	type OpportunityStatus,
	getOpportunitiesPage,
	getOpportunityStatus,
} from "#/lib/data/opportunities.ts";
import { getPageBySlug } from "#/lib/data/pages.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href, unsafeHref } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

interface OpportunitiesPageProps extends PageProps<"/get-involved/opportunities"> {}

/**
 * Each page of the unfiltered list is its own canonical url, so later pages are not folded into the first; a filtered
 * list is not indexed, as it only lists opportunities the unfiltered pages list already. A malformed or out-of-range
 * page is answered with `notFound()` here as well as in the page: html-limited bots (see `htmlLimitedBots` - Bingbot
 * and link previews, not Googlebot, which renders the page) get metadata before the response starts, so for them that
 * is still a real `404` status, where the page's own call, inside a Suspense boundary, comes too late for anything but
 * a `noindex`.
 */
export async function generateMetadata(props: Readonly<OpportunitiesPageProps>): Promise<Metadata> {
	const page = await getPageBySlug("opportunities");
	const query = searchParams.safeParse(await props.searchParams);

	if (!query.success || (await getOpportunitiesPage(query.output)) == null) {
		notFound();
	}

	if (page == null) {
		return {};
	}

	const { status, source } = query.output;

	return createMetadata({
		href: href({ pathname: "/get-involved/opportunities", searchParams: searchParams.encode(query.output) }),
		title: page.title,
		description: page.summary,
		image: page.image,
		noindex: status != null || source != null,
	});
}

/** The cards are capped at the reading measure, as a content page's text is, so their summaries stay readable. */
const listClassName = "max-inline-measure";

/**
 * The title, the image, the filters and the list keep to `px-main`, as the breadcrumbs and every other list page do;
 * the title to the design's 1100px column (`max-inline-title`), as a page header's. Spaced as a page header (see
 * `PageHeader`).
 *
 * The image is served from the app itself rather than taken from the api's page, as the design has it. It is
 * decorative: the title says what the page is. The page's content, if any, follows the image, kept to a readable
 * measure.
 */
export default async function OpportunitiesPage(props: Readonly<OpportunitiesPageProps>): Promise<ReactNode> {
	const page = await getPageBySlug("opportunities");

	if (page == null) {
		notFound();
	}

	return (
		<Main className="px-main pbs-8 pbe-24">
			<Breadcrumbs current={href({ pathname: "/get-involved/opportunities" })} label={page.title} />
			<h1 className="mbs-14 max-inline-title text-title-1">{page.title}</h1>
			<Image
				alt=""
				className="mbs-12 block-auto inline-full"
				fetchPriority="high"
				loading="eager"
				sizes="(min-width: 48rem) min(90vw, 88rem), calc(100vw - 3rem)"
				src={opportunitiesImage}
			/>
			<ContentBlocks blocks={page.content} className="mbs-12 max-inline-measure" />
			<div className="mbs-20">
				<Suspense fallback={<OpportunitiesResultsSkeleton />}>
					<OpportunitiesResults searchParams={props.searchParams} />
				</Suspense>
			</div>
		</Main>
	);
}

async function OpportunitiesResults(props: Pick<OpportunitiesPageProps, "searchParams">): Promise<ReactNode> {
	const query = searchParams.safeParse(await props.searchParams);

	if (!query.success) {
		notFound();
	}

	const { status, source } = query.output;

	const list = await getOpportunitiesPage(query.output);

	if (list == null) {
		notFound();
	}

	/** Each item's status is relative to today, so it is worked out here, outside the cached list. */
	await connection();
	const now = today();
	const items = list.items.map((opportunity) => {
		return { opportunity, status: getOpportunityStatus(opportunity, now) };
	});

	return (
		<OpportunitiesForm source={source} status={status}>
			<OpportunitiesList isFiltered={status != null || source != null} list={items} total={list.total} />
			{list.pages > 1 ? (
				<Pagination
					className="mbs-16"
					hrefFor={(page) =>
						href({
							pathname: "/get-involved/opportunities",
							searchParams: searchParams.encode({ status, source, page }),
						})
					}
					page={list.page}
					pages={list.pages}
					prefetch={true}
				/>
			) : null}
		</OpportunitiesForm>
	);
}

/**
 * A `get` form, so a filtered list is a url the user can share; the list updates as soon as a filter changes. The form
 * wraps the results too, so the spinner can sit between the filters and the list, at its end.
 *
 * The filters are native selects, styled like the search page's category: the form submits their values as they are.
 * Without javascript, a change does not submit, so a submit button stands in for it.
 */
/**
 * The same layout as `OpportunitiesResults` while the list loads: the filters, with their labels and a box for each
 * select, the number of results, and a few placeholder cards.
 */
function OpportunitiesResultsSkeleton(): ReactNode {
	const t = useTranslations();

	return (
		<Skeleton className="grid grid-cols-1 gap-y-16" label={t("Loading opportunities…")}>
			<div className="flex flex-wrap items-end gap-x-columns gap-y-6">
				<SkeletonField className="inline-full sm:inline-100" label={t("Availability")} />
				<SkeletonField className="inline-full sm:inline-100" label={t("Source")} />
			</div>
			<div className={listClassName}>
				<SkeletonText className="inline-32 text-title-4" />
				<div className="mbs-8 flex flex-col gap-y-4">
					{[0, 1, 2].map((index) => (
						<OpportunityCard key={index} opportunity={null} />
					))}
				</div>
			</div>
		</Skeleton>
	);
}

function OpportunitiesForm(
	props: Readonly<{ children: ReactNode; source?: OpportunitySource; status?: OpportunityStatus }>,
): ReactNode {
	const { children, source, status } = props;

	const t = useTranslations();
	const statusLabels = useStatusLabels();
	const sourceLabels = useSourceLabels();

	return (
		<OpportunitiesFilterForm
			className="grid grid-cols-1 gap-y-16"
			statusClassName="col-start-1 row-start-1 self-end justify-self-end pbe-5"
		>
			<div className="col-start-1 row-start-1 flex flex-wrap items-end gap-x-columns gap-y-6">
				<FilterSelect
					allLabel={t("All")}
					label={t("Availability")}
					labels={statusLabels}
					name="status"
					value={status}
					values={opportunityStatuses}
				/>
				<FilterSelect
					allLabel={t("All sources")}
					label={t("Source")}
					labels={sourceLabels}
					name="source"
					value={source}
					values={opportunitySources}
				/>
			</div>
			<div className="row-start-2">{children}</div>
		</OpportunitiesFilterForm>
	);
}

function FilterSelect<T extends string>(
	props: Readonly<{
		allLabel: string;
		label: string;
		labels: Record<T, string>;
		name: string;
		value: T | undefined;
		values: ReadonlyArray<T>;
	}>,
): ReactNode {
	const { allLabel, label, labels, name, value, values } = props;

	return (
		<Select
			className="inline-full sm:inline-100"
			defaultValue={value ?? ""}
			label={label}
			name={name}
			options={[
				{ id: "", label: allLabel },
				...values.map((value) => {
					return { id: value, label: labels[value] };
				}),
			]}
			variant="field"
		/>
	);
}

/**
 * Without results, the count still heads the list, so the page's outline doesn't change, with a link to clear the
 * filters, if any are set.
 */
function OpportunitiesList(
	props: Readonly<{ isFiltered: boolean; list: Array<ListedOpportunity>; total: number }>,
): ReactNode {
	const { isFiltered, list, total } = props;

	const t = useTranslations();

	const heading = <h2 className="text-title-4">{t("{total, plural, one {# result} other {# results}}", { total })}</h2>;

	if (list.length === 0) {
		return (
			<section className={listClassName}>
				{heading}
				<NoResults
					actions={
						isFiltered
							? [{ label: t("Show all opportunities"), href: href({ pathname: "/get-involved/opportunities" }) }]
							: []
					}
					className="mbs-8"
				>
					{isFiltered
						? t("There are no opportunities matching these filters.")
						: t("There are no opportunities at the moment.")}
				</NoResults>
			</section>
		);
	}

	return (
		<section className={listClassName}>
			{heading}
			<ul className="mbs-8 flex flex-col gap-y-4" role="list">
				{list.map((item) => (
					<li key={item.opportunity.id}>
						<OpportunityCard {...item} />
					</li>
				))}
			</ul>
		</section>
	);
}

/**
 * The title, then the status, the source and the dates it runs between in a row, then the summary, cut off after three
 * lines. An external opportunity with a website links there, with an icon saying so; every other one to its own page.
 *
 * DARIAH's own opportunities are highlighted, with an accent edge, as in the design, so they stand out from external
 * ones at a glance; an external one is set on a subtle gray background instead, so every card is a box, and its text is
 * inset by the card's padding rather than from nothing. The title's link stretches over the whole card, and is
 * underlined on hover, as a card's title is elsewhere (see `EventCard`); its focus outline is drawn on the card's box.
 *
 * Without an opportunity, the card is its own loading skeleton: the same boxes, with placeholders for the title, the
 * badges, the dates and the summary.
 */
function OpportunityCard(props: Readonly<ListedOpportunity | { opportunity: null; status?: never }>): ReactNode {
	const { opportunity, status } = props;

	const t = useTranslations();
	const headingId = useId();

	if (opportunity == null) {
		return (
			<div className="flex flex-col gap-y-4 border-s-6 border-transparent bg-background-subtle px-6 py-8">
				<SkeletonText className="font-heading text-title-5 leading-heading" lines={{ base: 3, sm: 2, lg: 2 }} />
				<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-caption">
					<SkeletonShape className="text-badge block-[calc(1lh+--spacing(1))] inline-16" />
					<SkeletonShape className="text-badge block-[calc(1lh+--spacing(1))] inline-16" />
					<SkeletonText className="inline-48" />
				</div>
				<SkeletonText className="leading-body" lines={3} />
			</div>
		);
	}

	const website = opportunity.source.source === "external" ? opportunity.website : null;

	return (
		<article
			aria-labelledby={headingId}
			className={cn(
				"relative flex flex-col gap-y-4 border-s-6 px-6 py-8",
				opportunity.source.source === "dariah"
					? "border-stroke-strong bg-background-callout"
					: "border-transparent bg-background-subtle",
			)}
		>
			<h3 className="font-heading text-title-5 leading-heading" id={headingId}>
				<Link
					className="underline-offset-4 outline-none after:absolute after:inset-0 hover:underline focus-visible:after:outline-3 focus-visible:after:outline-offset-2 focus-visible:after:outline-focus-outline focus-visible:after:outline-solid"
					href={
						website != null
							? unsafeHref(website, true)
							: href({ pathname: "/get-involved/opportunities/[slug]", params: { slug: opportunity.entity.slug } })
					}
					prefetch="intent"
				>
					{opportunity.title}
					{website != null ? (
						<Fragment>
							<span className="sr-only"> {t("(external website)")}</span>
							<ExternalLinkIcon aria-hidden={true} className="ms-3 inline size-5 align-[-0.125em] text-icon-accent" />
						</Fragment>
					) : null}
				</Link>
			</h3>
			<div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-caption">
				<StatusBadge status={status} />
				<SourceBadge source={opportunity.source.source} />
				<DateRange end={opportunity.duration.end} start={opportunity.duration.start} />
			</div>
			<p className="line-clamp-3 leading-body text-text-weak">{opportunity.summary}</p>
		</article>
	);
}

/** An open opportunity stands out, highlighted; an upcoming or closed one does not. */
function StatusBadge(props: Readonly<{ status: OpportunityStatus }>): ReactNode {
	const { status } = props;

	const labels = useStatusLabels();

	return <Badge tone={status === "open" ? "highlight" : "muted"}>{labels[status]}</Badge>;
}

function SourceBadge(props: Readonly<{ source: OpportunitySource }>): ReactNode {
	const { source } = props;

	const labels = useSourceLabels();

	return <Badge tone={source === "dariah" ? "accent" : "muted"}>{labels[source]}</Badge>;
}

function useStatusLabels(): Record<OpportunityStatus, string> {
	const t = useTranslations();

	return {
		open: t("Open"),
		upcoming: t("Upcoming"),
		closed: t("Closed"),
	};
}

function useSourceLabels(): Record<OpportunitySource, string> {
	const t = useTranslations();

	return {
		dariah: t("DARIAH"),
		external: t("External"),
	};
}
