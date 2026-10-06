import type { Metadata } from "next";
import { useExtracted as useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode, Suspense } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { BodyRelations } from "#/app/(app)/(default)/about/organisation-and-governance/_components/body-relations.tsx";
import { ContentLayout } from "#/components/content-layout.tsx";
import { FeaturedImage } from "#/components/featured-image.tsx";
import { PageHeader, PageHeaderSkeleton } from "#/components/page-header.tsx";
import { PersonGroup } from "#/components/person-card.tsx";
import type { GovernanceBody } from "#/lib/api/schemas.ts";
import { getGovernanceBodies, getGovernanceBodyBySlug, getGovernanceBodySlugs } from "#/lib/data/governance-bodies.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";
import { toContentBlocksPlainText } from "#/lib/rich-text.ts";

interface GovernanceBodyPageProps extends PageProps<"/about/organisation-and-governance/[slug]"> {}

/**
 * A link's prefetch of this page - see `Link`'s `prefetch="intent"` - is served from static output, never rendered per
 * request. Every slug known at build time is prerendered; for one that is not, the prefetch holds the skeleton.
 */
export const ensureStatic = "prefetch";

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
	const slugs = await getGovernanceBodySlugs();

	return slugs.map((slug) => {
		return { slug };
	});
}

/**
 * An unknown slug is answered with `notFound()` here as well as in the page: html-limited bots (see `htmlLimitedBots`)
 * get metadata before the response starts, so for them that is a real `404` status, where the page's own call, inside a
 * Suspense boundary, comes too late for anything but a `noindex`.
 */
export async function generateMetadata(props: Readonly<GovernanceBodyPageProps>): Promise<Metadata> {
	const { slug } = await props.params;

	const item = await getGovernanceBodyBySlug(slug);

	if (item == null) {
		notFound();
	}

	return createMetadata({
		href: href({ pathname: "/about/organisation-and-governance/[slug]", params: { slug } }),
		title: item.name,
		description: item.summary ?? toContentBlocksPlainText(item.description),
		image: item.image,
	});
}

/** A governance body's description and members, linked from the organigram on the organisation and governance page. */
/**
 * The page depends on the slug, so it streams in behind the header's skeleton. The skeleton is the route's app shell,
 * which a link to any such page prefetches, so following one shows it at once; a slug known at build time is
 * prerendered whole.
 */
export default function GovernanceBodyPage(props: Readonly<GovernanceBodyPageProps>): ReactNode {
	return (
		<Main className="px-main">
			<Suspense
				fallback={
					<PageHeaderSkeleton
						parent={href({ pathname: "/about/organisation-and-governance" })}
						titleLines={{ base: 2, sm: 1, lg: 1 }}
					/>
				}
			>
				<GovernanceBodyContent params={props.params} />
			</Suspense>
		</Main>
	);
}

async function GovernanceBodyContent(props: Pick<GovernanceBodyPageProps, "params">): Promise<ReactNode> {
	const { slug } = await props.params;

	const [item, items] = await Promise.all([getGovernanceBodyBySlug(slug), getGovernanceBodies()]);

	if (item == null) {
		notFound();
	}

	return (
		<Fragment>
			<PageHeader
				current={href({ pathname: "/about/organisation-and-governance/[slug]", params: { slug } })}
				image={null}
				parent={href({ pathname: "/about/organisation-and-governance" })}
				title={item.name}
			/>
			<ContentLayout
				related="related-content"
				tableOfContents={false}
				blocks={item.description}
				relatedEntities={item.relatedEntities}
				relatedResources={item.relatedResources}
			>
				<FeaturedImage image={item.image} isPriority={false} />
				<BodyRelations items={items} slug={slug} />
				<Members persons={item.persons} slug={slug} />
			</ContentLayout>
		</Fragment>
	);
}

type Member = GovernanceBody["persons"][number];

interface MembersProps {
	persons: Array<Member>;
	slug: string;
}

/** The order the roles are listed in, chairs first. */
const memberRoles = ["is_chair_of", "is_vice_chair_of", "is_member_of"] satisfies Array<Member["role"]>;

type MemberRole = (typeof memberRoles)[number];

/**
 * The body's members, chairs and vice-chairs first, each group under a heading of its own; a group nobody is in is left
 * out. A chair may be listed as a member too, so each person is only listed under their highest role. The cards are one
 * to a row, as a working group's chairs are, since the content column is too narrow for two.
 *
 * The board of directors' members are all directors, so they are one group: its chair, the president of the board, is
 * not set apart under a heading of their own, only listed first and named as president on their card.
 */
function Members(props: Readonly<MembersProps>): ReactNode {
	const { persons, slug } = props;

	const t = useTranslations();

	/** Each group's roles, in order, and the role its heading is named for. */
	const groups: Array<{ label: MemberRole; roles: Array<MemberRole> }> =
		slug === "board-of-directors"
			? [{ label: "is_member_of", roles: memberRoles }]
			: memberRoles.map((role) => {
					return { label: role, roles: [role] };
				});

	function getGroupLabel(role: MemberRole, count: number): string {
		if (slug === "board-of-directors") {
			return t("{count, plural, one {Director} other {Directors}}", { count });
		}

		switch (role) {
			case "is_chair_of": {
				return t("{count, plural, one {Chair} other {Chairs}}", { count });
			}
			case "is_vice_chair_of": {
				return t("{count, plural, one {Vice-chair} other {Vice-chairs}}", { count });
			}
			case "is_member_of": {
				return t("{count, plural, one {Member} other {Members}}", { count });
			}
		}
	}

	const listed = new Set<string>();

	return (
		<Fragment>
			{groups.map(({ label, roles }) => {
				const members = roles.flatMap((role) =>
					persons.filter((person) => {
						if (person.role !== role || listed.has(person.id)) {
							return false;
						}

						listed.add(person.id);

						return true;
					}),
				);

				if (members.length === 0) {
					return null;
				}

				return (
					<div key={label} className="mbs-16">
						<PersonGroup
							headingLevel={2}
							label={getGroupLabel(label, members.length)}
							listClassName=""
							persons={members}
						/>
					</div>
				);
			})}
		</Fragment>
	);
}
