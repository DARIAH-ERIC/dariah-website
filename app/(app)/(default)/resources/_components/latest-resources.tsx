import { ChevronRightIcon } from "lucide-react";
import { useExtracted as useTranslations } from "next-intl";
import { type ReactNode, Suspense, useId } from "react";

import { ResourceLink, ResourceTypeBadge } from "#/app/(app)/(default)/resources/_components/resource.tsx";
import { SectionErrorBoundary } from "#/components/section-error-boundary.tsx";
import { Skeleton, SkeletonShape, SkeletonText } from "#/components/ui/skeleton.tsx";
import { getLatestResources } from "#/lib/data/search.ts";
import { unsafeHref } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";
import type { ResourceDocument, ResourceSource } from "#/lib/search/index.ts";

interface LatestResourcesProps {
	source: ResourceSource;
	/** The source's own site, where the rest of its resources are. */
	upstreamUrl: string;
}

/**
 * The most recently updated entries from one source of the resource catalogue, as cards, followed by a link to the
 * source's own site for the rest: a dark bar under the last column, bleeding to the page's end edge, like the landing
 * page's "See all news" link.
 */
export function LatestResources(props: Readonly<LatestResourcesProps>): ReactNode {
	const { source, upstreamUrl } = props;

	const t = useTranslations();
	const id = useId();

	return (
		<section aria-labelledby={id} className="grid gap-x-5 pbe-24 md:grid-cols-2 xl:grid-cols-3">
			<h2 className="col-span-full text-title-2 mbe-10" id={id}>
				{t("Discover the latest resources")}
			</h2>
			<SectionErrorBoundary className="col-span-full">
				<Suspense fallback={<LatestResourcesLoading />}>
					<LatestResourcesList source={source} />
				</Suspense>
			</SectionErrorBoundary>
			<Link
				className="-me-main mbs-16 flex items-center gap-2 bg-background-strong px-6 py-7 font-medium text-text-inverse underline-offset-4 hover:underline focus-visible-outline md:col-start-2 xl:col-start-3"
				href={unsafeHref(upstreamUrl, true)}
			>
				{t("Explore more resources")}
				<ChevronRightIcon aria-hidden={true} className="size-4" strokeWidth={2.5} />
			</Link>
		</section>
	);
}

/** The same list as `LatestResourcesItems` while it loads, with a placeholder for each card. */
function LatestResourcesLoading(): ReactNode {
	const t = useTranslations();

	return (
		<Skeleton className="col-span-full grid grid-cols-subgrid gap-y-8" label={t("Loading resources…")}>
			{[0, 1, 2].map((index) => (
				<div key={index} className="flex shadow-card">
					<LatestResourceCard document={null} />
				</div>
			))}
		</Skeleton>
	);
}

async function LatestResourcesList(props: Readonly<Pick<LatestResourcesProps, "source">>): Promise<ReactNode> {
	const { source } = props;

	const items = await getLatestResources(source);

	return <LatestResourcesItems items={items} />;
}

/** The cards share the section's columns, through a subgrid, so the link below lines up with the last of them. */
function LatestResourcesItems(props: Readonly<{ items: Awaited<ReturnType<typeof getLatestResources>> }>): ReactNode {
	const { items } = props;

	const t = useTranslations();

	if (items.length === 0) {
		return <p className="col-span-full">{t("No results found.")}</p>;
	}

	return (
		<ul className="col-span-full grid grid-cols-subgrid gap-y-8" role="list">
			{items.map(({ document }) => (
				<li key={document.id} className="flex shadow-card">
					<LatestResourceCard document={document} />
				</li>
			))}
		</ul>
	);
}

/**
 * A resource's label, type and description, and a link to where it lives.
 *
 * Without a resource, the card is its own loading skeleton: the same boxes, with placeholders for the label, the type,
 * the description and the link.
 */
function LatestResourceCard(props: Readonly<{ document: ResourceDocument | null }>): ReactNode {
	const { document } = props;

	const Root = document != null ? "article" : "div";

	return (
		<Root className="flex inline-full flex-col items-start gap-y-4 bg-background-subtle p-6 shadow-card-edge">
			{document != null ? (
				<h3 className="text-title-3 leading-heading">{document.label}</h3>
			) : (
				<SkeletonText className="self-stretch text-title-3 leading-heading" lines={2} />
			)}
			{document != null ? (
				<ResourceTypeBadge type={document.type} />
			) : (
				<SkeletonShape className="text-badge block-[calc(1lh+--spacing(2))] inline-24" />
			)}
			{document == null ? (
				<SkeletonText className="self-stretch leading-body" lines={5} />
			) : document.description.length > 0 ? (
				<p className="line-clamp-5 leading-body">{document.description}</p>
			) : null}
			{/* The auto margin pushes the link to the card's end; the padding keeps it off a long description. */}
			<div className="mbs-auto self-stretch pbs-4">
				{document != null ? (
					<ResourceLink document={document} size="small" />
				) : (
					<SkeletonShape className="min-block-12" />
				)}
			</div>
		</Root>
	);
}
