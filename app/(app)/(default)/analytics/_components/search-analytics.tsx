import { useFormatter, useExtracted as useTranslations } from "next-intl";
import { type ReactNode, useId } from "react";

import {
	useOpportunitySourceLabels,
	useOpportunityStatusLabels,
} from "#/app/(app)/(default)/get-involved/opportunities/_components/labels.ts";
import { useResourceTypeLabels } from "#/app/(app)/(default)/resources/_components/resource.tsx";
import { useWebsiteTypeLabels } from "#/app/(app)/(default)/search/_components/type-labels.ts";
import { Skeleton, SkeletonShape } from "#/components/ui/skeleton.tsx";
import type { SearchPage } from "#/lib/analytics/search.ts";
import {
	type PageSearchAnalytics,
	getSearchAnalytics,
	minKeywordVisits,
	searchAnalyticsDays,
} from "#/lib/data/analytics.ts";
import { getNationalConsortia } from "#/lib/data/national-consortia.ts";
import { getWorkingGroups } from "#/lib/data/working-groups.ts";

/** Pages without a search box, whose searches are not reported. */
const pagesWithoutKeywords = new Set<SearchPage>(["opportunities"]);

/**
 * Searches and filters per list page over the last `searchAnalyticsDays` days: the number of searches and how many
 * found nothing, the most searched keywords, and the filter values selected most often. Keywords are listed only when
 * searched in a few visits at least: they are free text, and the page is public. Pages with nothing tracked yet are
 * left out.
 *
 * Filter values are slugs in Matomo; they are shown with their names, falling back to the slug for one no longer known.
 */
export async function SearchAnalytics(): Promise<ReactNode> {
	const [pages, consortia, activeWorkingGroups, inactiveWorkingGroups] = await Promise.all([
		getSearchAnalytics(),
		getNationalConsortia(),
		getWorkingGroups("active"),
		getWorkingGroups("inactive"),
	]);

	if (pages == null) {
		return null;
	}

	const names = {
		consortium: new Map(consortia.map((consortium) => [consortium.slug, consortium.name])),
		"working-group": new Map(
			[...activeWorkingGroups, ...inactiveWorkingGroups].map((group) => [group.entity.slug, group.name]),
		),
	};

	return <SearchAnalyticsContent names={names} pages={pages} />;
}

interface SearchAnalyticsContentProps {
	names: Readonly<Record<"consortium" | "working-group", ReadonlyMap<string, string>>>;
	pages: ReadonlyArray<PageSearchAnalytics>;
}

function SearchAnalyticsContent(props: Readonly<SearchAnalyticsContentProps>): ReactNode {
	const { names, pages } = props;

	const t = useTranslations();
	const id = useId();

	const pagesWithData = pages.filter((page) => page.searches > 0 || page.filters.length > 0);

	return (
		<section aria-labelledby={`${id}-heading`} className="flex flex-col gap-y-8">
			<h2 className="text-title-2" id={`${id}-heading`}>
				{t("Searches and filters")}
			</h2>
			<p>
				{t(
					"How the website search, the Resource Catalogue and the opportunities' filters were used over the past {days} days. Search terms are listed only when searched in at least {visits} visits.",
					{ days: String(searchAnalyticsDays), visits: String(minKeywordVisits) },
				)}
			</p>
			{pagesWithData.length > 0 ? (
				pagesWithData.map((page) => <PageSearches key={page.page} names={names} page={page} />)
			) : (
				<p className="text-text-weak">{t("No searches or filters have been tracked yet.")}</p>
			)}
		</section>
	);
}

function PageSearches(
	props: Readonly<{ names: SearchAnalyticsContentProps["names"]; page: PageSearchAnalytics }>,
): ReactNode {
	const { names, page } = props;

	const t = useTranslations();
	const format = useFormatter();
	const id = useId();
	const getFilterLabel = useFilterLabel();
	const getValueLabel = useValueLabel(names);

	const pageTitles: Record<SearchPage, string> = {
		search: t("Website search"),
		"resource-catalogue": t("Resource Catalogue"),
		opportunities: t("Opportunities"),
	};

	const hasKeywords = !pagesWithoutKeywords.has(page.page);

	return (
		<section aria-labelledby={`${id}-heading`} className="flex flex-col gap-y-6">
			<h3 className="text-title-4" id={`${id}-heading`}>
				{pageTitles[page.page]}
			</h3>

			{hasKeywords ? (
				<dl className="grid gap-6 sm:grid-cols-2">
					<div className="flex flex-col gap-y-1 bg-background-muted p-6">
						<dt className="text-caption text-text-weak">{t("Searches")}</dt>
						<dd className="order-first font-heading text-title-2 font-bold">{format.number(page.searches)}</dd>
					</div>
					{page.searches > 0 ? (
						<div className="flex flex-col gap-y-1 bg-background-muted p-6">
							<dt className="text-caption text-text-weak">{t("Searches without results")}</dt>
							<dd className="order-first font-heading text-title-2 font-bold">
								{format.number(page.searchesWithoutResults / page.searches, {
									style: "percent",
									maximumFractionDigits: 0,
								})}
							</dd>
						</div>
					) : null}
				</dl>
			) : null}

			<div className="grid gap-x-columns gap-y-8 lg:grid-cols-2">
				{hasKeywords ? (
					<UsageTable
						caption={t("Most searched terms")}
						columns={[t("Search term"), t("Searches")]}
						empty={t("No term has been searched in at least {visits} visits yet.", {
							visits: String(minKeywordVisits),
						})}
						rows={page.keywords.map((keyword) => {
							return { key: keyword.keyword, cells: [keyword.keyword], value: keyword.searches };
						})}
					/>
				) : null}
				<UsageTable
					caption={t("Most used filters")}
					columns={[t("Filter"), t("Value"), t("Times selected")]}
					empty={t("No filter has been used yet.")}
					rows={page.filters.map((filter) => {
						return {
							key: `${filter.filter}:${filter.value}`,
							cells: [getFilterLabel(page.page, filter.filter), getValueLabel(page.page, filter.filter, filter.value)],
							value: filter.selections,
						};
					})}
				/>
			</div>
		</section>
	);
}

interface UsageTableProps {
	caption: string;
	/** The last is the count's, aligned to the end. */
	columns: ReadonlyArray<string>;
	empty: string;
	rows: ReadonlyArray<{ key: string; cells: ReadonlyArray<string>; value: number }>;
}

/** A ranked list, as a table under its caption, or a note saying there is nothing to list yet. */
function UsageTable(props: Readonly<UsageTableProps>): ReactNode {
	const { caption, columns, empty, rows } = props;

	const format = useFormatter();

	return (
		<div className="overflow-x-auto">
			<table className="inline-full text-start">
				<caption className="text-start font-bold pbe-3">{caption}</caption>
				<thead>
					<tr className="border-be-2 border-stroke-strong">
						{columns.map((column, index) => (
							<th
								key={column}
								className={index === columns.length - 1 ? "py-3 ps-6 text-end" : "py-3 pe-6 text-start"}
								scope="col"
							>
								{column}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.length > 0 ? (
						rows.map((row) => (
							<tr key={row.key} className="border-be border-stroke-weak">
								{row.cells.map((cell, index) => (
									<td key={columns[index]} className="py-3 pe-6 text-start [overflow-wrap:anywhere]">
										{cell}
									</td>
								))}
								<td className="py-3 ps-6 text-end tabular-nums">{format.number(row.value)}</td>
							</tr>
						))
					) : (
						<tr>
							<td className="py-3 text-text-weak" colSpan={columns.length}>
								{empty}
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}

/** The filters' labels, as on their pages. */
function useFilterLabel(): (page: SearchPage, filter: string) => string {
	const t = useTranslations();

	const labels: Record<SearchPage, Record<string, string>> = {
		search: { type: t("Category") },
		"resource-catalogue": {
			type: t("Resource type"),
			consortium: t("National consortium"),
			"working-group": t("Working group"),
		},
		opportunities: { status: t("Availability"), source: t("Source") },
	};

	return (page, filter) => labels[page][filter] ?? filter;
}

/** The filter values' labels, as on their pages, or the slug for one not known (any longer). */
function useValueLabel(
	names: SearchAnalyticsContentProps["names"],
): (page: SearchPage, filter: string, value: string) => string {
	const websiteTypeLabels: Record<string, string> = useWebsiteTypeLabels();
	const resourceTypeLabels: Record<string, string> = useResourceTypeLabels();
	const statusLabels: Record<string, string> = useOpportunityStatusLabels();
	const sourceLabels: Record<string, string> = useOpportunitySourceLabels();

	const labels: Record<SearchPage, Record<string, Pick<ReadonlyMap<string, string>, "get">>> = {
		search: { type: new Map(Object.entries(websiteTypeLabels)) },
		"resource-catalogue": {
			type: new Map(Object.entries(resourceTypeLabels)),
			consortium: names.consortium,
			"working-group": names["working-group"],
		},
		opportunities: {
			status: new Map(Object.entries(statusLabels)),
			source: new Map(Object.entries(sourceLabels)),
		},
	};

	return (page, filter, value) => labels[page][filter]?.get(value) ?? value;
}

export function SearchAnalyticsSkeleton(): ReactNode {
	const t = useTranslations();

	return (
		<Skeleton className="flex flex-col gap-y-8" label={t("Loading search analytics…")}>
			<SkeletonShape className="block-12 inline-1/2" />
			<SkeletonShape className="block-64" />
		</Skeleton>
	);
}
