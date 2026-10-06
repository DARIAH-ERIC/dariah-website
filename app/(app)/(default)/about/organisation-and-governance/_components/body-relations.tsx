import { useFormatter, useExtracted as useTranslations } from "next-intl";
import { type ReactNode, useId } from "react";

import {
	type GovernanceBodySlug,
	type RelationKind,
	governanceBodies,
	relations,
} from "#/app/(app)/(default)/about/organisation-and-governance/_components/organigram-structure.ts";
import type { GovernanceBodyBase } from "#/lib/api/schemas.ts";
import { href } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

interface BodyRelationsProps {
	slug: string;
	items: Array<GovernanceBodyBase>;
}

type Direction = "incoming" | "outgoing";

/** The order the rows are listed in: how the body is appointed and advised first, then what it does itself. */
const rows: Array<{ direction: Direction; kind: RelationKind }> = [
	{ direction: "incoming", kind: "appoints" },
	{ direction: "incoming", kind: "advises" },
	{ direction: "incoming", kind: "supports" },
	{ direction: "incoming", kind: "oversees" },
	{ direction: "incoming", kind: "represented-in" },
	{ direction: "outgoing", kind: "appoints" },
	{ direction: "outgoing", kind: "advises" },
	{ direction: "outgoing", kind: "supports" },
	{ direction: "outgoing", kind: "oversees" },
	{ direction: "outgoing", kind: "represented-in" },
];

function isGovernanceBodySlug(slug: string): slug is GovernanceBodySlug {
	return Object.hasOwn(governanceBodies, slug);
}

/**
 * How a body relates to the others, both ways, as the organigram draws it (see `organigram-structure.ts`): on a body's
 * own page there is no chart to show the relations to it, so these are listed as well as its own, each body by its full
 * name, linking to its page. A body the api does not publish is left out, and with no relations the section is too. The
 * heading is set as the members' groups are (see `PersonGroup`). The space below is 32px more than between those
 * groups, where a person's photo ends well above their card's last line: otherwise the gap looks narrower here.
 */
export function BodyRelations(props: Readonly<BodyRelationsProps>): ReactNode {
	const { slug, items } = props;

	const t = useTranslations();
	const format = useFormatter();

	const headingId = useId();

	if (!isGovernanceBodySlug(slug)) {
		return null;
	}

	const bySlug = new Map(items.map((item) => [item.entity.slug, item]));
	const order = Object.keys(governanceBodies);

	function getLabel(direction: Direction, kind: RelationKind): string {
		if (direction === "incoming") {
			switch (kind) {
				case "appoints": {
					return t("Appointed by");
				}
				case "advises": {
					return t("Advised by");
				}
				case "supports": {
					return t("Supported by");
				}
				case "oversees": {
					return t("Overseen by");
				}
				case "represented-in": {
					return t("Includes representatives of");
				}
			}
		}

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

	const facts = rows.flatMap(({ direction, kind }) => {
		const targets = relations
			.filter((relation) => relation.kind === kind && (direction === "incoming" ? relation.to : relation.from) === slug)
			.map((relation) => (direction === "incoming" ? relation.from : relation.to))
			.filter((target) => bySlug.has(target))
			.toSorted((a, b) => order.indexOf(a) - order.indexOf(b));

		return targets.length === 0 ? [] : [{ label: getLabel(direction, kind), targets }];
	});

	if (facts.length === 0) {
		return null;
	}

	return (
		<section aria-labelledby={headingId} className="mbs-16 pbe-8">
			<h2
				className="text-small font-bold text-text-strong after:mbs-4 after:block after:block-0.5 after:inline-17.5 after:bg-stroke-weak"
				id={headingId}
			>
				{t("Relations")}
			</h2>
			<dl className="mbs-6 grid grid-cols-[max-content_minmax(0,1fr)] gap-x-8 gap-y-3">
				{facts.map((fact) => (
					<div key={fact.label} className="col-span-full grid grid-cols-subgrid">
						<dt className="font-bold text-text-strong">{fact.label}</dt>
						<dd>
							{format.list(
								fact.targets.map((target) => (
									<Link
										key={target}
										className="font-medium text-text-accent underline hover:no-underline focus-visible-outline"
										href={
											target === "working-groups"
												? href({ pathname: "/network/working-groups" })
												: href({
														pathname: "/about/organisation-and-governance/[slug]",
														params: { slug: target },
													})
										}
										prefetch="intent"
									>
										{bySlug.get(target)?.name}
									</Link>
								)),
							)}
						</dd>
					</div>
				))}
			</dl>
		</section>
	);
}
