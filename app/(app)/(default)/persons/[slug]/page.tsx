import { ExternalLinkIcon, MailIcon } from "lucide-react";
import type { Metadata } from "next";
import { useExtracted as useTranslations } from "next-intl";
import { getExtracted as getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode, Suspense, useId } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import logo from "#/assets/images/logo-dariah-eu-white.svg";
import githubLogo from "#/assets/images/logo-github.svg";
import orcidLogo from "#/assets/images/logo-orcid.svg";
import { ApiImage } from "#/components/api-image.tsx";
import { Breadcrumbs } from "#/components/breadcrumbs.tsx";
import { ContentBlocks } from "#/components/content-blocks.tsx";
import { Image } from "#/components/image.tsx";
import {
	type Position,
	getAllRankedPositions,
	getFormerPositions,
	getPositionLabeler,
	getRankedPositions,
	usePositionLabel,
} from "#/components/person-card.tsx";
import { socialMediaLogos } from "#/components/social-media-logos.ts";
import { Skeleton, SkeletonShape, SkeletonText } from "#/components/ui/skeleton.tsx";
import type { Person, PersonArticle, PersonSocialMedia } from "#/lib/api/schemas.ts";
import { getPersonBySlug, getPersonSlugs } from "#/lib/data/persons.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href, unsafeHref } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";
import { toContentBlocksPlainText } from "#/lib/rich-text.ts";

interface PersonPageProps extends PageProps<"/persons/[slug]"> {}

/**
 * A link's prefetch of this page - see `Link`'s `prefetch="intent"` - is served from static output, never rendered per
 * request. Every slug known at build time is prerendered; for one that is not, the prefetch holds the skeleton.
 */
export const ensureStatic = "prefetch";

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
	const slugs = await getPersonSlugs();

	return slugs.map((slug) => {
		return { slug };
	});
}

/**
 * An unknown slug is answered with `notFound()` here as well as in the page: html-limited bots (see `htmlLimitedBots`)
 * get metadata before the response starts, so for them that is a real `404` status, where the page's own call, inside a
 * Suspense boundary, comes too late for anything but a `noindex`.
 *
 * Many people have no biography, so their positions stand in, as a person card lists them.
 */
export async function generateMetadata(props: Readonly<PersonPageProps>): Promise<Metadata> {
	const { slug } = await props.params;

	const [item, t, getPositionLabel] = await Promise.all([
		getPersonBySlug(slug),
		getTranslations(),
		getPositionLabeler(),
	]);

	if (item == null) {
		notFound();
	}

	const positions = Array.from(
		new Set(getRankedPositions(item.positions ?? []).map((position) => getPositionLabel(position))),
	);

	return createMetadata({
		href: href({ pathname: "/persons/[slug]", params: { slug } }),
		title: item.name,
		description:
			toContentBlocksPlainText(item.biography) ||
			(positions.length > 0 ? t("{name}: {positions}", { name: item.name, positions: positions.join(", ") }) : null),
		image: item.image,
	});
}

/**
 * There is no design for a person's page, so it is put together from the site's parts: the portrait beside the name, as
 * on a person card but larger, with the current positions and the ways to reach the person; then the biography, in the
 * reading measure, the former positions and the articles the person is credited on, each a section of its own, left out
 * when empty.
 */
/**
 * The person depends on the slug, so they stream in behind a skeleton. The skeleton is the route's app shell, which a
 * link to any person prefetches, so following one shows it at once; a slug known at build time is prerendered whole.
 */
export default function PersonPage(props: Readonly<PersonPageProps>): ReactNode {
	return (
		<Main className="px-main pbs-8 pbe-24">
			<Suspense fallback={<PersonSkeleton />}>
				<PersonContent params={props.params} />
			</Suspense>
		</Main>
	);
}

/**
 * The same layout as `PersonHeader` while the person loads: the breadcrumbs, whose trail is only the home link for a
 * page the menu does not list, and a placeholder for the portrait, the name and the positions.
 */
function PersonSkeleton(): ReactNode {
	const t = useTranslations();

	return (
		<Skeleton label={t("Loading person…")}>
			{/** No page of the menu lists a person, so the trail is the same for any `current` it does not list. */}
			<Breadcrumbs current={href({ pathname: "/" })} label={null} />
			<div className="mbs-14 grid items-start gap-x-12 gap-y-8 sm:grid-cols-[auto_minmax(0,1fr)]">
				<SkeletonShape className="size-48 rounded-none sm:size-64" />
				<div className="flex flex-col gap-y-8">
					<SkeletonText className="inline-2/3 text-title-1" />
					<SkeletonText className="inline-1/2 text-body" lines={2} />
				</div>
			</div>
		</Skeleton>
	);
}

async function PersonContent(props: Pick<PersonPageProps, "params">): Promise<ReactNode> {
	const { slug } = await props.params;

	const item = await getPersonBySlug(slug);

	if (item == null) {
		notFound();
	}

	const hasBiography = toContentBlocksPlainText(item.biography).length > 0;

	return (
		<Fragment>
			<Breadcrumbs current={href({ pathname: "/persons/[slug]", params: { slug } })} label={item.name} />
			<PersonHeader item={item} />
			<div className="flex flex-col gap-y-16 mbs-16">
				{hasBiography ? <Biography item={item} /> : null}
				<FormerPositions positions={getFormerPositions(item.positions ?? [], item.formerPositions ?? [])} />
				<Articles articles={item.articles} />
			</div>
		</Fragment>
	);
}

/**
 * The portrait is square, 12rem below `sm` and 16rem from there; a person without one gets the DARIAH-EU logo on grey,
 * as on their card. Below `sm` the text follows the portrait.
 */
function PersonHeader(props: Readonly<{ item: Person }>): ReactNode {
	const { item } = props;

	const t = useTranslations();
	const getPositionLabel = usePositionLabel();

	const positions = getAllRankedPositions(item.positions ?? []);

	return (
		<header className="mbs-14 grid items-start gap-x-12 gap-y-8 sm:grid-cols-[auto_minmax(0,1fr)]">
			<div className="relative size-48 sm:size-64">
				{item.image != null ? (
					<ApiImage
						alt=""
						className="object-cover"
						fetchPriority="high"
						fill={true}
						image={item.image}
						loading="eager"
						sizes="(min-width: 40rem) 16rem, 12rem"
					/>
				) : (
					<div className="grid size-full place-items-center bg-background-placeholder px-[7%]">
						<Image alt="" className="block-auto inline-full" loading="eager" src={logo} />
					</div>
				)}
			</div>
			<div className="flex flex-col gap-y-8">
				<h1 className="text-title-1">{item.name}</h1>
				{positions.length > 0 ? (
					<section aria-label={t("Positions")}>
						<ul className="flex flex-col gap-y-2 text-body" role="list">
							{positions.map((position) => (
								<li key={`${position.entity.id}-${position.role}`}>
									<PositionLabel label={getPositionLabel(position)} position={position} />
								</li>
							))}
						</ul>
					</section>
				) : null}
				<ContactLinks item={item} />
			</div>
		</header>
	);
}

/** Linked to the entity's page, where it has one. */
function PositionLabel(props: Readonly<{ label: string; position: Position }>): ReactNode {
	const { label, position } = props;

	if (position.entity.href == null) {
		return label;
	}

	return (
		<Link
			className="underline decoration-stroke-weak underline-offset-4 hover:decoration-current focus-visible-outline"
			href={unsafeHref(position.entity.href, false)}
		>
			{label}
		</Link>
	);
}

/** The social media services' names, where the api's `type` is not one already. */
function useSocialMediaLabels(): Record<PersonSocialMedia["type"], string> {
	const t = useTranslations();

	return {
		academia_edu: "Academia.edu",
		bluesky: "Bluesky",
		github: "GitHub",
		gitlab: "GitLab",
		google_scholar: "Google Scholar",
		humanities_commons: "Humanities Commons",
		hypotheses: "Hypotheses",
		linkedin: "LinkedIn",
		mastodon: "Mastodon",
		researchgate: "ResearchGate",
		twitter: "X",
		website: t("Website"),
		youtube: "YouTube",
		zenodo: "Zenodo",
		other: t("Website"),
	};
}

/** The services with a mark of their own; the others get the generic external link icon. */
const personSocialMediaLogos: Partial<Record<PersonSocialMedia["type"], typeof githubLogo>> = {
	bluesky: socialMediaLogos.bluesky,
	github: githubLogo,
	linkedin: socialMediaLogos.linkedin,
	mastodon: socialMediaLogos.mastodon,
	other: socialMediaLogos.other,
	twitter: socialMediaLogos.twitter,
	website: socialMediaLogos.website,
	youtube: socialMediaLogos.youtube,
};

/** An orcid may be stored as the bare identifier or as its url. */
function getOrcidUrl(orcid: string): string {
	return /^https?:\/\//.test(orcid) ? orcid : `https://orcid.org/${orcid}`;
}

/** The email address, the orcid and the social media profiles, as links, each with its icon. */
function ContactLinks(props: Readonly<{ item: Person }>): ReactNode {
	const { item } = props;

	const t = useTranslations();
	const socialMediaLabels = useSocialMediaLabels();

	const links: Array<{ id: string; label: string; href: string; icon: typeof MailIcon | typeof githubLogo }> = [];

	if (item.email != null) {
		links.push({ id: "email", label: item.email, href: `mailto:${item.email}`, icon: MailIcon });
	}

	if (item.orcid != null) {
		links.push({ id: "orcid", label: "ORCID", href: getOrcidUrl(item.orcid), icon: orcidLogo });
	}

	for (const profile of item.socialMedia) {
		links.push({
			id: profile.url,
			label: profile.label ?? socialMediaLabels[profile.type],
			href: profile.url,
			icon: personSocialMediaLogos[profile.type] ?? ExternalLinkIcon,
		});
	}

	if (links.length === 0) {
		return null;
	}

	return (
		<section aria-label={t("Contact")}>
			<ul className="flex flex-wrap gap-x-8 gap-y-3" role="list">
				{links.map((link) => {
					const Icon = link.icon;

					return (
						<li key={link.id}>
							<Link
								className="inline-flex items-center gap-x-2 break-all font-medium text-text-accent underline underline-offset-4 focus-visible-outline"
								href={unsafeHref(link.href, true)}
							>
								{"src" in Icon ? (
									/* Decorative: the link's text already names the service. */
									<Image alt="" className="size-5 shrink-0" src={Icon} />
								) : (
									<Icon aria-hidden={true} className="size-5 shrink-0" />
								)}
								{link.label}
							</Link>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

function Biography(props: Readonly<{ item: Person }>): ReactNode {
	const { item } = props;

	const t = useTranslations();
	const headingId = useId();

	return (
		<section aria-labelledby={headingId} className="max-inline-measure">
			<h2 className="text-title-4" id={headingId}>
				{t("Biography")}
			</h2>
			<ContentBlocks blocks={item.biography} className="mbs-6" />
		</section>
	);
}

/**
 * The api stands in `1900-01-01` for a start it does not know, e.g. an affiliation's; such a year is left out rather
 * than shown.
 */
const unknownStartYear = "1900";

/** Most recently ended first, each with the years it was held; which are listed is up to `getFormerPositions`. */
function FormerPositions(props: Readonly<{ positions: ReadonlyArray<Position> }>): ReactNode {
	const { positions } = props;

	const t = useTranslations();
	const getPositionLabel = usePositionLabel();
	const headingId = useId();

	if (positions.length === 0) {
		return null;
	}

	const sorted = positions.toSorted((a, b) =>
		(b.duration.end ?? b.duration.start).localeCompare(a.duration.end ?? a.duration.start),
	);

	return (
		<section aria-labelledby={headingId}>
			<h2 className="text-title-4" id={headingId}>
				{t("Former positions")}
			</h2>
			<ul className="mbs-6 flex flex-col gap-y-3" role="list">
				{sorted.map((position) => {
					const start = position.duration.start.slice(0, 4);
					const end = position.duration.end?.slice(0, 4);
					const years = start === unknownStartYear ? end : end == null || end === start ? start : `${start}–${end}`;

					return (
						<li
							key={`${position.entity.id}-${position.role}-${position.duration.start}`}
							className="flex flex-wrap gap-x-4"
						>
							<PositionLabel label={getPositionLabel(position)} position={position} />
							{years != null ? <span className="text-text-weak">{years}</span> : null}
						</li>
					);
				})}
			</ul>
		</section>
	);
}

/**
 * The impact case studies and spotlight articles the person is credited on, newest first, as the news list's cards are:
 * the image beside the text from `sm`. The title's link stretches over the whole card.
 */
function Articles(props: Readonly<{ articles: ReadonlyArray<PersonArticle> }>): ReactNode {
	const { articles } = props;

	const t = useTranslations();
	const headingId = useId();

	if (articles.length === 0) {
		return null;
	}

	const kindLabels: Record<PersonArticle["type"], string> = {
		impact_case_study: t("Impact case study"),
		spotlight_article: t("Spotlight article"),
	};

	const sorted = articles.toSorted((a, b) => b.publishedAt.localeCompare(a.publishedAt));

	return (
		<section aria-labelledby={headingId}>
			<h2 className="text-title-4" id={headingId}>
				{t("Articles")}
			</h2>
			<ul className="mbs-8 grid gap-x-[calc(2*var(--spacing-gutter))] gap-y-12 2xl:grid-cols-2" role="list">
				{sorted.map((article) => (
					<li key={article.id}>
						<article className="group relative grid gap-x-6 gap-y-5 sm:grid-cols-2">
							<div className="relative aspect-7/4 self-start border border-stroke-weak">
								<ApiImage
									alt=""
									className="object-cover"
									fill={true}
									image={article.image}
									sizes="(min-width: 120rem) 24rem, (min-width: 96rem) 22vw, (min-width: 40rem) 45vw, 90vw"
								/>
							</div>
							<div className="flex flex-col gap-y-3">
								<p className="text-small font-bold text-text-accent uppercase">{kindLabels[article.type]}</p>
								<h3 className="font-heading text-title-5 leading-heading">
									{article.entity.href != null ? (
										<Link
											className="underline-offset-4 outline-none group-hover:underline after:absolute after:inset-0 focus-visible:after:outline-3 focus-visible:after:outline-offset-8 focus-visible:after:outline-focus-outline focus-visible:after:outline-solid"
											href={unsafeHref(article.entity.href, false)}
										>
											{article.title}
										</Link>
									) : (
										article.title
									)}
								</h3>
								<p className="line-clamp-3 text-caption">{article.summary}</p>
							</div>
						</article>
					</li>
				))}
			</ul>
		</section>
	);
}
