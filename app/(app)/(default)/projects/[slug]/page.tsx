import type { Metadata } from "next";
import { useFormatter, useLocale, useExtracted as useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode, Suspense, useId } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { ContentLayout } from "#/components/content-layout.tsx";
import { EntityIntro, EntityIntroSkeleton } from "#/components/entity-intro.tsx";
import { PageHeader, PageHeaderSkeleton } from "#/components/page-header.tsx";
import type { DariahProject, DariahProjectInstitution } from "#/lib/api/schemas.ts";
import { getDariahProjectBySlug, getDariahProjectSlugs } from "#/lib/data/dariah-projects.ts";
import { sortByName } from "#/lib/i18n/sort-by-name.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";
import { toContentBlocksPlainText } from "#/lib/rich-text.ts";

interface DariahProjectPageProps extends PageProps<"/projects/[slug]"> {}

/**
 * A link's prefetch of this page - see `Link`'s `prefetch="intent"` - is served from static output, never rendered per
 * request. Every slug known at build time is prerendered; for one that is not, the prefetch holds the skeleton.
 */
export const ensureStatic = "prefetch";

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
	const slugs = await getDariahProjectSlugs();

	return slugs.map((slug) => {
		return { slug };
	});
}

/**
 * An unknown slug is answered with `notFound()` here as well as in the page: html-limited bots (see `htmlLimitedBots`)
 * get metadata before the response starts, so for them that is a real `404` status, where the page's own call, inside a
 * Suspense boundary, comes too late for anything but a `noindex`.
 */
export async function generateMetadata(props: Readonly<DariahProjectPageProps>): Promise<Metadata> {
	const { slug } = await props.params;

	const item = await getDariahProjectBySlug(slug);

	if (item == null) {
		notFound();
	}

	return createMetadata({
		href: href({ pathname: "/projects/[slug]", params: { slug } }),
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
export default function DariahProjectPage(props: Readonly<DariahProjectPageProps>): ReactNode {
	return (
		<Main className="px-main">
			<Suspense
				fallback={
					<PageHeaderSkeleton parent={href({ pathname: "/projects" })}>
						<EntityIntroSkeleton />
					</PageHeaderSkeleton>
				}
			>
				<DariahProjectContent params={props.params} />
			</Suspense>
		</Main>
	);
}

async function DariahProjectContent(props: Pick<DariahProjectPageProps, "params">): Promise<ReactNode> {
	const { slug } = await props.params;

	const item = await getDariahProjectBySlug(slug);

	if (item == null) {
		notFound();
	}

	return (
		<Fragment>
			<PageHeader
				image={null}
				current={href({ pathname: "/projects/[slug]", params: { slug } })}
				parent={href({ pathname: "/projects" })}
				title={item.name}
			/>
			<ContentLayout
				related="related-content"
				tableOfContents={false}
				intro={
					<EntityIntro logo={item.image}>
						<ProjectFacts project={item} />
					</EntityIntro>
				}
				blocks={item.description}
				relatedEntities={item.relatedEntities}
				relatedResources={item.relatedResources}
			>
				<Partners project={item} />
			</ContentLayout>
		</Fragment>
	);
}

/** Set as a link in the content is (see `prose`). */
const linkClassName = "font-medium text-text-accent underline hover:no-underline focus-visible-outline";

interface ProjectFactsProps {
	project: DariahProject;
}

/**
 * The project's duration, EU contribution, topic, coordinator and call, as a list of terms, beside its logo at the top
 * of the content (see `EntityIntro`), as a working group's details are; a fact the project does not have is left out.
 * The api gives the topic, and possibly the call, as a link to the EU funding portal, which is labelled with its last
 * path segment - the topic's code, e.g. `HORIZON-INFRA-2025-01-EOSC-04` - rather than the long url. The contribution is
 * in euros, with cents where the api has them; the coordinators link to their websites, as the participants do.
 *
 * Above them is the project's acronym, set as a working group's is (see `WorkingGroupDetails`): it is what a project is
 * known by, and what its logo - decorative, see `EntityIntro` - usually shows. An acronym which only repeats the name,
 * e.g. "ERIC Forum", is left out.
 */
function ProjectFacts(props: Readonly<ProjectFactsProps>): ReactNode {
	const { project } = props;

	const t = useTranslations();
	const format = useFormatter();

	const { start, end } = project.duration;
	const options = { dateStyle: "long", timeZone: "UTC" } as const;
	const duration =
		end == null
			? t("from {date}", { date: format.dateTime(new Date(start), options) })
			: format.dateTimeRange(new Date(start), new Date(end), options);

	const funding =
		project.funding != null
			? format.number(project.funding, { style: "currency", currency: "EUR", trailingZeroDisplay: "stripIfInteger" })
			: null;

	const facts: Array<{ label: string; value: ReactNode }> = [
		{ label: t("Duration"), value: duration },
		{ label: t("EU contribution"), value: funding },
		{ label: t("Topic"), value: isPresent(project.topic) ? <LinkOrText value={project.topic} /> : null },
		{
			label: t("{count, plural, one {Coordinator} other {Coordinators}}", { count: project.coordinators.length }),
			value:
				project.coordinators.length > 0 ? (
					<ul className="flex flex-col gap-y-1" role="list">
						{project.coordinators.map((coordinator) => (
							<li key={coordinator.id}>
								<PartnerLink partner={coordinator} />
							</li>
						))}
					</ul>
				) : null,
		},
		{ label: t("Call"), value: isPresent(project.call) ? <LinkOrText value={project.call} /> : null },
	];

	const hasAcronym = isPresent(project.acronym) && project.acronym.toLowerCase() !== project.name.toLowerCase();

	return (
		<Fragment>
			{hasAcronym ? <p className="font-heading text-title-4 font-regular mbe-2">{project.acronym}</p> : null}
			<dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-8 gap-y-3">
				{facts.map((fact) => {
					if (fact.value == null) {
						return null;
					}

					return (
						<div key={fact.label} className="col-span-full grid grid-cols-subgrid">
							<dt className="font-bold text-text-strong">{fact.label}</dt>
							<dd>{fact.value}</dd>
						</div>
					);
				})}
			</dl>
		</Fragment>
	);
}

function isPresent(value: string | null): value is string {
	return value != null && value.trim() !== "";
}

interface LinkOrTextProps {
	value: string;
}

/** A value which is a url, as a link labelled with the url's last path segment; anything else, as text. */
function LinkOrText(props: Readonly<LinkOrTextProps>): ReactNode {
	const { value } = props;

	if (!URL.canParse(value)) {
		return value;
	}

	const url = new URL(value);
	const label = url.pathname.split("/").findLast((segment) => segment !== "") ?? url.hostname;

	return (
		<a className={linkClassName} href={value}>
			{label}
		</a>
	);
}

interface PartnersProps {
	project: DariahProject;
}

/**
 * The institutions taking part in the project, each linking to its website - or as plain text, without one. They are
 * sorted by name (see `sortByName`): the api has them in no order a reader would recognise - the grant agreement's, it
 * seems - and a reader mostly looks for an institution of their own. The coordinators are not among them: they are
 * listed with the project's facts (see `ProjectFacts`). The heading is set as a working group's chairs are (see
 * `PersonGroup`).
 */
function Partners(props: Readonly<PartnersProps>): ReactNode {
	const { project } = props;

	const t = useTranslations();

	const headingId = useId();

	const locale = useLocale();

	const partners = sortByName(project.participants, locale);

	if (partners.length === 0) {
		return null;
	}

	return (
		<section aria-labelledby={headingId} className="mbs-16">
			<h2
				className="text-small font-bold text-text-strong after:mbs-4 after:block after:block-0.5 after:inline-17.5 after:bg-stroke-weak"
				id={headingId}
			>
				{t("Participants")}
			</h2>
			<ul className="mbs-6 flex flex-col gap-y-3" role="list">
				{partners.map((partner) => (
					<li key={partner.id}>
						<PartnerLink partner={partner} />
					</li>
				))}
			</ul>
		</section>
	);
}

interface PartnerLinkProps {
	partner: DariahProjectInstitution;
}

function PartnerLink(props: Readonly<PartnerLinkProps>): ReactNode {
	const { partner } = props;

	const website = partner.socialMedia.find((link) => link.type === "website");

	if (website == null) {
		return partner.name;
	}

	return (
		<a className={linkClassName} href={website.url}>
			{partner.name}
		</a>
	);
}
