import {
	BanknoteIcon,
	BookOpenIcon,
	BriefcaseIcon,
	BuildingIcon,
	CalendarIcon,
	CodeIcon,
	FileIcon,
	FileTextIcon,
	FlagIcon,
	FolderIcon,
	GraduationCapIcon,
	LandmarkIcon,
	LightbulbIcon,
	type LucideIcon,
	MapPinIcon,
	NewspaperIcon,
	SearchIcon,
	SparklesIcon,
	UserIcon,
	UsersIcon,
	WorkflowIcon,
	WrenchIcon,
} from "lucide-react";
import type { Metadata } from "next";
import { useFormatter, useExtracted as useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode, Suspense, useId } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { Pagination } from "#/app/(app)/(default)/_components/pagination.tsx";
import { searchParams as resourcesSearchParams } from "#/app/(app)/(default)/resources/resource-catalogue/search-params.ts";
import { WebsiteSearchForm } from "#/app/(app)/(default)/search/_components/website-search-form.tsx";
import { searchParams, searchTypes } from "#/app/(app)/(default)/search/search-params.ts";
import { Breadcrumbs } from "#/components/breadcrumbs.tsx";
import { ContentBlocks } from "#/components/content-blocks.tsx";
import { NoResults } from "#/components/no-results.tsx";
import { Select } from "#/components/ui/select.tsx";
import { Skeleton, SkeletonField } from "#/components/ui/skeleton.tsx";
import { getPageBySlug } from "#/lib/data/pages.ts";
import { searchWebsite } from "#/lib/data/search.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href, unsafeHref } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";
import type { WebsiteDocument, WebsiteDocumentType, WebsiteSearchResult } from "#/lib/search/index.ts";

interface SearchPageProps extends PageProps<"/search"> {}

export async function generateMetadata(props: Readonly<SearchPageProps>): Promise<Metadata> {
	const page = await getPageBySlug("search");
	const query = searchParams.safeParse(await props.searchParams);

	if (!query.success) {
		notFound();
	}

	if (page == null) {
		return {};
	}

	return createMetadata({
		href: href({ pathname: "/search" }),
		title: page.title,
		description: page.summary,
		image: page.image,
		noindex: true,
	});
}

/**
 * The title, the form and the results keep to `px-main`, as the breadcrumbs and every other list page do; the title to
 * the design's 1100px column (`max-inline-title`), as a page header's.
 *
 * The page's featured image is not shown: the design has the search form right below the title. Its content, if any,
 * sits between the two as a short introduction, kept to a readable measure.
 */
export default async function SearchPage(props: Readonly<SearchPageProps>): Promise<ReactNode> {
	const page = await getPageBySlug("search");

	if (page == null) {
		notFound();
	}

	return (
		<Main className="px-main pbs-8 pbe-24">
			<Breadcrumbs current={href({ pathname: "/search" })} label={page.title} />
			<h1 className="mbs-14 max-inline-title text-title-1">{page.title}</h1>
			<ContentBlocks blocks={page.content} className="mbs-8 max-inline-measure" />
			{/*
			 * Not an empty form as the fallback: it would be replaced once the search params resolve, flashing an empty
			 * input and dropping whatever was typed into it in the meantime. A placeholder of the form's boxes instead.
			 */}
			<Suspense fallback={<SearchLoading />}>
				<SearchResults searchParams={props.searchParams} />
			</Suspense>
		</Main>
	);
}

/**
 * The search form's layout, with a box for the search field and one for the category, each under its label. Results are
 * only listed for a query, which the fallback cannot tell, so there is no placeholder for them.
 */
function SearchLoading(): ReactNode {
	const t = useTranslations();

	return (
		<Skeleton
			className="mbs-12 grid grid-cols-1 items-end gap-x-columns gap-y-6 md:grid-cols-[minmax(0,1fr)_16rem]"
			label={t("Loading results…")}
		>
			<SkeletonField label={t("Search the website")} />
			<SkeletonField label={t("Category")} />
		</Skeleton>
	);
}

async function SearchResults(props: Pick<SearchPageProps, "searchParams">): Promise<ReactNode> {
	const query = searchParams.safeParse(await props.searchParams);

	if (!query.success) {
		notFound();
	}

	const { q, type, page } = query.output;

	/** Without a query or a type there is nothing to narrow down, so don't list the whole website. */
	const result = q.length > 0 || type != null ? await searchWebsite({ query: q, type, page }) : null;

	/**
	 * The form keeps its position in the tree whether or not there are results, so it isn't remounted - which would drop
	 * the focus from the input - when the first keystroke brings in results.
	 */
	return (
		<Fragment>
			<SearchForm query={q} type={type} />
			{result != null ? <SearchResultsList page={page} query={q} result={result} type={type} /> : null}
		</Fragment>
	);
}

function SearchResultsList(
	props: Readonly<{
		page: number;
		query: string;
		result: WebsiteSearchResult;
		type: WebsiteDocumentType | undefined;
	}>,
): ReactNode {
	const { page, query, result, type } = props;

	const t = useTranslations();

	const total = result.pagination.total;

	const heading = (
		<h2 className="text-title-4">
			{query.length > 0
				? t("{total, plural, one {# result} other {# results}} for “{query}”", { total, query })
				: t("{total, plural, one {# result} other {# results}}", { total })}
		</h2>
	);

	/**
	 * Like a list with results, the count as its heading, so the page's outline doesn't change with the query. The
	 * resource catalogue is suggested as well: research tools and publications are searched there, not here.
	 */
	if (result.items.length === 0) {
		return (
			<section className="mbs-12">
				{heading}
				<NoResults
					actions={[
						...(type != null
							? [
									{
										label: t("Search all categories"),
										href: href({ pathname: "/search", searchParams: searchParams.encode({ q: query, page: 1 }) }),
									},
								]
							: []),
						...(query.length > 0
							? [
									{
										label: t("Search the Resource Catalogue"),
										href: href({
											pathname: "/resources/resource-catalogue",
											searchParams: resourcesSearchParams.encode({
												q: query,
												type: [],
												consortium: [],
												"working-group": [],
												page: 1,
											}),
										}),
									},
								]
							: []),
					]}
					className="mbs-10"
				>
					{type != null
						? t("Check the spelling, try a broader term, or search all categories.")
						: t("Check the spelling, or try a broader term.")}
				</NoResults>
			</section>
		);
	}

	return (
		<section className="mbs-12">
			{heading}
			<ul className="mbs-10 flex flex-col gap-y-12" role="list">
				{result.items.map(({ document }) => (
					<li key={document.id}>
						<SearchResult document={document} />
					</li>
				))}
			</ul>
			{result.pagination.totalPages > 1 ? (
				<Pagination
					className="mbs-16"
					hrefFor={(page) => href({ pathname: "/search", searchParams: searchParams.encode({ q: query, type, page }) })}
					page={page}
					pages={result.pagination.totalPages}
				/>
			) : null}
		</section>
	);
}

/**
 * Types whose `source_updated_at` is their publication date, which is shown with the result. For other types it is an
 * event's date, which the description already gives, or the date of the last update, which says little about the
 * content - see `websiteCollection`.
 */
const datedTypes = new Set<WebsiteDocumentType>(["impact-case-study", "news-item", "spotlight-article"]);

/** Where the design has no icon for a type, the closest lucide one. */
const typeIcons: Record<WebsiteDocumentType, LucideIcon> = {
	country: FlagIcon,
	"document-or-policy": FileTextIcon,
	event: CalendarIcon,
	"funding-call": BanknoteIcon,
	"governance-body": LandmarkIcon,
	"impact-case-study": SparklesIcon,
	institution: BuildingIcon,
	"national-consortium": MapPinIcon,
	"news-item": NewspaperIcon,
	opportunity: BriefcaseIcon,
	page: FileIcon,
	person: UserIcon,
	project: FolderIcon,
	"spotlight-article": LightbulbIcon,
	"working-group": UsersIcon,
	publication: BookOpenIcon,
	service: WrenchIcon,
	software: CodeIcon,
	"training-material": GraduationCapIcon,
	workflow: WorkflowIcon,
};

/**
 * The type, with its icon, and the date above the title, and the description below it, cut off after two lines. Capped
 * at a readable measure (`max-inline-measure`), since the results' list is far wider than a line of text should be.
 */
function SearchResult(props: Readonly<{ document: WebsiteDocument }>): ReactNode {
	const { document } = props;

	const format = useFormatter();
	const typeLabels = useTypeLabels();

	const Icon = typeIcons[document.type];
	const date =
		datedTypes.has(document.type) && document.source_updated_at != null ? new Date(document.source_updated_at) : null;

	return (
		<article className="flex max-inline-measure flex-col gap-y-4">
			<p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-caption">
				<span className="flex items-center gap-x-2 font-bold text-text-accent uppercase">
					<Icon aria-hidden={true} className="size-5 shrink-0" />
					{typeLabels[document.type]}
				</span>
				{date != null ? (
					<time className="text-text-weak" dateTime={date.toISOString()}>
						{format.dateTime(date, { dateStyle: "long" })}
					</time>
				) : null}
			</p>
			<h3 className="text-title-5">
				{document.link != null ? (
					<Link
						className="hover:underline focus-visible-outline"
						href={unsafeHref(document.link, /^https?:\/\//.test(document.link))}
						prefetch="intent"
					>
						{document.label}
					</Link>
				) : (
					document.label
				)}
			</h3>
			{document.description.length > 0 ? <p className="line-clamp-2 text-body">{document.description}</p> : null}
		</article>
	);
}

/**
 * A `get` form, so a search is a url the user can share; results update as the user types.
 *
 * Styled like the resource catalogue's search box, with the category to its end side from `md` up, each with its label
 * above it. The spinner shares the category label's row, at its end.
 */
function SearchForm(props: Readonly<{ query: string; type?: WebsiteDocumentType }>): ReactNode {
	const { query, type } = props;

	const t = useTranslations();
	const typeLabels = useTypeLabels();
	const id = useId();

	return (
		<WebsiteSearchForm
			className="mbs-12 grid grid-cols-1 items-end gap-x-columns gap-y-6 md:grid-cols-[minmax(0,1fr)_16rem]"
			statusClassName="col-start-1 row-start-2 self-start justify-self-end md:col-start-2 md:row-start-1"
		>
			<div className="col-start-1 row-start-1 flex flex-col gap-y-2">
				<label className="font-bold" htmlFor={`${id}-q`}>
					{t("Search the website")}
				</label>
				<div className="flex min-block-15 shadow-[0_0_4px_0_rgb(0_0_0/0.08)]">
					<div className="flex min-inline-0 flex-1 focus-within-outline-inset">
						<SearchIcon
							aria-hidden={true}
							className="pointer-events-none absolute inset-bs-1/2 inset-s-4 size-5 -translate-y-1/2 text-icon-strong"
						/>
						<input
							autoComplete="off"
							className="min-inline-0 flex-1 border-be-2 border-stroke-weak bg-background-field py-2.5 ps-12 pe-12 outline-none hover:border-stroke-accent"
							defaultValue={query}
							id={`${id}-q`}
							maxLength={200}
							name="q"
							type="search"
						/>
					</div>
					<button
						className="relative border-2 border-stroke-accent bg-background-accent-strong px-8 font-heading font-bold text-text-inverse hover:bg-background-base hover:text-text-accent focus-visible-outline"
						type="submit"
					>
						{t("Search")}
					</button>
				</div>
			</div>
			<Select
				className="col-start-1 row-start-2 md:col-start-2 md:row-start-1"
				defaultValue={type ?? ""}
				label={t("Category")}
				name="type"
				options={[
					{ id: "", label: t("All categories") },
					...searchTypes.map((type) => {
						return { id: type, label: typeLabels[type] };
					}),
				]}
				variant="field"
			/>
		</WebsiteSearchForm>
	);
}

function useTypeLabels(): Record<WebsiteDocumentType, string> {
	const t = useTranslations();

	return {
		country: t("Country"),
		"document-or-policy": t("Document or policy"),
		event: t("Event"),
		"funding-call": t("Funding call"),
		"governance-body": t("Governance body"),
		"impact-case-study": t("Impact case study"),
		institution: t("Institution"),
		"national-consortium": t("National consortium"),
		"news-item": t("News"),
		opportunity: t("Opportunity"),
		page: t("Page"),
		person: t("Person"),
		project: t("Project"),
		"spotlight-article": t("Spotlight article"),
		"working-group": t("Working group"),
		publication: t("Publication"),
		service: t("Service"),
		software: t("Software"),
		"training-material": t("Training material"),
		workflow: t("Workflow"),
	};
}
