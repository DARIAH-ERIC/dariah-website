import cn from "clsx/lite";
import { InfoIcon, UsersIcon } from "lucide-react";
import { useFormatter, useExtracted as useTranslations } from "next-intl";
import type { ReactNode } from "react";

import {
	type GovernanceBodyKind,
	type GovernanceBodySlug,
	type RelationKind,
	governanceBodies,
	relations,
} from "#/app/(app)/(default)/about/organisation-and-governance/_components/organigram-structure.ts";
import type { GovernanceBodyBase } from "#/lib/api/schemas.ts";
import { href } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

interface OrganigramProps {
	items: Array<GovernanceBodyBase>;
}

interface Body {
	slug: GovernanceBodySlug;
	kind: GovernanceBodyKind;
	acronym: string | null;
	item: GovernanceBodyBase;
}

/**
 * Where each body goes in the organigram's grid from `xl` up. The grid has three columns for the bodies - the two
 * operational columns, and the advisory bodies to their end side - with a column for the arrows between each two. The
 * rows alternate bodies and arrows, except the Board of Directors', which is split in two: the Scientific Advisory
 * Board reaches down into its first half and the Senior Management Team up into its second, so each has an arrow into
 * the Board's side. The bodies stretch over their rows, with a gap between the two advisory bodies at the Board's
 * middle. The Senior Management Team keeps to its content, at the start of its rows; the Scientific Advisory Board has
 * arrows from the General Assembly's middle and into the Board's first half, so it has to reach both, however tall the
 * cards are.
 */
const placements: Record<GovernanceBodySlug, string> = {
	"general-assembly": "xl:col-[1/4] xl:row-[1]",
	"scientific-advisory-board": "xl:col-[5] xl:row-[1/4] xl:mbe-3",
	"board-of-directors": "xl:col-[1/4] xl:row-[3/5]",
	"senior-management-team": "xl:col-[5] xl:row-[4/7] xl:self-start xl:mbs-3",
	"dariah-coordination-office": "xl:col-[1] xl:row-[6]",
	"joint-research-committee": "xl:col-[3] xl:row-[6]",
	"national-coordinator-committee": "xl:col-[1] xl:row-[8]",
	"working-groups": "xl:col-[3] xl:row-[8]",
};

type Direction = "down" | "start" | "end";

interface Connector {
	from: GovernanceBodySlug;
	to: GovernanceBodySlug;
	direction: Direction;
	placement: string;
}

/** The relations drawn as arrows, each in the grid cell between the two bodies. */
const connectors: Array<Connector> = [
	{ from: "general-assembly", to: "scientific-advisory-board", direction: "end", placement: "col-[4] row-[1]" },
	{ from: "general-assembly", to: "board-of-directors", direction: "down", placement: "col-[1/4] row-[2]" },
	{ from: "scientific-advisory-board", to: "board-of-directors", direction: "start", placement: "col-[4] row-[3]" },
	{ from: "senior-management-team", to: "board-of-directors", direction: "start", placement: "col-[4] row-[4]" },
	{ from: "board-of-directors", to: "dariah-coordination-office", direction: "down", placement: "col-[1] row-[5]" },
	{ from: "board-of-directors", to: "joint-research-committee", direction: "down", placement: "col-[3] row-[5]" },
	{
		from: "dariah-coordination-office",
		to: "joint-research-committee",
		direction: "end",
		placement: "col-[2] row-[6]",
	},
	{
		from: "dariah-coordination-office",
		to: "national-coordinator-committee",
		direction: "down",
		placement: "col-[1] row-[7]",
	},
	{ from: "joint-research-committee", to: "working-groups", direction: "down", placement: "col-[3] row-[7]" },
];

/** Each kind's colour, as `--body-color` for a body's card and `--tag-color` for a tag naming a body of that kind. */
const bodyColors: Record<GovernanceBodyKind, string> = {
	governing: "[--body-color:var(--color-governance-governing)]",
	executive: "[--body-color:var(--color-governance-executive)]",
	advisory: "[--body-color:var(--color-governance-advisory)]",
	operational: "[--body-color:var(--color-governance-operational)]",
	other: "[--body-color:var(--color-governance-other)]",
};

const tagColors: Record<GovernanceBodyKind, string> = {
	governing: "[--tag-color:var(--color-governance-governing)]",
	executive: "[--tag-color:var(--color-governance-executive)]",
	advisory: "[--tag-color:var(--color-governance-advisory)]",
	operational: "[--tag-color:var(--color-governance-operational)]",
	other: "[--tag-color:var(--color-governance-other)]",
};

function isGovernanceBodySlug(slug: string): slug is GovernanceBodySlug {
	return Object.hasOwn(governanceBodies, slug);
}

/**
 * The governance bodies and how they relate, as a chart from `xl` up and as a list of cards below it. Each card links
 * to the body's page, with its description and members.
 *
 * The bodies are a list in reading order, top down; the grid only places them. Its `display: contents` would drop the
 * list's role in some browsers, so it is set explicitly. The arrows are decoration: every relation is spelled out as a
 * tag on the body it starts from, which is what a screen reader reads, and what shows below `xl`, where there is no
 * room for the chart.
 */
export function Organigram(props: Readonly<OrganigramProps>): ReactNode {
	const { items } = props;

	const t = useTranslations();

	const bySlug = new Map<GovernanceBodySlug, Body>();

	for (const item of items) {
		const slug = item.entity.slug;

		if (isGovernanceBodySlug(slug)) {
			const { kind, acronym } = governanceBodies[slug];
			bySlug.set(slug, { slug, kind, acronym: item.acronym ?? acronym ?? null, item });
		}
	}

	const bodies = (Object.keys(governanceBodies) as Array<GovernanceBodySlug>).flatMap((slug) => {
		const body = bySlug.get(slug);

		return body == null ? [] : [body];
	});

	function getRelationLabel(kind: RelationKind): string {
		switch (kind) {
			case "appoints": {
				return t("Appoints");
			}
			case "advises": {
				return t("Advises");
			}
			case "supports": {
				return t("Supports");
			}
			case "oversees": {
				return t("Oversees");
			}
			case "represented-in": {
				return t("Represented in");
			}
		}
	}

	return (
		<section aria-label={t("Organigram")}>
			{/* Smaller below `sm`, with less padding, so the hint stays on one line on a phone. */}
			<p className="-mx-main flex items-center justify-center gap-x-1.5 bg-background-muted px-3 py-3 text-small sm:gap-x-2 sm:px-main sm:text-caption">
				<InfoIcon aria-hidden={true} className="size-3.5 shrink-0 sm:size-4" />
				{t("Select a body to see its description and members.")}
			</p>
			<div className="mbs-16 flex flex-col gap-y-8 xl:grid xl:grid-cols-[minmax(0,1fr)_8rem_minmax(0,1fr)_8rem_minmax(0,0.85fr)] xl:grid-rows-[auto_5rem_minmax(4rem,auto)_minmax(4rem,auto)_5rem_auto_5rem_auto] xl:gap-0">
				<ul className="contents" role="list">
					{bodies.map((body) => (
						<li key={body.slug} className={placements[body.slug]}>
							<BodyCard body={body} bySlug={bySlug} getRelationLabel={getRelationLabel} />
						</li>
					))}
				</ul>
				{connectors.map((connector) => {
					const relation = relations.find(
						(relation) => relation.from === connector.from && relation.to === connector.to,
					);

					if (relation == null || !bySlug.has(connector.from) || !bySlug.has(connector.to)) {
						return null;
					}

					return (
						<Arrow
							key={`${connector.from}:${connector.to}`}
							className={connector.placement}
							direction={connector.direction}
							label={getRelationLabel(relation.kind)}
						/>
					);
				})}
			</div>
		</section>
	);
}

interface BodyCardProps {
	body: Body;
	bySlug: Map<GovernanceBodySlug, Body>;
	getRelationLabel: (kind: RelationKind) => string;
}

/**
 * A body's card: its kind in a coloured header, then its acronym and name, how many members it has, its summary, and a
 * tag for each kind of relation it has to the bodies of one kind - "Appoints DCO and JRC" - in their colour. The link
 * is the heading's, and stretches over the whole card, which draws its focus outline. The working groups' card links to
 * the list of working groups rather than to a page of its own.
 */
function BodyCard(props: Readonly<BodyCardProps>): ReactNode {
	const { body, bySlug, getRelationLabel } = props;

	const t = useTranslations();
	const format = useFormatter();

	/** The working groups are not a governance body as such, so their header is left blank. */
	function getKindLabel(kind: GovernanceBodyKind): string | null {
		switch (kind) {
			case "governing": {
				return t("Governing body");
			}
			case "executive": {
				return t("Executive body");
			}
			case "advisory": {
				return t("Advisory body");
			}
			case "operational": {
				return t("Operational body");
			}
			case "other": {
				return null;
			}
		}
	}

	/** A body's chair may be listed as its member too, so people are counted once. */
	const memberCount = new Set(body.item.persons.map((person) => person.id)).size;

	const tags = new Map<string, { kind: RelationKind; targetKind: GovernanceBodyKind; targets: Array<string> }>();

	for (const relation of relations) {
		const target = bySlug.get(relation.to);

		if (relation.from !== body.slug || target == null) {
			continue;
		}

		const key = `${relation.kind}:${target.kind}`;
		const tag = tags.get(key) ?? { kind: relation.kind, targetKind: target.kind, targets: [] };
		tag.targets.push(target.acronym ?? target.item.name);
		tags.set(key, tag);
	}

	return (
		<article
			className={cn(
				"group relative flex flex-col border border-[color-mix(in_srgb,var(--body-color)_50%,transparent)] bg-background-base block-full",
				bodyColors[body.kind],
			)}
		>
			<p className="bg-(--body-color) px-4 py-2 text-badge text-text-inverse uppercase min-block-[calc(1lh+--spacing(4))]">
				{getKindLabel(body.kind)}
			</p>
			<div className="flex flex-1 flex-col gap-y-4 p-4">
				<div className="flex flex-col gap-y-3 border-s-4 border-(--body-color) ps-4">
					<div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
						<h2 className="text-title-5 leading-heading font-regular">
							<Link
								className="outline-none group-hover:underline after:absolute after:inset-0 focus-visible:after:outline-3 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus-outline focus-visible:after:outline-solid"
								href={
									body.slug === "working-groups"
										? href({ pathname: "/network/working-groups" })
										: href({
												pathname: "/about/organisation-and-governance/[slug]",
												params: { slug: body.slug },
											})
								}
								prefetch="intent"
							>
								{body.acronym != null ? <span className="font-bold text-(--body-color)">{body.acronym} </span> : null}
								{body.item.name}
							</Link>
						</h2>
						<p className="flex items-center gap-x-2 text-body font-medium">
							<UsersIcon aria-hidden={true} className="size-5 text-icon-accent" />
							<span aria-hidden={true}>{memberCount}</span>
							<span className="sr-only">
								{t("{count, plural, one {# member} other {# members}}", { count: memberCount })}
							</span>
						</p>
					</div>
					{body.item.summary != null ? <p className="text-caption leading-body">{body.item.summary}</p> : null}
				</div>
				{tags.size > 0 ? (
					<ul className="mbs-auto flex flex-wrap gap-2" role="list">
						{Array.from(tags.values(), (tag) => {
							const label = `${getRelationLabel(tag.kind)} ${format.list(tag.targets)}`;

							return (
								<li
									key={label}
									className={cn(
										"bg-[color-mix(in_srgb,var(--tag-color)_8%,transparent)] px-2 py-0.5 text-caption text-(--tag-color)",
										tagColors[tag.targetKind],
									)}
								>
									{label}
								</li>
							);
						})}
					</ul>
				) : null}
			</div>
		</article>
	);
}

interface ArrowProps {
	direction: Direction;
	label: string;
	className?: string;
}

/**
 * A dashed arrow with its label in the middle, filling its grid cell: down the middle of a row, or across the middle of
 * a column, towards the start or the end side. Hidden below `xl`, where the bodies are a plain list.
 */
function Arrow(props: Readonly<ArrowProps>): ReactNode {
	const { direction, label, className } = props;

	const isVertical = direction === "down";

	const line = cn(
		"flex-1 border-dashed border-stroke-connector",
		isVertical ? "border-s-2 min-block-2" : "border-bs-2 min-inline-2",
	);

	const head = cn(
		"shrink-0 bg-stroke-connector block-3 inline-3",
		direction === "down" && "[clip-path:polygon(0_0,100%_0,50%_100%)]",
		direction === "end" && "[clip-path:polygon(0_0,100%_50%,0_100%)] rtl:[clip-path:polygon(100%_0,0_50%,100%_100%)]",
		direction === "start" && "[clip-path:polygon(100%_0,0_50%,100%_100%)] rtl:[clip-path:polygon(0_0,100%_50%,0_100%)]",
	);

	return (
		<div
			aria-hidden={true}
			className={cn(
				"hidden items-center xl:flex",
				isVertical ? "flex-col py-1" : "flex-row px-1",
				direction === "start" && "flex-row-reverse",
				className,
			)}
		>
			<div className={line} />
			<span className="bg-background-muted px-2 py-0.5 text-small font-bold whitespace-nowrap">{label}</span>
			<div className={line} />
			<div className={head} />
		</div>
	);
}
