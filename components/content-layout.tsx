import cn from "clsx/lite";
import { useExtracted as useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ContentBlocks } from "#/components/content-blocks.tsx";
import { RelatedContent } from "#/components/related-content.tsx";
import { RelatedLinks, type RelatedResource } from "#/components/related-links.tsx";
import { TableOfContents } from "#/components/table-of-contents.tsx";
import type { EntityRef } from "#/lib/api/schemas.ts";
import { collectHeadings, identifyHeadings } from "#/lib/rich-text.ts";

/**
 * Below this, one section is not an outline: a page with a single heading is read top to bottom anyway, and a one-entry
 * table of contents is a link to a place the reader can already see.
 */
const minimumHeadings = 2;

interface ContentLayoutProps {
	/** The rich-text array an api entity carries as its `content` or `description` - see `lib/api/schemas.ts`. */
	blocks: unknown;
	/**
	 * How the entity's relations are listed beside the content: as a page's `"quick-links"`, a sticky list of links, or
	 * as an item's `"related-content"`, a list of cards, which scrolls with the page since it soon outgrows the
	 * viewport.
	 */
	related: "quick-links" | "related-content";
	/** The entity's `relatedEntities`, listed beside the content. */
	relatedEntities?: Array<EntityRef>;
	/** The entity's `relatedResources`, listed beside the content. */
	relatedResources?: Array<RelatedResource>;
	/**
	 * Whether the content's outline may be shown to its start side - it is only where the content has at least
	 * {@link minimumHeadings} headings. An api entity which has a `showTableOfContents` flag passes that, so editors
	 * decide; for any other, the page decides.
	 */
	tableOfContents: boolean;
	/**
	 * Shown first in the content column, above the content, e.g. an organisation's details and logo (see `EntityIntro`),
	 * so the columns beside it start level with it.
	 */
	intro?: ReactNode;
	/** Shown between the `intro` and the content, in its column, e.g. a funding call's dates. */
	meta?: ReactNode;
	/** Shown below the content, in its column, e.g. a working group's chairs. */
	children?: ReactNode;
	/**
	 * The entity's own sections after the content, e.g. a member's contributors, each set off by a rule. They are main
	 * content, so the related content stays beside them rather than pushing them down; and they span the content's track
	 * rather than its measure, since they are lists and grids, not running text.
	 */
	sections?: ReactNode;
	className?: string;
}

/**
 * A page's or an item's content, with its outline to the start side and its related content to the end side - the one
 * layout below every content page's and detail page's header (see `PageHeader`).
 *
 * The outline has a fixed column (`--container-toc`), and the content gets its full measure first; the related content
 * takes what is left, but no less than `--container-related-min`, where the content gives way instead, and no more than
 * its own cap - `--container-quick-links` for a list of links, `--container-related-cards` for cards. Whatever is left
 * after that stays at the content's end side, so the related content keeps to the end edge of the main area. All of
 * these are set in `styles/index.css`.
 *
 * The outline is a column only from `lg` up: narrower than that the grid collapses to the content alone, because a
 * table of contents which pushes the prose into a sliver costs more than it saves, and it only repeats the headings the
 * reader scrolls past anyway. The related content needs a third column, so it only moves beside the content from `xl`
 * up; narrower than that it follows the content instead of being dropped, since it is not repeated anywhere else.
 *
 * Headings are given their anchors here, once, before the blocks are rendered and before they are walked for the
 * outline - so the list and the elements it links to are two readings of the same tree rather than two independent
 * slugifications which could drift apart (see `identifyHeadings` in `lib/rich-text.ts`).
 *
 * The content is capped at a readable measure (`max-inline-measure`) rather than filling its track, with or without
 * columns beside it, so adding an outline or related content does not re-typeset the prose. The column holds the
 * caller's `intro` first, then the caller's `meta`, then the content, and last whatever the caller adds below it.
 * Without any content, what the caller adds starts the column, and where it renders nothing, it leaves no gap either.
 * The caller's `sections` follow, below the measure-capped column but in the same track, so the related content is an
 * aside to all of it - and below `xl`, where it follows the content, it follows them too.
 */
export function ContentLayout(props: Readonly<ContentLayoutProps>): ReactNode {
	const {
		blocks,
		related,
		relatedEntities = [],
		relatedResources = [],
		tableOfContents,
		intro,
		meta,
		children,
		sections,
		className,
	} = props;

	const t = useTranslations();

	const identified = identifyHeadings(blocks);
	const headings = tableOfContents ? collectHeadings(identified) : [];

	const hasOutline = headings.length >= minimumHeadings;
	const hasRelated = relatedEntities.length > 0 || relatedResources.length > 0;

	const content = (
		<div className="max-inline-measure">
			{intro != null ? <div className="mbe-12">{intro}</div> : null}
			{meta != null ? <div className="mbe-8">{meta}</div> : null}
			{Array.isArray(identified) && identified.length > 0 ? (
				<ContentBlocks blocks={identified} className={className} />
			) : null}
			{children != null ? <div className="mbs-12 first:mbs-0 empty:hidden">{children}</div> : null}
		</div>
	);

	const main =
		sections != null ? (
			<div className="min-inline-0">
				{content}
				<div className="empty:hidden *:mbs-12 *:border-bs *:border-stroke-weak *:pbs-12">{sections}</div>
			</div>
		) : (
			content
		);

	if (!hasOutline && !hasRelated) {
		return <div className="pbe-24">{main}</div>;
	}

	/**
	 * Below `xl` with an outline beside it, the related content stays in the content's track rather than under the
	 * outline.
	 */
	const relatedClassName = cn(
		hasOutline && "lg:col-start-2 xl:col-start-3",
		related === "quick-links" &&
			"mbs-12 xl:sticky xl:inset-bs-[calc(--spacing(8)-5px)] xl:focus-outline-room xl:self-start xl:overflow-y-auto xl:focus-visible-outline xl:max-block-[calc(100dvh-4rem+10px)]",
		related === "related-content" && "mbs-12 xl:mbs-0",
		sections != null && "max-xl:border-bs max-xl:border-stroke-weak max-xl:pbs-12",
	);

	return (
		<div
			className={cn(
				"pbe-24",
				"[--related-inline:clamp(var(--container-related-min),100%-var(--outline-inline,0px)-var(--container-measure)-var(--spacing-columns),var(--related-max))]",
				related === "quick-links"
					? "[--related-max:var(--container-quick-links)]"
					: "[--related-max:var(--container-related-cards)]",
				hasOutline && "[--outline-inline:calc(var(--container-toc)+var(--spacing-columns))]",
				hasOutline && "lg:grid lg:grid-cols-[var(--container-toc)_minmax(0,1fr)] lg:gap-x-columns",
				hasOutline && hasRelated && "xl:grid-cols-[var(--container-toc)_minmax(0,1fr)_var(--related-inline)]",
				!hasOutline && "xl:grid xl:grid-cols-[minmax(0,1fr)_var(--related-inline)] xl:gap-x-columns",
			)}
		>
			{hasOutline ? (
				<TableOfContents
					className="hidden lg:sticky lg:block lg:self-start lg:overflow-y-auto lg:focus-outline-room lg:focus-visible-outline lg:inset-bs-[calc(--spacing(8)-5px)] lg:max-block-[calc(100dvh-4rem+10px)]"
					headings={headings}
				/>
			) : null}
			{main}
			{hasRelated ? (
				related === "quick-links" ? (
					<RelatedLinks
						className={relatedClassName}
						entities={relatedEntities}
						resources={relatedResources}
						title={t("Quick links")}
					/>
				) : (
					<RelatedContent
						className={relatedClassName}
						entities={relatedEntities}
						resources={relatedResources}
						title={t("Related Content")}
					/>
				)
			) : null}
		</div>
	);
}
