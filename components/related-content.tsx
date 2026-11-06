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

import { ApiImage } from "#/components/api-image.tsx";
import { CardImagePlaceholder } from "#/components/card-image-placeholder.tsx";
import { type RelatedResource, getResourceUrl } from "#/components/related-links.tsx";
import type { Image, RelatedEntity } from "#/lib/api/schemas.ts";
import { unsafeHref } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

interface RelatedContentProps {
	title: string;
	/** The item's `relatedEntities` - see `lib/api/schemas.ts`. */
	entities: Array<RelatedEntity>;
	/** The item's `relatedResources` - see `lib/api/schemas.ts`. */
	resources: Array<RelatedResource>;
	className?: string;
	/** How the cards are laid out: by default one below the other, as beside an item's content. */
	listClassName?: string;
	/** The cards' look: `"tinted"` beside an item's content, `"image"` in a band of their own. */
	card?: "image" | "tinted";
}

/** The icon beside an entity's kind, as on the kind's own cards where it has them (projects, working groups, news). */
const entityIcons: Record<RelatedEntity["type"], LucideIcon> = {
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

/**
 * The kinds whose image is a picture, which may be cropped to the card. Any other kind's is usually its logo, which is
 * shown whole, as on the project cards.
 */
const pictureTypes = new Set<RelatedEntity["type"]>([
	"events",
	"impact_case_studies",
	"news",
	"persons",
	"spotlight_articles",
]);

const linkClassName =
	"underline-offset-4 outline-none group-hover:underline after:absolute after:inset-0 focus-visible:after:outline-3 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus-outline focus-visible:after:outline-solid";

const imageCardLinkClassName =
	"underline-offset-4 outline-none group-hover:text-text-accent group-hover:underline after:absolute after:inset-0 focus-visible:after:outline-3 focus-visible:after:outline-offset-8 focus-visible:after:outline-focus-outline focus-visible:after:outline-solid";

interface Entry {
	id: string;
	label: string;
	kind: string;
	icon: LucideIcon;
	image: Image | null;
	isPicture: boolean;
	/** The entry's title, as a link where it has somewhere to go, given the link's class name. */
	renderTitle: (className: string) => ReactNode;
}

/**
 * The entities and resources a detail item is related to, as a list of cards - the item-page counterpart of
 * `RelatedLinks`, which lists a page's quick links. Entities come first, then resources, which link where
 * `RelatedLinks` links them.
 *
 * Beside an item's content, a card is tinted, with its kind on a white tab cut out of the tint at its top start corner,
 * and its title below. In a band of their own, the cards show images instead - see `ImageCard`. Either way the title's
 * link stretches over the whole card, which draws its focus outline, and is underlined on hover. An entry with nowhere
 * to go is still listed, as a card without a link, because the relation itself is information.
 */
export function RelatedContent(props: Readonly<RelatedContentProps>): ReactNode {
	const { title, entities, resources, className, listClassName = "flex flex-col gap-y-6", card = "tinted" } = props;

	const t = useTranslations();

	const entityLabels: Record<RelatedEntity["type"], string> = {
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
				image: entity.image,
				isPicture: pictureTypes.has(entity.type),
				renderTitle(className: string) {
					return entity.href == null ? (
						entity.label
					) : (
						<Link className={className} href={unsafeHref(entity.href, false)} prefetch="intent">
							{entity.label}
						</Link>
					);
				},
			};
		}),
		...resources.map((resource) => {
			const url = getResourceUrl(resource);

			return {
				id: resource.id,
				label: resource.label,
				kind: getResourceLabel(resource.type),
				icon: LibraryIcon,
				image: null,
				isPicture: false,
				renderTitle(className: string) {
					return url == null ? (
						resource.label
					) : (
						<a className={className} href={url}>
							{resource.label}
						</a>
					);
				},
			};
		}),
	];

	return (
		<aside aria-labelledby="related-content" className={className}>
			<h2 className="mbe-8 text-title-1" id="related-content">
				{title}
			</h2>
			<ul className={listClassName} role="list">
				{entries.map((entry) => (
					<li key={entry.id}>{card === "image" ? <ImageCard entry={entry} /> : <TintedCard entry={entry} />}</li>
				))}
			</ul>
		</aside>
	);
}

interface CardProps {
	entry: Entry;
}

function EntryIcon(props: Readonly<{ icon: LucideIcon }>): ReactNode {
	const { icon: Icon } = props;

	return (
		<Icon
			aria-hidden={true}
			className={cn("shrink-0 text-icon-accent block-4 inline-4", filledIcons.has(Icon) && "fill-current")}
		/>
	);
}

function TintedCard(props: Readonly<CardProps>): ReactNode {
	const { entry } = props;

	return (
		<article className="group relative bg-background-accent-weak block-full">
			<p className="flex items-center gap-x-3 bg-background-base px-6 py-4.5 inline-fit">
				<EntryIcon icon={entry.icon} />
				<span className="text-small font-bold text-text-accent uppercase">{entry.kind}</span>
			</p>
			<h3 className="p-6 font-body text-body font-medium text-text-strong">{entry.renderTitle(linkClassName)}</h3>
		</article>
	);
}

/**
 * As the "Latest news" cards: a framed image, with the entry's kind in a box at its bottom start corner, and the title
 * below. A logo keeps clear of that box. An entry without an image gets the placeholder, as do all resources, for which
 * the api has none, so the cards of a row stay alike.
 */
function ImageCard(props: Readonly<CardProps>): ReactNode {
	const { entry } = props;

	return (
		<article className="group relative">
			<div className="relative aspect-3/2 overflow-hidden border border-stroke-weak bg-background-base">
				{entry.image != null ? (
					<ApiImage
						alt=""
						className={
							entry.isPicture
								? "object-cover transition-transform duration-200 ease-out motion-safe:group-hover:scale-105 motion-safe:group-has-focus-visible:scale-105"
								: "object-contain px-3 pbs-3 pbe-14"
						}
						fill={true}
						image={entry.image}
						sizes="(min-width: 120rem) 23rem, (min-width: 80rem) 22vw, (min-width: 40rem) 45vw, 90vw"
					/>
				) : (
					<CardImagePlaceholder />
				)}
				<p className="absolute inset-s-0 inset-be-0 flex items-center gap-x-3 bg-background-base px-4 py-3 min-block-12">
					<EntryIcon icon={entry.icon} />
					<span className="text-small font-bold text-text-accent uppercase">{entry.kind}</span>
				</p>
			</div>
			<h3 className="pbs-6 font-heading text-title-4 leading-heading text-balance">
				{entry.renderTitle(imageCardLinkClassName)}
			</h3>
		</article>
	);
}
