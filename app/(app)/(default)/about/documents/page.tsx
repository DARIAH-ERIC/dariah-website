import slugify from "@sindresorhus/slugify";
import { ChevronRightIcon, ExternalLinkIcon } from "lucide-react";
import type { Metadata } from "next";
import { getExtracted as getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { ContentBlocks } from "#/components/content-blocks.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { TableOfContents } from "#/components/table-of-contents.tsx";
import type { DocumentOrPolicyTree } from "#/lib/api/schemas.ts";
import { getDocumentsPoliciesTree } from "#/lib/data/documents-policies.ts";
import { getPageBySlug } from "#/lib/data/pages.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";
import type { RichTextHeading } from "#/lib/rich-text.ts";

interface DocumentsPageProps extends PageProps<"/about/documents"> {}

/**
 * Nothing on this page depends on the request, so it is prerendered whole, and `next build` fails if a change makes any
 * of it render per request.
 */
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const page = await getPageBySlug("documents-and-policies");

	if (page == null) {
		return {};
	}

	return createMetadata({
		href: href({ pathname: "/about/documents" }),
		title: page.title,
		description: page.summary,
		image: page.image,
	});
}

/**
 * Each group's anchor, as a slug of its label - readable in the address bar, unlike the group's id. A repeated slug
 * takes a `-2`, `-3`, ... suffix in reading order, as a content heading's does (see `identifyHeadings` in
 * `lib/rich-text.ts`).
 */
function identifyGroups(labels: Array<string>): Array<string> {
	const ids = new Set<string>();

	return labels.map((label) => {
		const base = slugify(label) || "section";

		let candidate = base;
		let suffix = 1;

		while (ids.has(candidate)) {
			suffix += 1;
			candidate = `${base}-${String(suffix)}`;
		}

		ids.add(candidate);

		return candidate;
	});
}

/**
 * The page lays out like a content page (see `ContentLayout`): the groups are its sections, listed as the outline to
 * the start side from `lg` up. The page's content, if any, introduces the groups, kept to a readable measure.
 */
export default async function DocumentsPage(_props: Readonly<DocumentsPageProps>): Promise<ReactNode> {
	const t = await getTranslations();
	const page = await getPageBySlug("documents-and-policies");

	if (page == null) {
		notFound();
	}

	const tree = await getDocumentsPoliciesTree();

	const labels: DocumentLinkLabels = {
		download: t("Download"),
		external: t("(external website)"),
		link: t("Visit website"),
		pdf: t("View PDF"),
	};

	const groups = tree.filter((node) => node.type === "group");
	const ids = identifyGroups(groups.map((group) => group.label));
	const headings: Array<RichTextHeading> = groups.map((group, index) => {
		return { id: ids[index] ?? group.id, level: 2, text: group.label };
	});
	const groupIds = new Map(headings.map((heading, index) => [groups[index]?.id, heading.id]));

	return (
		<Main className="px-main">
			<PageHeader current={href({ pathname: "/about/documents" })} image={null} title={page.title} />
			<div className="pbe-24 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-x-columns">
				<TableOfContents
					className="hidden lg:sticky lg:block lg:self-start lg:overflow-y-auto lg:inset-bs-8 lg:max-block-[calc(100dvh-4rem)]"
					headings={headings}
				/>
				<div className="flex flex-col gap-y-14">
					<ContentBlocks blocks={page.content} className="max-inline-measure" />
					{tree.map((node) =>
						node.type === "group" ? (
							<section key={node.id}>
								<h2 className="mbe-6 text-title-2" id={groupIds.get(node.id)}>
									{node.label}
								</h2>
								<DocumentList items={node.items} labels={labels} />
							</section>
						) : (
							<DocumentList key={node.id} items={[node]} labels={labels} />
						),
					)}
				</div>
			</div>
		</Main>
	);
}

type DocumentOrPolicyItem = Extract<DocumentOrPolicyTree[number], { type: "item" }>;

interface DocumentLinkLabels {
	/** For any other file, e.g. an archive of logos. */
	download: string;
	/** Tells a screen reader that an external link leaves the site, which the icon shows visually. */
	external: string;
	/** For an external link, which points to a page elsewhere rather than an uploaded file. */
	link: string;
	/** For a pdf, which the browser opens rather than saves. */
	pdf: string;
}

/**
 * Whether a document's file is a pdf, by its extension - the api does not say which kind of file it is. Only the path
 * counts, not a query string or fragment.
 */
function isPdf(url: string): boolean {
	return URL.parse(url)?.pathname.toLowerCase().endsWith(".pdf") ?? false;
}

/**
 * The link's `::after` covers its row, so the whole row is clickable - but only the link's own text is announced. Its
 * focus outline is the row's (`focus-within-outline-inset`), drawn inside it so it does not overlap the rows beside
 * it.
 */
const linkClassName =
	"inline-flex items-center gap-x-3 font-medium text-text-strong outline-none after:absolute after:inset-0 group-hover:text-text-accent";

interface DocumentListProps {
	items: Array<Pick<DocumentOrPolicyItem, "document" | "id" | "link" | "title">>;
	/** The link's visible text, by what it points to. */
	labels: DocumentLinkLabels;
}

/**
 * One row per document, odd rows shaded, with the link to its file - or, for an external link, to its page - at the
 * row's end, though the whole row is clickable. Rows' links mostly read the same, so the document's title follows the
 * label for a screen reader, which would otherwise list a column of identical links.
 *
 * Every row has a border, transparent on the unshaded ones, so shaded and unshaded rows are the same height. Below `sm`
 * the link always goes on its own line under the title, so the rows are uniform rather than a mix of one and two
 * lines.
 */
function DocumentList(props: Readonly<DocumentListProps>): ReactNode {
	const { items, labels } = props;

	return (
		<ul role="list">
			{items.map((item) => (
				<li
					key={item.id}
					className="group flex flex-col items-start gap-x-8 gap-y-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-y-1 border border-transparent pbs-4 pbe-4 ps-2.5 pe-5 text-body hover:text-text-accent odd:border-stroke-weak odd:bg-background-subtle focus-within-outline-inset"
				>
					<span>{item.title}</span>
					{item.document != null ? (
						<a className={linkClassName} href={item.document.url}>
							{isPdf(item.document.url) ? labels.pdf : labels.download}
							<span className="sr-only">: {item.title}</span>
							<ChevronRightIcon aria-hidden={true} className="size-4 shrink-0 text-icon-accent" strokeWidth={2.5} />
						</a>
					) : item.link != null ? (
						<a className={linkClassName} href={item.link.url}>
							{labels.link}
							<span className="sr-only">
								: {item.title} {labels.external}
							</span>
							<ExternalLinkIcon aria-hidden={true} className="size-4 shrink-0 text-icon-accent" strokeWidth={2.5} />
						</a>
					) : null}
				</li>
			))}
		</ul>
	);
}
