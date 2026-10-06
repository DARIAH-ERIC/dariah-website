import cn from "clsx/lite";
import type { Metadata } from "next";
import { useExtracted as useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode, Suspense } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { ContentLayout } from "#/components/content-layout.tsx";
import { EntityIntro, EntityIntroSkeleton } from "#/components/entity-intro.tsx";
import { PageHeader, PageHeaderSkeleton } from "#/components/page-header.tsx";
import { PersonGroup } from "#/components/person-card.tsx";
import type { WorkingGroup } from "#/lib/api/schemas.ts";
import { getWorkingGroupBySlug, getWorkingGroupSlugs } from "#/lib/data/working-groups.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href, unsafeHref } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";
import { toContentBlocksPlainText } from "#/lib/rich-text.ts";

interface WorkingGroupPageProps extends PageProps<"/network/working-groups/[slug]"> {}

/**
 * A link's prefetch of this page - see `Link`'s `prefetch="intent"` - is served from static output, never rendered per
 * request. Every slug known at build time is prerendered; for one that is not, the prefetch holds the skeleton.
 */
export const ensureStatic = "prefetch";

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
	const slugs = await getWorkingGroupSlugs();

	return slugs.map((slug) => {
		return { slug };
	});
}

/**
 * An unknown slug is answered with `notFound()` here as well as in the page: html-limited bots (see `htmlLimitedBots`)
 * get metadata before the response starts, so for them that is a real `404` status, where the page's own call, inside a
 * Suspense boundary, comes too late for anything but a `noindex`.
 */
export async function generateMetadata(props: Readonly<WorkingGroupPageProps>): Promise<Metadata> {
	const { slug } = await props.params;

	const item = await getWorkingGroupBySlug(slug);

	if (item == null) {
		notFound();
	}

	return createMetadata({
		href: href({ pathname: "/network/working-groups/[slug]", params: { slug } }),
		title: item.name,
		description: item.summary ?? toContentBlocksPlainText(item.description),
		image: item.image,
	});
}

/**
 * The page depends on the slug, so it streams in behind the header's skeleton. The skeleton is the route's app shell,
 * which a link to any such page prefetches, so following one shows it at once; a slug known at build time is
 * prerendered whole.
 */
export default function WorkingGroupPage(props: Readonly<WorkingGroupPageProps>): ReactNode {
	return (
		<Main className="px-main">
			<Suspense
				fallback={
					<PageHeaderSkeleton
						parent={href({ pathname: "/network/working-groups" })}
						titleLines={{ base: 2, sm: 1, lg: 1 }}
					>
						<EntityIntroSkeleton />
					</PageHeaderSkeleton>
				}
			>
				<WorkingGroupContent params={props.params} />
			</Suspense>
		</Main>
	);
}

async function WorkingGroupContent(props: Pick<WorkingGroupPageProps, "params">): Promise<ReactNode> {
	const { slug } = await props.params;

	const item = await getWorkingGroupBySlug(slug);

	if (item == null) {
		notFound();
	}

	return (
		<Fragment>
			<PageHeader
				image={null}
				current={href({ pathname: "/network/working-groups/[slug]", params: { slug } })}
				parent={href({ pathname: "/network/working-groups" })}
				title={item.name}
			/>
			<ContentLayout
				related="related-content"
				tableOfContents={false}
				intro={
					<EntityIntro logo={item.image}>
						{item.acronym != null || item.email != null || item.mailingList != null ? (
							<WorkingGroupDetails item={item} />
						) : null}
					</EntityIntro>
				}
				blocks={item.description}
				relatedEntities={item.relatedEntities}
				relatedResources={item.relatedResources}
			>
				<Chairs chairs={item.chairs} />
			</ContentLayout>
		</Fragment>
	);
}

/** Set as a link in the content is (see `prose`). */
const linkClassName = "font-medium text-text-accent underline hover:no-underline focus-visible-outline";

interface WorkingGroupDetailsProps {
	item: WorkingGroup;
}

/**
 * The group's acronym, contact address and mailing list, beside its logo at the top of the content - only for a group
 * with any of them, so the logo is otherwise left on its own. A mailing list is an address to write to, or the url of
 * the list's page.
 */
function WorkingGroupDetails(props: Readonly<WorkingGroupDetailsProps>): ReactNode {
	const { item } = props;

	const t = useTranslations();

	return (
		<Fragment>
			{item.acronym != null ? <p className="font-heading text-title-4 font-regular">{item.acronym}</p> : null}
			{item.email != null ? (
				<p className="text-text-weak">
					{t("Contact")}{" "}
					<Link className={linkClassName} href={unsafeHref(`mailto:${item.email}`, true)}>
						{item.email}
					</Link>
				</p>
			) : null}
			{item.mailingList != null ? (
				<p className="text-text-weak">
					{t("Mailing list")}{" "}
					<Link
						className={cn(linkClassName, "break-all")}
						href={unsafeHref(
							/^https?:\/\//.test(item.mailingList) ? item.mailingList : `mailto:${item.mailingList}`,
							true,
						)}
					>
						{item.mailingList}
					</Link>
				</p>
			) : null}
		</Fragment>
	);
}

type Chair = WorkingGroup["chairs"][number];

interface ChairsProps {
	chairs: Array<Chair>;
}

/** The order the groups are listed in, chairs first. */
const chairRoles = ["is_chair_of", "is_vice_chair_of"] satisfies Array<Chair["role"]>;

/**
 * The group's chairs and vice-chairs, below its description, each under a heading of its own; a group nobody is in is
 * left out. The cards are the case study contributors' (see `PersonCard`), one to a row, since the content column is
 * too narrow for two.
 */
function Chairs(props: Readonly<ChairsProps>): ReactNode {
	const { chairs } = props;

	const t = useTranslations();

	function getRoleLabel(role: (typeof chairRoles)[number], count: number): string {
		switch (role) {
			case "is_chair_of": {
				return t("{count, plural, one {Chair} other {Chairs}}", { count });
			}
			case "is_vice_chair_of": {
				return t("{count, plural, one {Vice-chair} other {Vice-chairs}}", { count });
			}
		}
	}

	return (
		<Fragment>
			{chairRoles.map((role) => {
				const members = chairs.filter((chair) => chair.role === role);

				if (members.length === 0) {
					return null;
				}

				return (
					<div key={role} className="mbs-16">
						<PersonGroup
							headingLevel={2}
							label={getRoleLabel(role, members.length)}
							listClassName=""
							persons={members}
						/>
					</div>
				);
			})}
		</Fragment>
	);
}
