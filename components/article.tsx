import { useExtracted as useTranslations } from "next-intl";
import { type ReactNode, useId } from "react";

import { ContentLayout } from "#/components/content-layout.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { PersonGroup } from "#/components/person-card.tsx";
import type { RelatedResource } from "#/components/related-links.tsx";
import type { EntityRef, Image, ImpactCaseStudy } from "#/lib/api/schemas.ts";
import type { Href } from "#/lib/navigation/href.ts";

type Contributor = ImpactCaseStudy["contributors"][number];

interface ArticleProps {
	/** The page's own `href`, for its breadcrumbs. */
	current: Href;
	/** The page which lists the current one - see `Breadcrumbs`. */
	parent: Href;
	/** For an article dated by when it was published, e.g. a news item - see `PageHeader`. */
	publishedAt?: string;
	item: {
		title: string;
		summary: string;
		image: Image;
		content?: unknown;
		/** Left out for an article without a byline, e.g. a news item. */
		contributors?: Array<Contributor>;
		relatedEntities?: Array<EntityRef>;
		relatedResources?: Array<RelatedResource>;
		/** Left out for an article which has no such setting, e.g. a news item, which then has no outline. */
		showTableOfContents?: boolean;
	};
}

/**
 * A long-form article, e.g. an impact case study or a spotlight article.
 *
 * Laid out as every detail page is (see `PageHeader` and `ContentLayout`), with its featured image as a banner, its
 * related content as cards, and an outline only where its editors asked for one (`showTableOfContents`) - a news item
 * has no such setting, and no outline. The contributors follow the content, as a section of its own beside the related
 * content (see `ContentLayout`'s `sections`).
 */
export function Article(props: Readonly<ArticleProps>): ReactNode {
	const { current, parent, publishedAt, item } = props;

	return (
		<div className="px-main">
			<PageHeader
				current={current}
				image={item.image}
				imageVariant="banner"
				parent={parent}
				publishedAt={publishedAt}
				title={item.title}
			/>
			<ContentLayout
				blocks={item.content}
				related="related-content"
				relatedEntities={item.relatedEntities}
				relatedResources={item.relatedResources}
				sections={
					item.contributors != null && item.contributors.length > 0 ? (
						<Contributors contributors={item.contributors} />
					) : null
				}
				tableOfContents={item.showTableOfContents ?? false}
			/>
		</div>
	);
}

interface ContributorsProps {
	contributors: Array<Contributor>;
}

/** The order the groups are listed in, lead authors first. */
const contributorRoles: Array<Contributor["role"]> = ["author", "contributor", "editor"];

/**
 * Grouped by role, as the design does, each group under a heading of its own; a group nobody is in is left out. Within
 * a group, contributors keep the api's order. As many columns as fit (see `PersonGroup`).
 *
 * The design shows only the groups' headings, so the section's own heading is for a screen reader, whose outline would
 * otherwise have the groups' headings under the article's last section.
 */
function Contributors(props: Readonly<ContributorsProps>): ReactNode {
	const { contributors } = props;

	const t = useTranslations();

	const headingId = useId();

	function getRoleLabel(role: Contributor["role"], count: number): string {
		switch (role) {
			case "author": {
				return t("{count, plural, one {Lead author} other {Lead authors}}", { count });
			}
			case "contributor": {
				return t("{count, plural, one {Contributing author} other {Contributing authors}}", { count });
			}
			case "editor": {
				return t("{count, plural, one {Editor} other {Editors}}", { count });
			}
		}
	}

	return (
		<section aria-labelledby={headingId}>
			<h2 className="sr-only" id={headingId}>
				{t("Contributors")}
			</h2>
			<div className="flex flex-col gap-y-10">
				{contributorRoles.map((role) => {
					const members = contributors.filter((contributor) => contributor.role === role);

					if (members.length === 0) {
						return null;
					}

					return <PersonGroup key={role} label={getRoleLabel(role, members.length)} persons={members} />;
				})}
			</div>
		</section>
	);
}
