import cn from "clsx/lite";
import { ChevronRightIcon } from "lucide-react";
import { useExtracted as useTranslations } from "next-intl";
import { getExtracted as getTranslations } from "next-intl/server";
import { type ReactNode, cache, use, useId } from "react";

import logo from "#/assets/images/logo-dariah-eu-white.svg";
import { ApiImage } from "#/components/api-image.tsx";
import { Image } from "#/components/image.tsx";
import type { ImpactCaseStudy } from "#/lib/api/schemas.ts";
import { href } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

/**
 * A person as the api embeds them in another item, e.g. a case study's contributor or a working group's chair: their
 * name, portrait and positions, which is all a card needs. Each embedding adds a `role` of its own, which is not.
 */
export type Person = Omit<ImpactCaseStudy["contributors"][number], "role">;

interface PersonGroupProps {
	persons: Array<Person>;
	label: string;
	/** The group's heading level: its cards' titles are one level below it. */
	headingLevel?: 2 | 3;
	/**
	 * The list's grid, by default as many columns as fit cards at least 28rem wide - two from `lg` where the content has
	 * the page's width to itself, one where the related content sits beside it, e.g. at `xl`, so the positions are not
	 * squeezed into a few words to a line.
	 */
	listClassName?: string;
}

/**
 * People under a common heading, e.g. a case study's lead authors or a working group's chairs, in the order given. The
 * heading is underlined by a short rule, as the design does, drawn by the heading itself.
 */
export function PersonGroup(props: Readonly<PersonGroupProps>): ReactNode {
	const {
		persons,
		label,
		headingLevel = 3,
		listClassName = "grid-cols-[repeat(auto-fill,minmax(min(28rem,100%),1fr))]",
	} = props;

	const Heading = headingLevel === 2 ? "h2" : "h3";

	const headingId = useId();

	return (
		<section aria-labelledby={headingId}>
			<Heading
				className="text-small font-bold text-text-strong after:mbs-4 after:block after:block-0.5 after:inline-17.5 after:bg-stroke-weak"
				id={headingId}
			>
				{label}
			</Heading>
			<ul className={cn("mbs-6 grid gap-x-gutter gap-y-10", listClassName)} role="list">
				{persons.map((person) => (
					<li key={person.id}>
						<PersonCard headingLevel={headingLevel === 2 ? 3 : 4} person={person} />
					</li>
				))}
			</ul>
		</section>
	);
}

interface PersonCardProps {
	person: Person;
	headingLevel?: 3 | 4;
}

/**
 * The link's label is the generic "Read more", so the person's name follows it in the link's name - "Read more <name>",
 * starting with what is visible, which voice control users say to activate it (wcag 2.5.3, label in name). It stretches
 * over the whole card, which draws its focus outline.
 *
 * The image is 136px wide at every width, beside the text from `sm` up and above it on a phone, where beside it would
 * leave the text a column too narrow to read - a few words to a line. A person without a portrait gets the DARIAH-EU
 * logo in white on grey instead: a true gray, like `background-strong`.
 *
 * The positions are secondary to the name, smaller and in a weaker colour, so a long list of them does not outweigh it.
 * The roles come first, the institutional affiliation on a line of its own below them, as it says where the person
 * works rather than what they do. Both are set tight, as a card's text is, so they are capped at a card's short
 * measure: where the card has a row to itself - one column - they would otherwise run the whole width of the page.
 */
export function PersonCard(props: Readonly<PersonCardProps>): ReactNode {
	const { person, headingLevel = 4 } = props;

	const Heading = headingLevel === 3 ? "h3" : "h4";

	const t = useTranslations();

	const nameId = useId();
	const labelId = useId();

	const getPositionLabel = usePositionLabel();

	const rankedPositions = getRankedPositions(person.positions ?? []);

	function getLabels(positions: Array<Position>): Array<string> {
		return Array.from(new Set(positions.map((position) => getPositionLabel(position))));
	}

	const roles = getLabels(rankedPositions.filter((position) => !isAffiliation(position)));
	const affiliations = getLabels(rankedPositions.filter((position) => isAffiliation(position)));

	return (
		<article className="group relative flex flex-col items-start gap-y-4 sm:flex-row sm:gap-x-4">
			<div className="relative size-34 shrink-0">
				{person.image != null ? (
					<ApiImage alt="" className="object-cover" fill={true} image={person.image} sizes="8.5rem" />
				) : (
					<div className="grid size-full place-items-center bg-background-placeholder px-[7%]">
						<Image alt="" className="block-auto inline-full" src={logo} />
					</div>
				)}
			</div>
			<div className="flex min-inline-0 flex-col gap-y-2 pbs-1">
				<Heading
					className="text-title-4 leading-heading text-text-strong [text-box:trim-start_cap_alphabetic]"
					id={nameId}
				>
					{person.name}
				</Heading>
				{roles.length > 0 || affiliations.length > 0 ? (
					<div className="flex max-inline-[50ch] flex-col gap-y-1 text-caption leading-heading text-text-weak">
						{roles.length > 0 ? <p>{roles.join(", ")}</p> : null}
						{affiliations.length > 0 ? <p>{affiliations.join(", ")}</p> : null}
					</div>
				) : null}
				<Link
					aria-labelledby={`${labelId} ${nameId}`}
					className="mbs-2 inline-flex items-center gap-2 self-start text-body font-medium text-text-strong underline-offset-4 outline-none group-hover:underline after:absolute after:inset-0 focus-visible:after:outline-3 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus-outline focus-visible:after:outline-solid"
					href={href({ pathname: "/persons/[slug]", params: { slug: person.slug } })}
					prefetch="intent"
				>
					<span id={labelId}>{t("Read more")}</span>
					<ChevronRightIcon aria-hidden={true} className="size-4 text-icon-accent" strokeWidth={2.5} />
				</Link>
			</div>
		</article>
	);
}

export type Position = NonNullable<Person["positions"]>[number];

/**
 * How a position reads in a person's description, e.g. "Chair of the Joint Research Committee" or "National Coordinator
 * of Austria".
 *
 * Async, so `generateMetadata` can use it as well as components, through `usePositionLabel`. The labels are written
 * only here: message extraction picks up a `t` bound in the same function, so one cannot be passed in from a hook.
 * Cached per request, so the hook resolves the same promise each time, as next-intl's own hooks do.
 */
export const getPositionLabeler = cache(async (): Promise<(position: Position) => string> => {
	const t = await getTranslations();

	function getPositionLabel(position: Position): string {
		const { description, entity, role } = position;

		if (role === "national_representative") {
			return t("National Representative of {country}", { country: entity.label });
		}

		if (role === "national_representative_deputy") {
			return t("National Representative Deputy of {country}", { country: entity.label });
		}

		if (role === "national_coordinator") {
			return t("National Coordinator of {country}", { country: entity.label });
		}

		if (role === "national_coordinator_deputy") {
			return t("National Coordinator Deputy of {country}", { country: entity.label });
		}

		if (role === "national_coordination_staff") {
			return t("National Coordination Staff of {country}", { country: entity.label });
		}

		if (entity.slug === "board-of-directors") {
			return role === "is_chair_of" ? t("DARIAH-EU Director (President of the Board)") : t("DARIAH-EU Director");
		}

		if (entity.slug === "dariah-coordination-office" && description != null) {
			return description;
		}

		const name =
			entity.type === "working_group"
				? t("{name} Working Group", { name: entity.label })
				: (getGovernanceBodyName(entity.slug) ?? entity.label);

		if (role === "is_chair_of") {
			return t("Chair of the {name}", { name });
		}

		if (role === "is_vice_chair_of") {
			return t("Vice-chair of the {name}", { name });
		}

		if (role === "is_member_of") {
			return t("Member of the {name}", { name });
		}

		if (role === "is_contact_for") {
			return t("Contact for the {name}", { name });
		}

		return entity.label;
	}

	/** The api's names are not consistently title-cased ("Senior management team"), which reads oddly mid-sentence. */
	function getGovernanceBodyName(slug: string): string | null {
		switch (slug) {
			case "general-assembly": {
				return t("General Assembly");
			}
			case "national-coordinator-committee": {
				return t("National Coordinator Committee");
			}
			case "senior-management-team": {
				return t("Senior Management Team");
			}
			case "dariah-coordination-office": {
				return t("DARIAH Coordination Office");
			}
			case "joint-research-committee": {
				return t("Joint Research Committee");
			}
			case "scientific-advisory-board": {
				return t("Scientific Advisory Board");
			}
			default: {
				return null;
			}
		}
	}

	return getPositionLabel;
});

/** `getPositionLabeler` as a hook, for components. */
export function usePositionLabel(): (position: Position) => string {
	return use(getPositionLabeler());
}

const nationalRoles: Array<Position["role"]> = [
	"national_representative",
	"national_representative_deputy",
	"national_coordinator",
	"national_coordinator_deputy",
	"national_coordination_staff",
];

/** Governance bodies by slug, the api has no other stable way to tell them apart. */
const governanceBodies = [
	"general-assembly",
	"board-of-directors",
	"national-coordinator-committee",
	"senior-management-team",
	"dariah-coordination-office",
	"joint-research-committee",
	"scientific-advisory-board",
];

const leadershipRoles: Array<Position["role"]> = ["is_chair_of", "is_vice_chair_of", "is_member_of"];

/**
 * Where a position goes in a person's description, as a sort key compared element by element, or `null` for a position
 * the description leaves out. A country's representation and coordination come first, then the governance bodies, from
 * the General Assembly down to the Scientific Advisory Board, then working groups and last the institutional
 * affiliation. Only the General Assembly's and the working groups' chairs are listed, not their members; other
 * relations, e.g. being a body's contact, are left to the person's own page.
 */
function getPositionRank(position: Position): Array<number> | null {
	const { entity, role } = position;

	if (entity.type === "country") {
		const index = nationalRoles.indexOf(role);

		return index === -1 ? null : [0, index];
	}

	if (entity.type === "governance_body") {
		const body = governanceBodies.indexOf(entity.slug);
		const index = leadershipRoles.indexOf(role);

		if (body === -1 || index === -1 || (entity.slug === "general-assembly" && role === "is_member_of")) {
			return null;
		}

		return [1, body, index];
	}

	if (entity.type === "working_group") {
		const index = leadershipRoles.indexOf(role);

		return index === -1 || role === "is_member_of" ? null : [2, index];
	}

	if (entity.type === "institution" && role === "is_affiliated_with") {
		return [3];
	}

	return null;
}

function compareRanks(a: Array<number>, b: Array<number>): number {
	for (let i = 0; i < Math.max(a.length, b.length); i++) {
		const difference = (a[i] ?? -1) - (b[i] ?? -1);

		if (difference !== 0) {
			return difference;
		}
	}

	return 0;
}

/**
 * Where a position goes on the person's own page, which lists all of them: those a card lists (see `getPositionRank`)
 * in the same order, and the rest after the kind they belong with, e.g. a working group's member after its chairs, and
 * anything else, like a body's contact, last.
 */
function getFullPositionRank(position: Position): Array<number> {
	const rank = getPositionRank(position);

	if (rank != null) {
		return rank;
	}

	const { entity, role } = position;

	if (entity.type === "country") {
		return [0, nationalRoles.length];
	}

	if (entity.type === "governance_body" && leadershipRoles.includes(role)) {
		const body = governanceBodies.indexOf(entity.slug);

		return [1, body === -1 ? governanceBodies.length : body, leadershipRoles.indexOf(role)];
	}

	if (entity.type === "working_group" && leadershipRoles.includes(role)) {
		return [2, leadershipRoles.indexOf(role)];
	}

	return [4];
}

/**
 * Positions in description order; positions of equal rank keep the api's order. A body's chair or vice-chair is listed
 * as its member too, so only the highest of these roles is kept per body.
 */
function rankPositions(
	positions: ReadonlyArray<Position>,
	getRank: (position: Position) => Array<number> | null,
): Array<Position> {
	const bodies = new Set<string>();

	return positions
		.flatMap((position) => {
			const rank = getRank(position);

			return rank == null ? [] : [{ position, rank }];
		})
		.toSorted((a, b) => compareRanks(a.rank, b.rank))
		.map(({ position }) => position)
		.filter((position) => {
			if (!leadershipRoles.includes(position.role)) {
				return true;
			}

			if (bodies.has(position.entity.id)) {
				return false;
			}

			bodies.add(position.entity.id);

			return true;
		});
}

/** Whether a position is a person's institutional affiliation, which a card lists apart from their roles. */
function isAffiliation(position: Position): boolean {
	return position.entity.type === "institution" && position.role === "is_affiliated_with";
}

/** The positions a card, or a page's `description`, describes a person by. */
export function getRankedPositions(positions: ReadonlyArray<Position>): Array<Position> {
	return rankPositions(positions, getPositionRank);
}

/** All of a person's current positions, for their own page. */
export function getAllRankedPositions(positions: ReadonlyArray<Position>): Array<Position> {
	return rankPositions(positions, getFullPositionRank);
}

/** The day before a calendar date, as `YYYY-MM-DD`. */
function getDayBefore(date: string): string {
	const day = new Date(`${date.slice(0, 10)}T00:00:00.000Z`);

	day.setUTCDate(day.getUTCDate() - 1);

	return day.toISOString().slice(0, 10);
}

/**
 * The former positions worth listing on a person's own page. A past institutional affiliation is left out. So is a
 * membership that runs on without a break into a role the person still holds on the same body: the api allows one role
 * at a time, so a member who becomes the body's chair has their membership ended the day before, and a membership can
 * be split in two the same way, although the person never left the body. Such a span may be pieced together from
 * several former positions, e.g. a membership that led into a vice-chair's term that led into the current chair's.
 */
export function getFormerPositions(
	positions: ReadonlyArray<Position>,
	formerPositions: ReadonlyArray<Position>,
): Array<Position> {
	/** Per entity, the day the person's unbroken run of roles on it, up to now, began. */
	const since = new Map<string, string>();

	for (const position of positions) {
		if (!leadershipRoles.includes(position.role)) {
			continue;
		}

		const start = position.duration.start.slice(0, 10);
		const current = since.get(position.entity.id);

		if (current == null || start < current) {
			since.set(position.entity.id, start);
		}
	}

	/** Whether a former position lasted up to the day before the run on its entity began, or into it. */
	function isContinued(position: Position): boolean {
		const start = since.get(position.entity.id);
		const end = position.duration.end?.slice(0, 10);

		return start != null && end != null && end >= getDayBefore(start);
	}

	const former = formerPositions.filter((position) => leadershipRoles.includes(position.role));

	/** Each former position that extends a run back may in turn let an earlier one extend it, so until none does. */
	let isExtended = true;

	while (isExtended) {
		isExtended = false;

		for (const position of former) {
			const start = position.duration.start.slice(0, 10);
			const current = since.get(position.entity.id);

			if (current != null && start < current && isContinued(position)) {
				since.set(position.entity.id, start);
				isExtended = true;
			}
		}
	}

	return formerPositions.filter((position) => {
		if (position.role === "is_affiliated_with") {
			return false;
		}

		return !(position.role === "is_member_of" && isContinued(position));
	});
}
