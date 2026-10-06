import { ChevronRightIcon } from "lucide-react";
import { Fragment, type ReactNode } from "react";

import type { EntityRef } from "#/lib/api/schemas.ts";
import { unsafeHref } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

/** A resource from the resource catalogue, as the api embeds it in an item's `relatedResources`. */
export interface RelatedResource {
	id: string;
	label: string;
	type: string | null;
	sourceUrl: string | null;
	links: Array<string>;
}

interface RelatedLinksProps {
	/** The heading above the list - "Quick links" beside a page, "Related content" beside a detail item. */
	title: string;
	/** The item's `relatedEntities` - see `lib/api/schemas.ts`. */
	entities: Array<EntityRef>;
	/** The item's `relatedResources` - see `lib/api/schemas.ts`. */
	resources: Array<RelatedResource>;
	className?: string;
}

/** Where a resource is citable, falling back to its page on the source it was imported from - see `RelatedLinks`. */
export function getResourceUrl(resource: Readonly<RelatedResource>): string | null {
	return resource.links[0] ?? resource.sourceUrl;
}

/**
 * The entities and resources an item is related to, as one list of links.
 *
 * An `aside` rather than a `nav`: these point away from the item, to other content, instead of around the site or the
 * page. Entities come first, since they stay on the website; resources lead off it. An entity's `href` is resolved by
 * the api. A resource links to where it is citable (its first `links` entry), falling back to its page on the source it
 * was imported from (`sourceUrl`) - in that order because `sourceUrl` is not always a page: for Zenodo records it can
 * be the api's JSON record. An entry with nowhere to go - an entity without a page, a resource without a link - is
 * still listed, as plain text, because the relation itself is information. A resource's `type` is not shown for now.
 *
 * A link ends in an accent chevron, kept on one line with the label's last word, so a label which wraps takes the
 * chevron along rather than leaving it alone on a line of its own. It is decoration only: the link's accessible name is
 * its label. On hover the label takes the accent colour.
 */
const linkClassName = "hover:text-text-accent focus-visible-outline";

export function RelatedLinks(props: Readonly<RelatedLinksProps>): ReactNode {
	const { title, entities, resources, className } = props;

	return (
		<aside aria-labelledby="related-links" className={className}>
			<h2 className="mbe-8 text-title-1" id="related-links">
				{title}
			</h2>
			{/** No intrinsic width of its own, so a column sized to fit its content is sized to the heading, not a long label. */}
			<ul className="flex list-none flex-col gap-y-5 p-0 text-body font-medium contain-inline-size" role="list">
				{entities.map((entity) => (
					<li key={entity.id}>
						{entity.href == null ? (
							entity.label
						) : (
							<Link className={linkClassName} href={unsafeHref(entity.href, false)} prefetch="intent">
								<LabelWithChevron label={entity.label} />
							</Link>
						)}
					</li>
				))}
				{resources.map((resource) => {
					const url = getResourceUrl(resource);

					return (
						<li key={resource.id}>
							{url == null ? (
								resource.label
							) : (
								<a className={linkClassName} href={url}>
									<LabelWithChevron label={resource.label} />
								</a>
							)}
						</li>
					);
				})}
			</ul>
		</aside>
	);
}

interface LabelWithChevronProps {
	label: string;
}

function LabelWithChevron(props: Readonly<LabelWithChevronProps>): ReactNode {
	const { label } = props;

	const index = label.lastIndexOf(" ") + 1;

	return (
		<Fragment>
			{label.slice(0, index)}
			<span className="whitespace-nowrap">
				{label.slice(index)}
				<ChevronRightIcon
					aria-hidden={true}
					className="ms-3 inline size-4 align-[-0.125em] text-icon-accent"
					strokeWidth={2.5}
				/>
			</span>
		</Fragment>
	);
}
