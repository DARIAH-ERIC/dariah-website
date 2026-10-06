import cn from "clsx/lite";
import {
	BookOpenTextIcon,
	BriefcaseIcon,
	BuildingIcon,
	CalendarIcon,
	FileTextIcon,
	FlagIcon,
	FolderIcon,
	HandCoinsIcon,
	LandmarkIcon,
	LibraryIcon,
	type LucideIcon,
	MapPinIcon,
	NewspaperIcon,
	SparklesIcon,
	UserIcon,
	UsersIcon,
} from "lucide-react";
import { useExtracted as useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { type RelatedResource, getResourceUrl } from "#/components/related-links.tsx";
import type { EntityRef } from "#/lib/api/schemas.ts";
import { unsafeHref } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

interface RelatedContentProps {
	title: string;
	/** The item's `relatedEntities` - see `lib/api/schemas.ts`. */
	entities: Array<EntityRef>;
	/** The item's `relatedResources` - see `lib/api/schemas.ts`. */
	resources: Array<RelatedResource>;
	className?: string;
}

/** The icon beside an entity's kind, as on the kind's own cards where it has them (projects, working groups, news). */
const entityIcons: Record<EntityRef["type"], LucideIcon> = {
	documents_policies: FileTextIcon,
	events: CalendarIcon,
	funding_calls: HandCoinsIcon,
	impact_case_studies: BookOpenTextIcon,
	news: NewspaperIcon,
	opportunities: BriefcaseIcon,
	pages: FileTextIcon,
	persons: UserIcon,
	projects: FolderIcon,
	spotlight_articles: SparklesIcon,
	governance_body: LandmarkIcon,
	national_consortium: FlagIcon,
	country: FlagIcon,
	institution: BuildingIcon,
	regional_hub: MapPinIcon,
	eric: LandmarkIcon,
	working_group: UsersIcon,
};

/** The project and working group cards draw their icon filled; the others are outlines. */
const filledIcons = new Set<LucideIcon>([FolderIcon, UsersIcon]);

const linkClassName =
	"underline-offset-4 outline-none group-hover:underline after:absolute after:inset-0 focus-visible:after:outline-3 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus-outline focus-visible:after:outline-solid";

interface Entry {
	id: string;
	label: string;
	kind: string;
	icon: LucideIcon;
	link: ReactNode | null;
}

/**
 * The entities and resources a detail item is related to, as a list of cards - the item-page counterpart of
 * `RelatedLinks`, which lists a page's quick links. Entities come first, then resources, which link where
 * `RelatedLinks` links them.
 *
 * A card is tinted, with its kind on a white tab cut out of the tint at its top start corner, and its title below. The
 * title's link stretches over the whole card, which draws its focus outline, and is underlined on hover. An entry with
 * nowhere to go is still listed, as a card without a link, because the relation itself is information.
 */
export function RelatedContent(props: Readonly<RelatedContentProps>): ReactNode {
	const { title, entities, resources, className } = props;

	const t = useTranslations();

	const entityLabels: Record<EntityRef["type"], string> = {
		documents_policies: t("Document or policy"),
		events: t("Event"),
		funding_calls: t("Funding call"),
		impact_case_studies: t("Impact case study"),
		news: t("News"),
		opportunities: t("Opportunity"),
		pages: t("Page"),
		persons: t("Person"),
		projects: t("Project"),
		spotlight_articles: t("Spotlight article"),
		governance_body: t("Governance body"),
		national_consortium: t("National consortium"),
		country: t("Country"),
		institution: t("Institution"),
		regional_hub: t("Regional hub"),
		eric: t("ERIC"),
		working_group: t("Working group"),
	};

	/** A resource's `type` is free text in the api; the resource catalogue's types are named, anything else is a resource. */
	function getResourceLabel(type: string | null): string {
		switch (type ?? "") {
			case "publication": {
				return t("Publication");
			}
			case "service": {
				return t("Service");
			}
			case "software": {
				return t("Software");
			}
			case "training-material": {
				return t("Training material");
			}
			case "workflow": {
				return t("Workflow");
			}
			default: {
				return t("Resource");
			}
		}
	}

	const entries: Array<Entry> = [
		...entities.map((entity) => {
			return {
				id: entity.id,
				label: entity.label,
				kind: entityLabels[entity.type],
				icon: entityIcons[entity.type],
				link:
					entity.href == null ? null : (
						<Link className={linkClassName} href={unsafeHref(entity.href, false)} prefetch="intent">
							{entity.label}
						</Link>
					),
			};
		}),
		...resources.map((resource) => {
			const url = getResourceUrl(resource);

			return {
				id: resource.id,
				label: resource.label,
				kind: getResourceLabel(resource.type),
				icon: LibraryIcon,
				link:
					url == null ? null : (
						<a className={linkClassName} href={url}>
							{resource.label}
						</a>
					),
			};
		}),
	];

	return (
		<aside aria-labelledby="related-content" className={className}>
			<h2 className="mbe-8 text-title-1" id="related-content">
				{title}
			</h2>
			<ul className="flex flex-col gap-y-6" role="list">
				{entries.map((entry) => {
					const Icon = entry.icon;

					return (
						<li key={entry.id}>
							<article className="group relative bg-background-accent-weak">
								<p className="flex inline-fit items-center gap-x-3 bg-background-base px-6 py-4.5">
									<Icon
										aria-hidden={true}
										className={cn(
											"shrink-0 text-icon-accent block-4 inline-4",
											filledIcons.has(Icon) && "fill-current",
										)}
									/>
									<span className="text-small font-bold text-text-accent uppercase">{entry.kind}</span>
								</p>
								<h3 className="p-6 font-body text-body font-medium text-text-strong">{entry.link ?? entry.label}</h3>
							</article>
						</li>
					);
				})}
			</ul>
		</aside>
	);
}
