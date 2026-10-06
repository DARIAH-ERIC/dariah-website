import cn from "clsx/lite";
import { SearchIcon } from "lucide-react";
import type { Metadata } from "next";
import { useExtracted as useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { type ReactNode, Suspense, useId } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { Pagination } from "#/app/(app)/(default)/_components/pagination.tsx";
import {
	CoreServiceLabel,
	ResourceLink,
	ResourceTypeBadge,
	resourceColors,
	useResourceTypeLabels,
} from "#/app/(app)/(default)/resources/_components/resource.tsx";
import {
	FacetCheckboxGroup,
	FacetCheckboxGroupSkeleton,
	type FacetCheckboxGroupValue,
} from "#/app/(app)/(default)/resources/resource-catalogue/_components/facet-checkbox-group.tsx";
import { FacetsPanel } from "#/app/(app)/(default)/resources/resource-catalogue/_components/facets-panel.tsx";
import { ResourcesSearchForm } from "#/app/(app)/(default)/resources/resource-catalogue/_components/resources-search-form.tsx";
import { searchParams } from "#/app/(app)/(default)/resources/resource-catalogue/search-params.ts";
import { ContentLayout } from "#/components/content-layout.tsx";
import { NoResults } from "#/components/no-results.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { Skeleton, SkeletonField, SkeletonShape, SkeletonText } from "#/components/ui/skeleton.tsx";
import { getNationalConsortia } from "#/lib/data/national-consortia.ts";
import { getPageBySlug } from "#/lib/data/pages.ts";
import { searchResources } from "#/lib/data/search.ts";
import { getWorkingGroups } from "#/lib/data/working-groups.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";
import type { ResourceDocument, ResourceSearchResult, ResourceType, SearchFacet } from "#/lib/search/index.ts";

interface ResourceCataloguePageProps extends PageProps<"/resources/resource-catalogue"> {}

/**
 * The results' heading, with their number - "0 results" when there are none - which the filters dialog's "See results"
 * moves focus to.
 */
const resultsId = "resources-results";

/**
 * The unfiltered catalogue is indexed page by page. A query or facet selection is not: the combinations are endless,
 * and each only reshuffles resources the unfiltered pages list already. Malformed params are answered with `notFound()`
 * here as well, so html-limited bots get a real `404` status - see `news/page.tsx`. A page past the last is not: that
 * takes a search, uncached, and metadata runs for every request, not just a bot's.
 */
export async function generateMetadata(props: Readonly<ResourceCataloguePageProps>): Promise<Metadata> {
	const page = await getPageBySlug("resource-catalogue");
	const query = searchParams.safeParse(await props.searchParams);

	if (!query.success) {
		notFound();
	}

	if (page == null) {
		return {};
	}

	const { q, type, consortium, "working-group": workingGroup } = query.output;
	const isFiltered = q !== "" || type.length > 0 || consortium.length > 0 || workingGroup.length > 0;

	return createMetadata({
		href: href({ pathname: "/resources/resource-catalogue", searchParams: searchParams.encode(query.output) }),
		title: page.title,
		description: page.summary,
		image: page.image,
		noindex: isFiltered,
	});
}

/**
 * The facets to the start side from `lg` up, the search box and the results beside them. The results' column is capped,
 * so a card's description keeps to a readable measure (`max-inline-measure`) rather than running to over 100 characters
 * a line on a wide screen: the measure, plus the card's padding and border, the gap and its "Go to resource" link. The
 * cap is on the column rather than the text, so a card does not end in empty space; what the column leaves over stays
 * at the end side of the page.
 */
const layout =
	"grid grid-cols-1 gap-y-12 pbe-24 lg:grid-cols-[16rem_minmax(0,calc(var(--container-measure)+20rem))] lg:grid-rows-[auto_1fr] lg:gap-x-columns";

export default async function ResourceCataloguePage(props: Readonly<ResourceCataloguePageProps>): Promise<ReactNode> {
	const page = await getPageBySlug("resource-catalogue");

	if (page == null) {
		notFound();
	}

	return (
		<Main className="px-main">
			<PageHeader current={href({ pathname: "/resources/resource-catalogue" })} image={page.image} title={page.title} />
			<ContentLayout
				related="quick-links"
				blocks={page.content}
				relatedEntities={page.relatedEntities}
				relatedResources={page.relatedResources}
				tableOfContents={page.showTableOfContents}
			/>
			<Suspense fallback={<ResourcesResultsSkeleton />}>
				<ResourcesResults searchParams={props.searchParams} />
			</Suspense>
		</Main>
	);
}

/**
 * The same layout as `ResourcesForm` while the results load: the search box, the facets' legends with placeholder rows -
 * or, below `lg`, the "Show filters" button - the number of results, and a few placeholder cards. The real form is not
 * rendered, as it would be replaced once the results load, dropping anything typed or checked in the meantime.
 */
function ResourcesResultsSkeleton(): ReactNode {
	const t = useTranslations();

	return (
		<Skeleton className={layout} label={t("Loading resources…")}>
			<SkeletonField className="col-span-full row-start-1 lg:col-start-2" label={t("Search resources")} />
			<SkeletonShape className="min-block-15 lg:hidden" />
			<div className="flex flex-col gap-y-10 max-lg:hidden lg:col-start-1 lg:row-span-2 lg:row-start-1">
				<FacetCheckboxGroupSkeleton label={t("Resource type")} />
				<FacetCheckboxGroupSkeleton label={t("National consortium")} />
				<FacetCheckboxGroupSkeleton label={t("Working group")} />
			</div>
			<div className="flex flex-col gap-y-8 lg:col-start-2 lg:row-start-2">
				<SkeletonText className="inline-24" />
				<div className="flex flex-col gap-y-6">
					{[0, 1, 2].map((index) => (
						<ResourceCard key={index} document={null} />
					))}
				</div>
			</div>
		</Skeleton>
	);
}

async function ResourcesResults(props: Pick<ResourceCataloguePageProps, "searchParams">): Promise<ReactNode> {
	const query = searchParams.safeParse(await props.searchParams);

	if (!query.success) {
		notFound();
	}

	const { q, type: types, consortium: nationalConsortia, "working-group": workingGroups, page } = query.output;

	const [result, consortia, activeWorkingGroups, inactiveWorkingGroups] = await Promise.all([
		searchResources({ query: q, types, nationalConsortia, workingGroups, page }),
		getNationalConsortia(),
		getWorkingGroups("active"),
		getWorkingGroups("inactive"),
	]);

	/** Facet values are knowledge-base slugs; resolve them to names, falling back to the slug for unknown ones. */
	const consortiumLabels = new Map(consortia.map((consortium) => [consortium.slug, consortium.name]));
	const workingGroupLabels = new Map(
		[...activeWorkingGroups, ...inactiveWorkingGroups].map((group) => [group.entity.slug, group.name]),
	);

	return (
		<ResourcesForm
			consortiumLabels={consortiumLabels}
			nationalConsortia={nationalConsortia}
			query={q}
			result={result}
			types={types}
			workingGroupLabels={workingGroupLabels}
			workingGroups={workingGroups}
		>
			<ResourcesList
				isFiltered={types.length > 0 || nationalConsortia.length > 0 || workingGroups.length > 0}
				query={q}
				result={result}
			/>
			{result.pagination.totalPages > 1 ? (
				<Pagination
					className="mbs-24"
					hrefFor={(page) =>
						href({
							pathname: "/resources/resource-catalogue",
							searchParams: searchParams.encode({
								q,
								type: types,
								consortium: nationalConsortia,
								"working-group": workingGroups,
								page,
							}),
						})
					}
					page={page}
					pages={result.pagination.totalPages}
				/>
			) : null}
		</ResourcesForm>
	);
}

/**
 * A `get` form, so a search is a url the user can share; results and facet counts update as the user types or toggles a
 * filter.
 *
 * From `lg` up, the facets are a column to the start side, level with the search box, and the results sit below the
 * search box, in its column. The second row takes any extra height, so a facet column taller than few results does not
 * push them away from the search box. The form wraps the results too, so the facets and the search box can sit on
 * either side of them. The spinner shares the search box label's row, at its end. Below `lg`, the facets are behind a
 * "Show filters" button, in a dialog - see `FacetsPanel`.
 */
function ResourcesForm(
	props: Readonly<{
		children: ReactNode;
		consortiumLabels: ReadonlyMap<string, string>;
		nationalConsortia: ReadonlyArray<string>;
		query: string;
		result: ResourceSearchResult;
		types: ReadonlyArray<ResourceType>;
		workingGroupLabels: ReadonlyMap<string, string>;
		workingGroups: ReadonlyArray<string>;
	}>,
): ReactNode {
	const { children, consortiumLabels, nationalConsortia, query, result, types, workingGroupLabels, workingGroups } =
		props;

	const t = useTranslations();
	const id = useId();
	const typeLabels = useResourceTypeLabels();

	const typeValues = getFacetValues(result.facets.type, types, (value) => typeLabels[value as ResourceType]);
	const consortiumValues = getFacetValues(
		result.facets.national_consortia,
		nationalConsortia,
		(value) => consortiumLabels.get(value) ?? value,
	);
	const workingGroupValues = getFacetValues(
		result.facets.working_groups,
		workingGroups,
		(value) => workingGroupLabels.get(value) ?? value,
	);

	return (
		<ResourcesSearchForm className={layout} statusClassName="col-span-full row-start-1 self-start justify-self-end">
			<div className="col-span-full row-start-1 lg:col-start-2">
				{/* Styled like the newsletter subscribe form. Padding, not a margin: hovering the label hovers the input. */}
				<label className="block font-medium pbe-2" htmlFor={`${id}-q`}>
					{t("Search resources")}
				</label>
				<div className="flex min-block-15 shadow-[0_0_4px_0_rgb(0_0_0/0.08)]">
					<div className="flex min-inline-0 flex-1 focus-within-outline-inset">
						<input
							autoComplete="off"
							className="min-inline-0 flex-1 border-be-2 border-stroke-weak bg-background-field px-4 py-2.5 outline-none hover:border-stroke-accent"
							defaultValue={query}
							id={`${id}-q`}
							maxLength={200}
							name="q"
							type="search"
						/>
					</div>
					<button
						className="relative border-2 border-stroke-accent bg-background-accent-strong px-6 text-text-inverse hover:bg-background-base hover:text-text-accent focus-visible-outline"
						type="submit"
					>
						<SearchIcon aria-hidden={true} className="size-5" />
						<span className="sr-only">{t("Search")}</span>
					</button>
				</div>
			</div>
			<FacetsPanel
				activeCount={types.length + nationalConsortia.length + workingGroups.length}
				className="lg:col-start-1 lg:row-span-2 lg:row-start-1"
				hasValues={typeValues.length > 0 || consortiumValues.length > 0 || workingGroupValues.length > 0}
				resultsId={resultsId}
				total={result.pagination.total}
			>
				<FacetCheckboxGroup
					defaultOpen={true}
					label={t("Resource type")}
					name="type"
					selected={types}
					values={typeValues}
				/>
				<FacetCheckboxGroup
					label={t("National consortium")}
					name="consortium"
					selected={nationalConsortia}
					values={consortiumValues}
				/>
				<FacetCheckboxGroup
					label={t("Working group")}
					name="working-group"
					selected={workingGroups}
					values={workingGroupValues}
				/>
			</FacetsPanel>
			<div className="lg:col-start-2 lg:row-start-2">{children}</div>
		</ResourcesSearchForm>
	);
}

/** A selected value without matches is missing from the facet counts; keep it so it can be unchecked. */
function getFacetValues(
	facet: SearchFacet | undefined,
	selected: ReadonlyArray<string>,
	getLabel: (value: string) => string,
): Array<FacetCheckboxGroupValue> {
	const values =
		facet?.values.map(({ value, count }) => {
			return { value, label: getLabel(value), count };
		}) ?? [];
	for (const value of selected) {
		if (!values.some((item) => item.value === value)) {
			values.push({ value, label: getLabel(value), count: 0 });
		}
	}

	return values;
}

/**
 * Without results, the count still heads the list, as the filters dialog's "See results" moves focus to it, with a link
 * to clear the filters, if any are set, which keeps the query.
 */
function ResourcesList(
	props: Readonly<{ isFiltered: boolean; query: string; result: ResourceSearchResult }>,
): ReactNode {
	const { isFiltered, query, result } = props;

	const t = useTranslations();

	const heading = (
		<h2 className="font-body text-body font-medium focus:outline-none" id={resultsId} tabIndex={-1}>
			{t("{total, plural, one {# result} other {# results}}", { total: result.pagination.total })}
		</h2>
	);

	if (result.items.length === 0) {
		return (
			<div className="flex flex-col gap-y-8">
				{heading}
				<NoResults
					actions={
						isFiltered
							? [
									{
										label: t("Clear filters"),
										href: href({
											pathname: "/resources/resource-catalogue",
											searchParams: searchParams.encode({
												q: query,
												type: [],
												consortium: [],
												"working-group": [],
												page: 1,
											}),
										}),
									},
								]
							: []
					}
				>
					{isFiltered
						? t("Check the spelling, or use fewer filters.")
						: t("Check the spelling, or try a broader term.")}
				</NoResults>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-y-8">
			{heading}
			<ul className="flex flex-col gap-y-6" role="list">
				{result.items.map(({ document }) => (
					<li key={document.id}>
						<ResourceCard document={document} />
					</li>
				))}
			</ul>
		</div>
	);
}

/**
 * A resource with its type, in the type's colour, whether it is a core service, its label and description, and a link
 * to where it lives.
 *
 * Without a resource, the card is its own loading skeleton: the same boxes, in a neutral colour, with placeholders for
 * the type, the label, the description and the link.
 */
function ResourceCard(props: Readonly<{ document: ResourceDocument | null }>): ReactNode {
	const { document } = props;

	if (document == null) {
		return (
			<div className="flex flex-col gap-6 border border-s-6 border-stroke-weak bg-background-base p-6 sm:flex-row sm:items-center sm:gap-x-10 sm:px-8">
				<div className="flex min-inline-0 flex-1 flex-col items-start gap-y-3">
					<SkeletonShape className="text-badge block-[calc(1lh+--spacing(2))] inline-24" />
					<SkeletonText className="inline-2/3 text-title-4 leading-heading" />
					<SkeletonText className="self-stretch leading-body" lines={3} />
				</div>
				<SkeletonShape className="min-block-12 inline-47 shrink-0" />
			</div>
		);
	}

	return (
		<article
			className={cn(
				"flex flex-col gap-6 border border-s-6 border-(--resource-border-color) border-s-(--resource-color) bg-background-base p-6 sm:flex-row sm:items-center sm:gap-x-10 sm:px-8",
				resourceColors[document.type],
			)}
		>
			<div className="flex min-inline-0 flex-1 flex-col items-start gap-y-3">
				<div className="flex flex-wrap items-center gap-x-6 gap-y-2">
					<ResourceTypeBadge type={document.type} />
					{document.type === "service" && document.kind === "core" ? <CoreServiceLabel /> : null}
				</div>
				<h3 className="text-title-4 leading-heading">{document.label}</h3>
				{document.description.length > 0 ? (
					<p className="line-clamp-3 leading-body whitespace-pre-line">{document.description}</p>
				) : null}
			</div>
			<ResourceLink className="shrink-0 self-start sm:self-center" document={document} size="small" />
		</article>
	);
}
