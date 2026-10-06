import cn from "clsx/lite";
import { ExternalLinkIcon } from "lucide-react";
import type { Metadata } from "next";
import { useLocale, useExtracted as useTranslations } from "next-intl";
import { getExtracted as getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode, Suspense, useId } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { ContentLayout } from "#/components/content-layout.tsx";
import { EntityIntro, EntityIntroSkeleton } from "#/components/entity-intro.tsx";
import { Image } from "#/components/image.tsx";
import { PageHeader, PageHeaderSkeleton } from "#/components/page-header.tsx";
import { PersonGroup } from "#/components/person-card.tsx";
import { socialMediaLogos } from "#/components/social-media-logos.ts";
import type { Contributor, MemberOrObserver, MemberOrPartner, PartnerInstitution } from "#/lib/api/schemas.ts";
import { getMemberOrPartnerBySlug, getMemberOrPartnerSlugs } from "#/lib/data/members-and-partners.ts";
import { sortByName } from "#/lib/i18n/sort-by-name.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href, unsafeHref } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";
import { toContentBlocksPlainText } from "#/lib/rich-text.ts";

interface MemberOrPartnerPageProps extends PageProps<"/network/members-and-partners/[slug]"> {}

/**
 * A link's prefetch of this page - see `Link`'s `prefetch="intent"` - is served from static output, never rendered per
 * request. Every slug known at build time is prerendered; for one that is not, the prefetch holds the skeleton.
 */
export const ensureStatic = "prefetch";

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
	const slugs = await getMemberOrPartnerSlugs();

	return slugs.map((slug) => {
		return { slug };
	});
}

/**
 * An unknown slug is answered with `notFound()` here as well as in the page: html-limited bots (see `htmlLimitedBots`)
 * get metadata before the response starts, so for them that is a real `404` status, where the page's own call, inside a
 * Suspense boundary, comes too late for anything but a `noindex`.
 */
export async function generateMetadata(props: Readonly<MemberOrPartnerPageProps>): Promise<Metadata> {
	const { slug } = await props.params;

	const [item, t] = await Promise.all([getMemberOrPartnerBySlug(slug), getTranslations()]);

	if (item == null) {
		notFound();
	}

	/** Many countries have neither a summary nor a description, so their status stands in. */
	function getStatusDescription(country: string, status: MemberOrPartner["status"]): string {
		switch (status) {
			case "is_member_of": {
				return t(
					"{country} is a member of DARIAH-EU, the Digital Research Infrastructure for the Arts and Humanities.",
					{ country },
				);
			}
			case "is_observer_of": {
				return t(
					"{country} is an observer of DARIAH-EU, the Digital Research Infrastructure for the Arts and Humanities.",
					{ country },
				);
			}
			case "is_cooperating_partner_of": {
				return t(
					"Institutions in {country} cooperating with DARIAH-EU, the Digital Research Infrastructure for the Arts and Humanities.",
					{ country },
				);
			}
		}
	}

	return createMetadata({
		href: href({ pathname: "/network/members-and-partners/[slug]", params: { slug } }),
		title: item.name,
		description:
			item.summary ?? (toContentBlocksPlainText(item.description) || getStatusDescription(item.name, item.status)),
		image: item.image,
	});
}

/**
 * The page depends on the slug, so it streams in behind the header's skeleton. The skeleton is the route's app shell,
 * which a link to any such page prefetches, so following one shows it at once; a slug known at build time is
 * prerendered whole.
 */
export default function MemberOrPartnerPage(props: Readonly<MemberOrPartnerPageProps>): ReactNode {
	return (
		<Main>
			<Suspense
				fallback={
					<PageHeaderSkeleton
						className="px-main"
						hasLabel={true}
						parent={href({ pathname: "/network/members-and-partners" })}
					>
						<EntityIntroSkeleton />
					</PageHeaderSkeleton>
				}
			>
				<MemberOrPartnerContent params={props.params} />
			</Suspense>
		</Main>
	);
}

async function MemberOrPartnerContent(props: Pick<MemberOrPartnerPageProps, "params">): Promise<ReactNode> {
	const { slug } = await props.params;

	const item = await getMemberOrPartnerBySlug(slug);

	const t = await getTranslations();

	if (item == null) {
		notFound();
	}

	/**
	 * A member's or observer's status. Cooperating partner is not a country's status but that of institutions in it (see
	 * `MembersAndPartnersMap`), so such a country has no label; its institutions are named as its cooperating partners
	 * instead (see `CooperatingPartners`).
	 */
	function getStatusLabel(status: MemberOrPartner["status"]): string | undefined {
		switch (status) {
			case "is_member_of": {
				return t("Member");
			}
			case "is_observer_of": {
				return t("Observer");
			}
			case "is_cooperating_partner_of": {
				return undefined;
			}
		}
	}

	const hasConsortiumDetails =
		"nationalConsortium" in item &&
		(item.nationalConsortium != null ||
			item.nationalCoordinatingInstitution != null ||
			item.nationalRepresentativeInstitution != null);

	const hasCooperatingPartners = item.status === "is_cooperating_partner_of" && item.institutions.length > 0;

	return (
		<div className="px-main">
			<PageHeader
				image={null}
				current={href({ pathname: "/network/members-and-partners/[slug]", params: { slug } })}
				label={getStatusLabel(item.status)}
				parent={href({ pathname: "/network/members-and-partners" })}
				title={item.name}
			/>
			<ContentLayout
				related="related-content"
				tableOfContents={false}
				blocks={item.description}
				intro={
					item.image != null || hasConsortiumDetails || hasCooperatingPartners ? (
						<EntityIntro logo={item.image}>
							{hasConsortiumDetails ? <ConsortiumDetails item={item} /> : null}
							{hasCooperatingPartners ? <CooperatingPartners institutions={item.institutions} /> : null}
						</EntityIntro>
					) : null
				}
				relatedEntities={item.relatedEntities}
				relatedResources={item.relatedResources}
				sections={
					<Fragment>
						{"contributors" in item ? <Contributors contributors={item.contributors} /> : null}
						{item.status !== "is_cooperating_partner_of" ? (
							<Institutions institutions={item.institutions} title={t("Partner institutions")} />
						) : null}
					</Fragment>
				}
			>
				<WebLinks
					exclude={"nationalConsortium" in item ? item.nationalConsortium?.website : null}
					links={item.socialMedia}
				/>
			</ContentLayout>
		</div>
	);
}

interface ConsortiumDetailsProps {
	item: MemberOrObserver;
}

/**
 * A member's national consortium, beside its logo at the top of the content: the consortium's name, linking to its
 * website, and the institutions which coordinate and represent it - only for a member with any of them, so the logo is
 * otherwise left on its own. A cooperating partner has none.
 */
function ConsortiumDetails(props: Readonly<ConsortiumDetailsProps>): ReactNode {
	const { item } = props;

	const t = useTranslations();

	const consortium = item.nationalConsortium;
	const coordinating = item.nationalCoordinatingInstitution;
	const representative = item.nationalRepresentativeInstitution;

	return (
		<Fragment>
			{consortium != null ? (
				<p className="font-heading text-title-4 font-regular">
					{t("National consortium")}{" "}
					{consortium.website != null ? (
						<Link
							className="font-bold whitespace-nowrap text-text-accent underline-offset-4 hover:underline focus-visible-outline"
							href={unsafeHref(consortium.website, true)}
						>
							{consortium.name}
							<span className="sr-only"> {t("(external website)")}</span>
							<ExternalLinkIcon aria-hidden={true} className="ms-2 inline size-5 align-[-0.125em]" />
						</Link>
					) : (
						<span className="font-bold">{consortium.name}</span>
					)}
				</p>
			) : null}
			{coordinating != null ? (
				<p className="text-text-weak">
					{t.rich("Coordinated by <institution>{name}</institution>", {
						name: coordinating.name,
						// oxlint-disable-next-line react/no-unstable-nested-components
						institution(chunks) {
							return <InstitutionLink institution={coordinating}>{chunks}</InstitutionLink>;
						},
					})}
				</p>
			) : null}
			{representative != null ? (
				<p className="text-text-weak">
					{t.rich("Represented by <institution>{name}</institution>", {
						name: representative.name,
						// oxlint-disable-next-line react/no-unstable-nested-components
						institution(chunks) {
							return <InstitutionLink institution={representative}>{chunks}</InstitutionLink>;
						},
					})}
				</p>
			) : null}
		</Fragment>
	);
}

interface CooperatingPartnersProps {
	institutions: Array<PartnerInstitution>;
}

/**
 * A cooperating partner's institutions, at the top of the content where a member's national consortium is (see
 * `ConsortiumDetails`): they are usually all there is to show, so they introduce the page rather than follow it under a
 * heading of their own, which would outweigh the title. Each is listed below the label, sorted by name, with its links
 * below it (see `InstitutionLinks`) - as a list even when there is only one, so a country's page reads the same whether
 * it has one cooperating partner or several.
 *
 * The names are in the label's weight: bold, a list of them would read as headings.
 */
function CooperatingPartners(props: Readonly<CooperatingPartnersProps>): ReactNode {
	const { institutions } = props;

	const t = useTranslations();
	const locale = useLocale();

	const labelId = useId();

	const sorted = sortByName(institutions, locale);

	return (
		<Fragment>
			<p className="font-heading text-title-4 font-regular text-text-weak" id={labelId}>
				{t("{count, plural, one {Cooperating partner} other {Cooperating partners}}", { count: sorted.length })}
			</p>
			<ul aria-labelledby={labelId} className="mbs-2 flex flex-col gap-y-4" role="list">
				{sorted.map((institution) => (
					<li key={institution.slug}>
						<p className="font-heading text-title-4 font-regular">{institution.name}</p>
						<InstitutionLinks className="mbs-1" institution={institution} />
					</li>
				))}
			</ul>
		</Fragment>
	);
}

/** Set as a link in the content is (see `prose`). */
const linkClassName = "font-medium text-text-accent underline hover:no-underline focus-visible-outline";

interface InstitutionLinkProps {
	institution: PartnerInstitution;
	children: ReactNode;
}

/**
 * An institution's name, linking to its website - or as plain text, without one - as in the list of partner
 * institutions. The coordinating and representative institutions are not in that list, so this is their only link.
 */
function InstitutionLink(props: Readonly<InstitutionLinkProps>): ReactNode {
	const { institution, children } = props;

	if (institution.website == null) {
		return children;
	}

	return (
		<a className={linkClassName} href={institution.website}>
			{children}
		</a>
	);
}

/** A website's link, at the top of the content and below it alike. */
const websiteLinkClassName =
	"inline-flex items-center gap-x-2 font-heading font-bold text-text-accent underline-offset-4 hover:underline focus-visible-outline";

/** A url without its scheme, `www.` and trailing slash, so two spellings of the same website compare equal. */
function normalizeUrl(url: string): string {
	return url.replace(/^https?:\/\/(?:www\.)?/, "").replace(/\/+$/, "");
}

interface WebLinksProps {
	links: MemberOrPartner["socialMedia"];
	/** A website the header links to already, e.g. the national consortium's, which is left out here. */
	exclude?: string | null;
}

/**
 * The member's websites and social media, below its description. A member may have several websites - a consortium's
 * own, a project's, a conference's - so each is named, as the api names it, rather than a single "Visit the website".
 * An `other` link is named too, having no mark of its own. The social media are marks, as in the footer, whose `alt` is
 * the link's name. Both are labelled, since a website's name alone - often an institution's - would read as the
 * consortium's. The consortium's website is left out, since the header links to it. Nothing renders without any links.
 */
function WebLinks(props: Readonly<WebLinksProps>): ReactNode {
	const { links: allLinks, exclude } = props;

	const t = useTranslations();

	const websitesLabelId = useId();
	const socialMediaLabelId = useId();

	const links =
		exclude != null ? allLinks.filter((link) => normalizeUrl(link.url) !== normalizeUrl(exclude)) : allLinks;
	const websites = links.filter((link) => link.type === "website" || link.type === "other");
	const socialMedia = links.filter((link) => link.type !== "website" && link.type !== "other");

	if (links.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-col gap-y-4">
			{websites.length > 0 ? (
				<div className="flex flex-wrap items-center gap-x-3 gap-y-2">
					<span id={websitesLabelId}>
						{t("{count, plural, one {Website:} other {Websites:}}", { count: websites.length })}
					</span>
					<ul aria-labelledby={websitesLabelId} className="flex flex-wrap gap-x-8 gap-y-3" role="list">
						{websites.map((link) => (
							<li key={link.id}>
								<Link className={websiteLinkClassName} href={unsafeHref(link.url, true)}>
									{link.name}
									<span className="sr-only"> {t("(external website)")}</span>
									<ExternalLinkIcon aria-hidden={true} className="size-5 shrink-0" />
								</Link>
							</li>
						))}
					</ul>
				</div>
			) : null}
			{socialMedia.length > 0 ? (
				<div className="flex flex-wrap items-center gap-x-3 gap-y-2">
					<span id={socialMediaLabelId}>{t("Social media:")}</span>
					<ul aria-labelledby={socialMediaLabelId} className="flex flex-wrap items-center gap-x-2" role="list">
						{socialMedia.map((link) => (
							<li key={link.id}>
								{/* The mark is the link's only content, so it carries its accessible name. */}
								<Link
									className="flex touch-area p-2.5 [--focus-outline-offset:-3px] hover:bg-background-accent focus-visible:bg-background-accent focus-visible-outline"
									href={unsafeHref(link.url, true)}
								>
									<Image alt={link.name} className="block-6 inline-6" src={socialMediaLogos[link.type]} />
								</Link>
							</li>
						))}
					</ul>
				</div>
			) : null}
		</div>
	);
}

interface ContributorsProps {
	contributors: Array<Contributor>;
}

/**
 * The order the groups are listed in: the national coordination, with its deputies and staff, then the national
 * representation, and the contacts last.
 */
const contributorRoles: Array<Contributor["role"]> = [
	"national_coordinator",
	"national_coordinator_deputy",
	"national_coordination_staff",
	"national_representative",
	"national_representative_deputy",
	"is_contact_for",
];

/**
 * Grouped by role, as a case study's contributors are (see `ImpactCaseStudyPage`), each group under a heading of its
 * own; a group nobody is in is left out, and with nobody in any, so is the section. Within a group, contributors keep
 * the api's order. As many columns as fit (see `PersonGroup`).
 */
function Contributors(props: Readonly<ContributorsProps>): ReactNode {
	const { contributors } = props;

	const t = useTranslations();

	const headingId = useId();

	function getRoleLabel(role: Contributor["role"], count: number): string {
		switch (role) {
			case "national_coordinator": {
				return t("{count, plural, one {National coordinator} other {National coordinators}}", { count });
			}
			case "national_coordinator_deputy": {
				return t("{count, plural, one {Deputy national coordinator} other {Deputy national coordinators}}", {
					count,
				});
			}
			case "national_coordination_staff": {
				return t("National coordination staff");
			}
			case "national_representative": {
				return t("{count, plural, one {National representative} other {National representatives}}", { count });
			}
			case "national_representative_deputy": {
				return t("{count, plural, one {Deputy national representative} other {Deputy national representatives}}", {
					count,
				});
			}
			case "is_contact_for": {
				return t("{count, plural, one {Contact} other {Contacts}}", { count });
			}
		}
	}

	const groups = contributorRoles
		.map((role) => {
			return { role, members: contributors.filter((contributor) => contributor.role === role) };
		})
		.filter((group) => group.members.length > 0);

	if (groups.length === 0) {
		return null;
	}

	return (
		<section aria-labelledby={headingId}>
			<h2 className="text-title-2" id={headingId}>
				{t("Contributors")}
			</h2>
			<div className="mbs-8 flex flex-col gap-y-10">
				{groups.map((group) => (
					<PersonGroup
						key={group.role}
						label={getRoleLabel(group.role, group.members.length)}
						persons={group.members}
					/>
				))}
			</div>
		</section>
	);
}

interface InstitutionsProps {
	institutions: Array<PartnerInstitution>;
	title: string;
}

/**
 * The institutions, sorted by name as a project's participants are (see `DariahProjectPage`), each with its links below
 * it (see `InstitutionLinks`), in two columns where they fit, since a name and its links are short; with no
 * institutions it is left out. The api sorts them by name already, but by the database's collation, which puts e.g. a
 * name in quotation marks last.
 *
 * A member's partner institutions are a section of their own after the content, as the contributors are (see
 * `ContentLayout`'s `sections`). A cooperating partner's institutions introduce the content instead (see
 * `CooperatingPartners`).
 */
function Institutions(props: Readonly<InstitutionsProps>): ReactNode {
	const { institutions, title } = props;

	const locale = useLocale();

	const headingId = useId();

	if (institutions.length === 0) {
		return null;
	}

	const sorted = sortByName(institutions, locale);

	return (
		<section aria-labelledby={headingId}>
			<h2 className="text-title-2" id={headingId}>
				{title}
			</h2>
			<ul className="mbs-8 grid gap-x-10 gap-y-5 sm:grid-cols-2" role="list">
				{sorted.map((institution) => (
					<li key={institution.slug}>
						{institution.name}
						<InstitutionLinks className="mbs-1" institution={institution} />
					</li>
				))}
			</ul>
		</section>
	);
}

/** Smaller than a website's link in the content (see `websiteLinkClassName`), being secondary to the name above it. */
const institutionLinkClassName =
	"inline-flex items-center gap-x-1.5 text-small font-medium text-text-accent underline-offset-4 hover:underline focus-visible-outline";

/** For a link's text which only a screen reader is to hear (see `InstitutionLinks`). */
function hidden(chunks: ReactNode): ReactNode {
	return <span className="sr-only">{chunks}</span>;
}

interface InstitutionLinksProps {
	institution: PartnerInstitution;
	className?: string;
}

/**
 * An institution's website and its record in ROR, the Research Organization Registry, below its name - rather than the
 * name linking to its website, so an institution with links reads as one without them does. Each link names the
 * institution for a screen reader, which would otherwise hear a list of links all called "Website" or "ROR". Nothing
 * renders for an institution with neither.
 */
function InstitutionLinks(props: Readonly<InstitutionLinksProps>): ReactNode {
	const { institution, className } = props;

	const t = useTranslations();

	if (institution.website == null && institution.ror == null) {
		return null;
	}

	return (
		<ul className={cn("flex flex-wrap gap-x-5 gap-y-1", className)} role="list">
			{institution.website != null ? (
				<li>
					<Link className={institutionLinkClassName} href={unsafeHref(institution.website, true)}>
						{t.rich("Website<hidden> of {name}</hidden>", { name: institution.name, hidden })}
						<span className="sr-only"> {t("(external website)")}</span>
						<ExternalLinkIcon aria-hidden={true} className="size-4 shrink-0" />
					</Link>
				</li>
			) : null}
			{institution.ror != null ? (
				<li>
					<Link className={institutionLinkClassName} href={unsafeHref(institution.ror, true)}>
						{t.rich("ROR<hidden> record of {name}</hidden>", { name: institution.name, hidden })}
						<span className="sr-only"> {t("(external website)")}</span>
						<ExternalLinkIcon aria-hidden={true} className="size-4 shrink-0" />
					</Link>
				</li>
			) : null}
		</ul>
	);
}
