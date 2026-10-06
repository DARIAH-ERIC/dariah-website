import { clsx as cn } from "clsx";
import { ChevronRightIcon, NewspaperIcon } from "lucide-react";
import type { Metadata } from "next";
import { useFormatter, useExtracted as useTranslations } from "next-intl";
import { type ComponentProps, Fragment, type ReactNode, Suspense, useId } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import backgroundGetInvolvedSection from "#/assets/images/background-get-involved.jpg";
import backgroundHeroSection from "#/assets/images/background-hero.jpg";
import backgroundResourcesSection from "#/assets/images/background-resources.jpg";
import logoDariahCampus from "#/assets/images/logo-dariah-campus.svg";
import logoTransformations from "#/assets/images/logo-dariah-transformations.svg";
import logoSshOpenMarketplace from "#/assets/images/logo-sshoc.svg";
import pillarCommunitiesIcon from "#/assets/images/pillar-communities-icon.svg";
import pillarKnowledgeIcon from "#/assets/images/pillar-knowledge-icon.svg";
import pillarPolicyIcon from "#/assets/images/pillar-policy-icon.svg";
import pillarTechnologyIcon from "#/assets/images/pillar-technology-icon.svg";
import statisticCooperatingPartnersIcon from "#/assets/images/statistic-cooperating-partners-icon.svg";
import statisticMemberCountriesIcon from "#/assets/images/statistic-member-countries-icon.svg";
import statisticNationalPartnersIcon from "#/assets/images/statistic-national-partners-icon.svg";
import statisticWorkingGroupsIcon from "#/assets/images/statistic-working-groups-icon.svg";
import { ApiImage } from "#/components/api-image.tsx";
import { EventCard } from "#/components/event-card.tsx";
import { Image } from "#/components/image.tsx";
import { SectionErrorBoundary } from "#/components/section-error-boundary.tsx";
import { Skeleton, SkeletonShape, SkeletonText } from "#/components/ui/skeleton.tsx";
import type { Announcement } from "#/lib/api/schemas.ts";
import { type LatestAnnouncement, announcementHref, getLatestAnnouncements } from "#/lib/data/announcements.ts";
import { getUpcomingEvents } from "#/lib/data/events.ts";
import { getSiteMetadata } from "#/lib/data/site-metadata.ts";
import { getStatistics } from "#/lib/data/statistics.ts";
import { createAlternates, createOpenGraph } from "#/lib/metadata.ts";
import { type Href, href } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

interface IndexPageProps extends PageProps<"/"> {}

/** Title and description are the root layout's defaults; the api may give the link preview its own. */
/**
 * Nothing on this page depends on the request, so it is prerendered whole, and `next build` fails if a change makes any
 * of it render per request.
 */
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const site = await getSiteMetadata();

	return {
		alternates: await createAlternates({ canonical: "/" }),
		openGraph: await createOpenGraph({
			url: "/",
			...(site.ogTitle != null ? { title: site.ogTitle } : {}),
			...(site.ogDescription != null ? { description: site.ogDescription } : {}),
		}),
	};
}

export default function IndexPage(_props: Readonly<IndexPageProps>): ReactNode {
	const t = useTranslations();

	const pillars: Array<PillarCardProps> = [
		{
			id: "technology",
			background: "bg-gradient-pillar-technology",
			icon: pillarTechnologyIcon,
			title: t("Technology"),
			description: t(
				"We make digital methods and tools an integral part of humanities research, promoting open, sustainable and responsible technologies.",
			),
			href: href({ pathname: "/about/strategy", hash: "technology" }),
			label: t("Read more"),
		},
		{
			id: "knowledge",
			background: "bg-gradient-pillar-knowledge",
			icon: pillarKnowledgeIcon,
			title: t("Knowledge"),
			description: t(
				"We foster a culture of shared learning, ensuring that knowledge remains a driving force for innovation and collaboration.",
			),
			href: href({ pathname: "/about/strategy", hash: "knowledge" }),
			label: t("Read more"),
		},
		{
			id: "communities",
			background: "bg-gradient-pillar-communities",
			icon: pillarCommunitiesIcon,
			title: t("Communities"),
			description: t(
				"We connect researchers, institution, and networks across disciplines and countries, fostering inclusive collaboration and supportive communities.",
			),
			href: href({ pathname: "/about/strategy", hash: "communities" }),
			label: t("Read more"),
		},
		{
			id: "policy",
			background: "bg-gradient-pillar-policy",
			icon: pillarPolicyIcon,
			title: t("Policy"),
			description: t("We advocate for and shape inclusive and sustainable research infrastructure."),
			href: href({ pathname: "/about/strategy", hash: "policy" }),
			label: t("Read more"),
		},
	];

	const catalogue: CardProps = {
		id: "resource-catalogue",
		title: t("Resource catalogue"),
		description: t(
			"Our members and partners contribute to the DARIAH infrastructure with a diverse range of resources. Explore the DARIAH Resource Catalogue to discover the richness that DARIAH has to offer.",
		),
		href: href({ pathname: "/resources/resource-catalogue" }),
		label: t("Browse catalogue"),
	};

	const resources: Array<ResourceCardProps> = [
		{
			id: "dariah-campus",
			logo: logoDariahCampus,
			title: t("DARIAH-Campus"),
			description: t(
				"DARIAH-Campus is a discovery framework and a hosting platform for DARIAH and DARIAH-affiliated offerings in training and education.",
			),
			href: href({ pathname: "/resources/dariah-campus" }),
			label: t("Explore DARIAH-Campus"),
		},
		{
			id: "transformations",
			logo: logoTransformations,
			title: t("Transformations. A DARIAH Journal"),
			description: t(
				"Transformations. A DARIAH Journal is a multilingual journal focusing on use of digital tools, methods, and resources in Digital Humanities.",
			),
			href: href({ pathname: "/resources/transformations" }),
			label: t("Explore Transformations"),
		},
		{
			id: "ssh-open-marketplace",
			logo: logoSshOpenMarketplace,
			title: t("SSH Open Marketplace"),
			description: t(
				"SSH Open Marketplace is a discovery portal which pools and contextualises resources for Social Sciences and Humanities research.",
			),
			href: href({ pathname: "/resources/ssh-open-marketplace" }),
			label: t("Explore SSH Open Marketplace"),
		},
	];

	return (
		<Main>
			{/**
			 * The hero's height follows the viewport's (`min-block-hero`), so the start of the next section's heading shows above
			 * the fold - but no more than 70% of the viewport's width, so it doesn't dwarf the page on portrait screens. It grows
			 * past that only when its content needs more room. The content sits in the space above that heading, which overlaps the
			 * hero's bottom by `hero-overlap`: the pseudo-elements share the room left over 3:1, so, as in the design, the content
			 * sits low rather than centered. With no room left, they collapse, and the padding alone spaces it. Below `md`, the
			 * heading's box spans the full width and hides the hero's bottom, so the hero is taller by that overlap: as much of the
			 * image shows as beside the box from `md` up. The background sketches the photo - its dark edges and the glows of light
			 * in it (`gradient-hero`) - so what shows before the image paints, or if it fails, is close to it rather than a flat
			 * block.
			 */}
			<section className="relative isolate flex bg-gradient-hero min-block-[calc(var(--spacing-hero)+var(--spacing-hero-overlap))] flex-col px-container before:grow-3 after:grow pbs-36 pbe-42 md:min-block-hero md:pbs-16 md:pbe-[calc(var(--spacing-hero-overlap)+--spacing(16))]">
				{/**
				 * The hero fills the top of the page, so it is this page's largest contentful paint. `fetchPriority` rather than next's
				 * `preload`: the two are alternatives - next ignores `preload` when either `loading` or `fetchPriority` is set. The
				 * image is preloaded all the same: react's server renderer hoists a `<link rel="preload">` into the head for any eager
				 * `<img>` outside a `<picture>`, and flushes it first when `fetchPriority` is `high`. So it outranks the other images
				 * the browser discovers, and its request starts before the stylesheets'.
				 *
				 * No blur placeholder: the gradient behind it stands in for one. The placeholder is an svg blur filter drawn at the
				 * hero's full size, and the heading's backdrop blur blurs it again - rasterized in software, as on lighthouse's
				 * machines, the two held up the first paint on desktop by about 300ms, although the image itself had long arrived.
				 */}
				<Image
					alt=""
					className="object-cover"
					fetchPriority="high"
					fill={true}
					loading="eager"
					/**
					 * `object-cover` in a box proportionally taller than the photo (2.26:1), so the photo is drawn at the box's
					 * height times 2.26, wider than the box. The height is the section's `min-block`: the viewport's height less
					 * 10rem, at most 70vw, between 30rem and 57.75rem. Below `md` it is the 30rem minimum in practice, plus the
					 * heading's overlap, about 7.5rem - so about 85rem wide.
					 */
					sizes="(min-width: 48rem) max(min(100vw, 120rem), min(226vh - 22.6rem, 158vw, 130rem), 68rem), 85rem"
					src={backgroundHeroSection}
				/>
				<div className="relative">
					{/**
					 * The box blurs the photo behind it and multiplies a translucent tint over that, as in the design. Each is its own
					 * layer: on one element, `mix-blend-mode` would multiply the blurred copy with the sharp photo, and on the heading it
					 * would darken the white text too. The section is `isolate`, so the tint blends only with the hero's photo and
					 * gradient, and the text is lifted above the tint. On phones the box starts at the screen's edge, as in the mobile
					 * design, its text in line with the page's. Each phrase starts a line of its own and is balanced within it, so a narrow
					 * screen breaks the heading between its phrases, at any size and whatever the font's metrics.
					 */}
					<h1 className="relative max-inline-hero-heading px-6 py-7 font-heading text-display text-balance text-text-inverse shadow-hero-heading before:absolute before:inset-0 before:backdrop-blur-hero-heading after:absolute after:inset-0 after:bg-background-inverse/60 after:mix-blend-multiply max-md:-ms-container md:px-10 md:py-8 xl:px-14">
						<span className="relative z-1">
							{t.rich("<line>Digital Research Infrastructure</line> <line>for Arts and Humanities</line>", {
								// oxlint-disable-next-line react/no-unstable-nested-components
								line(chunks) {
									return <span className="block">{chunks}</span>;
								},
							})}
						</span>
					</h1>
					{/**
					 * The links are at least 60px tall, like the newsletter's subscribe button, with their cap-trimmed labels centered. The
					 * padding only matters once a label wraps, keeping it off the edges. On phones they are stacked, full width, as in the
					 * mobile design.
					 */}
					<div className="mbs-12 flex flex-wrap gap-x-10 gap-y-4 max-sm:flex-col max-sm:gap-y-6 md:mbs-14">
						<Link
							className="min-block-15 content-center border-2 border-stroke-inverse text-center bg-background-accent-strong px-6 py-3 font-heading font-bold text-text-inverse [text-box:trim-both_cap_alphabetic] hover:bg-background-base hover:border-stroke-accent hover:text-text-accent focus-visible-outline [--color-focus-outline:var(--color-focus-outline-inverse)] [--focus-outline-offset:4px]"
							href={href({ pathname: "/get-involved/join-dariah" })}
						>
							{t("Get involved")}
						</Link>
						<Link
							className="min-block-15 content-center border-2 border-stroke-inverse text-center bg-background-inverse px-6 py-3 font-heading font-bold text-text-inverse [text-box:trim-both_cap_alphabetic] hover:bg-background-base hover:border-stroke-strong hover:text-text-strong focus-visible-outline [--color-focus-outline:var(--color-focus-outline-inverse)] [--focus-outline-offset:4px]"
							href={href({ pathname: "/about/dariah-in-a-nutshell" })}
						>
							{t("Learn more about DARIAH-EU")}
						</Link>
					</div>
				</div>
			</section>

			{/**
			 * The heading's box overlaps the bottom of the hero, and spans the first column, bleeding to the container's start
			 * edge. The box is exactly as tall as the overlap, with the heading trimmed to its cap height and centered in it. The
			 * list is a subgrid, so its cards share the section's columns, and each card shares the list's rows: images are aligned
			 * at their bottoms, and titles and links line up across cards.
			 *
			 * Columns: one below `md`; two from `md`, where the four cards make two full rows; three equal ones from `lg`, which
			 * hide the fourth card; and from `2xl` the design's wide lead column, once the narrow columns fit the common labels on
			 * one line.
			 */}
			<section className="grid gap-x-8 px-container md:grid-cols-2 lg:grid-cols-3 lg:gap-x-gutter 2xl:grid-cols-[2fr_1fr_1fr]">
				<h2 className="relative -mbs-hero-overlap -ms-container bg-background-base max-md:-me-container ps-container pe-container md:pe-8 md:max-lg:-me-8 md:max-2xl:pe-20 lg:max-2xl:-me-gutter py-[calc((var(--spacing-hero-overlap)-1cap)/2)] section-heading md:min-inline-max">
					{t("Stay updated")}
				</h2>
				<SectionErrorBoundary className="col-span-full mbs-10 md:mbs-12">
					<Suspense fallback={<NewsSectionSkeleton />}>
						<NewsSection />
					</Suspense>
				</SectionErrorBoundary>
				<Link
					className="-me-container mbs-10 flex items-center gap-2 bg-background-strong px-6 py-7 font-medium text-text-inverse decoration-2 underline-offset-6 hover:underline focus-visible-outline max-md:justify-self-end md:col-start-2 lg:col-start-3"
					href={href({ pathname: "/news" })}
				>
					{t("See all news")}
					<ChevronRightIcon aria-hidden={true} className="size-4" strokeWidth={2.5} />
				</Link>
			</section>

			{/**
			 * The cards' title links stretch over the whole card, so their focus outline is drawn on the card's box.
			 *
			 * Columns: one below `md`; two from `md`, where the four cards make two full rows; three from `xl`. The gap between
			 * columns grows from 32px at `xl` to the design's 128px at 1920px, keeping the cards wide enough for a date on one
			 * line. The space above and below the cards grows from 40px at 1024px to the design's 70px at 1920px; on phones, where
			 * the cards stack, it is the mobile design's 64px, and the link to all events only as wide as its label, at the
			 * screen's edge.
			 */}
			<section className="mbs-24 grid gap-x-8 bg-gradient-events px-container pbs-20 pbe-18 text-text-inverse md:pbs-16 md:pbe-20 md:grid-cols-2 xl:grid-cols-3 xl:gap-x-gutter-wide">
				<h2 className="col-span-full section-heading">{t("Upcoming events")}</h2>
				<SectionErrorBoundary className="col-span-full mbs-16 md:mbs-block">
					<Suspense fallback={<EventsSectionSkeleton />}>
						<EventsSection />
					</Suspense>
				</SectionErrorBoundary>
				<Link
					className="mbs-16 flex items-center gap-2 bg-background-base px-6 py-7 font-medium text-text-strong decoration-2 underline-offset-6 hover:text-text-accent hover:underline focus-visible-outline [--color-focus-outline:var(--color-focus-outline-inverse)] max-md:-me-container max-md:justify-self-end md:col-start-2 md:mbs-block xl:col-start-3"
					href={href({ pathname: "/events" })}
				>
					{t("See all events")}
					<ChevronRightIcon aria-hidden={true} className="size-4 text-icon-accent" strokeWidth={2.5} />
				</Link>
			</section>

			{/**
			 * Each card shares the list's rows, so titles, descriptions and links line up across cards in a row.
			 *
			 * Columns: one below `sm`; two from `sm`; four from `lg`, where the cards are wide enough for a readable line length;
			 * at two, the cards would be wider than the design's 384px from there, with an outsize image panel.
			 */}
			<section className="px-container pbs-16 pbe-24 md:pbs-20 xl:pbe-32">
				<h2 className="section-heading">{t("Four pillars of our work")}</h2>
				<ul className="mbs-16 grid gap-x-9 sm:mbs-10 sm:grid-cols-2 lg:grid-cols-4" role="list">
					{pillars.map((card) => (
						<li
							key={card.id}
							className="row-span-4 grid grid-rows-subgrid max-lg:mbs-12 max-sm:first:mbs-0 sm:max-lg:nth-[-n+2]:mbs-0"
						>
							<PillarCard {...card} />
						</li>
					))}
				</ul>
			</section>

			{/**
			 * The catalogue leads, beside the heading; the other resources follow as cards. Two blurred overlays tint the photo: a
			 * gradient over the whole section, and a darker one above it, from the top of the section to the bottom of the cards'
			 * logo panels, so the cards' text sits on a lighter band.
			 *
			 * Rows: the intro, the logo panels' fixed height, and the rest of the cards. The darker overlay spans the first two,
			 * bleeding past the section's padding, so its bottom follows the panels without measuring the intro.
			 *
			 * Columns: the cards stack below `lg`, where three would be too narrow, and sit side by side from `lg`. From `md`, a
			 * full-width card's text would run past 80 characters a line, so the logo panel moves beside the text, and the darker
			 * overlay ends above the cards, since the panels no longer end at a common line. The gap between columns grows like the
			 * events section's, from 32px at 1024px to the design's 128px at 1920px, and so does the space above and below the
			 * cards, from 96px to the design's 160px.
			 */}
			<section className="relative grid grid-rows-[auto_--spacing(37.5)_auto] overflow-hidden md:max-lg:grid-rows-[auto_0_auto] px-container pbs-20 pbe-block-loose text-text-inverse">
				<Image
					alt=""
					className="object-cover"
					fill={true}
					sizes="(min-width: 120rem) 120rem, 100vw"
					src={backgroundResourcesSection}
				/>
				<div
					aria-hidden={true}
					className="absolute inset-0 bg-gradient-accent opacity-80 backdrop-blur-resources-gradient"
				/>
				<div
					aria-hidden={true}
					className="row-span-2 row-start-1 col-start-1 -mbs-20 -mx-container bg-background-overlay opacity-40 backdrop-blur-resources-overlay"
				/>
				<div className="relative row-start-1 col-start-1 mbe-14 grid gap-x-gutter-wide gap-y-16 md:mbe-block-loose md:grid-cols-3 md:gap-y-8">
					<h2 className="section-heading">{t("Our resources")}</h2>
					<CatalogueIntro {...catalogue} />
				</div>
				<ul className="relative row-span-2 row-start-2 col-start-1 grid gap-x-gutter-wide lg:grid-cols-3" role="list">
					{resources.map((card) => (
						<li
							key={card.id}
							className="relative row-span-3 grid grid-rows-subgrid max-md:mbs-14 max-lg:first:mbs-0 md:max-lg:mbs-8"
						>
							<ResourceCard {...card} />
						</li>
					))}
				</ul>
			</section>

			<section className="px-container pbs-20 pbe-24">
				<h2 className="section-heading">{t("Our network")}</h2>
				{/* Without the figures, the section is its heading and the links to the network's pages. */}
				<SectionErrorBoundary isHidden={true}>
					<Suspense fallback={<StatisticsList statistics={null} />}>
						<StatisticsSection />
					</Suspense>
				</SectionErrorBoundary>
				{/**
				 * Columns: the links stack below `lg`. From `lg`, where the figures are two by two, the working groups link is only as
				 * wide as its label, so the darker link does not outweigh the other. From `2xl`, the figures sit in one row, so the
				 * working groups link sits below its figure; its label fits one line from 1536px only with the narrower inline
				 * padding.
				 */}
				<div className="mbs-10 grid gap-x-6 gap-y-4 font-medium max-sm:-me-container lg:grid-cols-[1fr_auto] 2xl:grid-cols-4">
					<Link
						className="flex items-center justify-center gap-2 bg-background-muted px-4 py-7 text-center text-text-strong decoration-2 underline-offset-6 hover:underline focus-visible-outline 2xl:col-span-3"
						href={href({ pathname: "/network/members-and-partners" })}
					>
						{t("Read more about members and partners")}
						<ChevronRightIcon aria-hidden={true} className="size-4 shrink-0 text-icon-accent" strokeWidth={2.5} />
					</Link>
					<Link
						className="flex items-center justify-center gap-2 bg-background-strong px-4 py-7 text-center text-text-inverse decoration-2 underline-offset-6 hover:underline focus-visible-outline"
						href={href({ pathname: "/network/working-groups" })}
					>
						{t("Read more about working groups")}
						<ChevronRightIcon aria-hidden={true} className="size-4 shrink-0" strokeWidth={2.5} />
					</Link>
				</div>
			</section>

			{/**
			 * The photo is the section's visual heading, so the actual heading is for assistive technology only. Where the 12:5
			 * ratio would be shorter than the minimum height, just above `lg`, the browser would carry that height back through the
			 * ratio into a minimum width wider than the viewport: `max-inline-full` keeps it to the page's width. On phones, as in
			 * the mobile design, the section is taller and the photo enlarged from its bottom edge, so it is cropped in on the
			 * people, and the box spans the width.
			 */}
			<section className="relative flex min-block-200 max-inline-full flex-col items-center justify-end overflow-clip sm:min-block-112 sm:px-container lg:aspect-12/5">
				<Image
					alt=""
					className="origin-bottom object-cover max-sm:scale-135"
					fill={true}
					/**
					 * `object-cover`: below `lg`, the section's minimum height is taller than the 3:2 photo at the viewport's
					 * width, so the photo is drawn wider: 75rem on a phone, for the 50rem height, enlarged 1.35 times, and 42rem
					 * from `sm`, for 28rem.
					 */
					sizes="(min-width: 64rem) min(100vw, 120rem), (min-width: 40rem) max(100vw, 42rem), 101rem"
					src={backgroundGetInvolvedSection}
				/>
				<div className="relative inline-full max-inline-284 bg-background-base/85 px-6 pbs-4 pbe-4 text-center">
					<h2 className="sr-only">{t("Get involved")}</h2>
					<p className="font-heading text-title-2 font-regular text-balance lg:text-banner">
						{t.rich("<em>DARIAH-EU</em> thrives because of its network. <em>Be part of it!</em>", {
							// oxlint-disable-next-line react/no-unstable-nested-components
							em(chunks) {
								return <em className="font-bold not-italic">{chunks}</em>;
							},
						})}
					</p>
					<Link
						className="mbs-2 inline-flex min-block-15 items-center justify-center border-2 border-stroke-accent bg-background-base px-16 font-heading max-sm:flex text-body font-bold text-text-accent hover:bg-background-accent-strong hover:text-text-inverse focus-visible-outline"
						href={href({ pathname: "/get-involved/join-dariah" })}
					>
						{t("Get involved")}
					</Link>
				</div>
			</section>
		</Main>
	);
}

interface CardProps {
	id: string;
	title: string;
	description: string;
	href: Href;
	label: string;
}

/** The resource catalogue's call to action, beside the resources section's heading. */
function CatalogueIntro(props: Readonly<CardProps>): ReactNode {
	const { title, description, href, label } = props;

	const headingId = useId();
	const labelId = useId();

	return (
		<article className="max-inline-180 md:col-span-2 md:pbs-4">
			<h3 className="font-heading text-title-3 text-shadow-lift" id={headingId}>
				{title}
			</h3>
			<p className="mbs-4 font-heading text-title-3 font-regular leading-relaxed text-shadow-halo">{description}</p>
			<footer className="mbs-8">
				<Link
					aria-labelledby={`${labelId} ${headingId}`}
					className="inline-flex min-block-15 items-center justify-center bg-background-base px-12 font-heading text-body font-bold text-text-accent max-sm:flex decoration-2 underline-offset-6 hover:underline focus-visible-outline [--color-focus-outline:var(--color-focus-outline-inverse)]"
					href={href}
				>
					<span id={labelId}>{label}</span>
				</Link>
			</footer>
		</article>
	);
}

interface ResourceCardProps extends CardProps {
	logo: ComponentProps<typeof Image>["src"];
}

/**
 * The resource's name is its logo, so the logo's alt text is the heading. The link's own label names the resource, so
 * it is not labelled by the heading.
 *
 * Between `md` and `lg`, the card is full width, and the logo panel spans its rows beside the text; the link fills the
 * remaining rows, so the text's background has no gap below it.
 */
function ResourceCard(props: Readonly<ResourceCardProps>): ReactNode {
	const { title, description, href, label, logo } = props;

	return (
		<article className="relative row-span-3 grid grid-rows-subgrid text-text-strong md:max-lg:grid-cols-[1fr_2fr]">
			<h3 className="flex block-37.5 items-center justify-center bg-background-base/90 px-5 sm:px-10 md:max-lg:row-span-3 md:max-lg:block-auto md:max-lg:min-block-37.5">
				<Image alt={title} className="max-block-26 min-inline-0 max-inline-95 inline-auto" src={logo} />
			</h3>
			<p className="bg-background-base px-4 pbs-8 text-body sm:px-10">{description}</p>
			<footer className="bg-background-base px-4 pbs-5 pbe-8 sm:px-10 md:max-lg:row-span-2">
				<Link
					className="inline-flex items-center gap-2 text-body font-medium underline-offset-6 outline-none after:absolute after:inset-0 decoration-2 hover:text-text-accent hover:underline focus-visible:after:outline-3 focus-visible:after:outline-offset-2 focus-visible:after:outline-focus-outline-inverse focus-visible:after:outline-solid"
					href={href}
				>
					{label}
					<ChevronRightIcon aria-hidden={true} className="size-4 text-icon-accent" strokeWidth={2.5} />
				</Link>
			</footer>
		</article>
	);
}

interface PillarCardProps extends CardProps {
	/** The panel's gradient, a `bg-*` class: spelled out in full, so tailwind finds it. */
	background: string;
	/** Drawn at its own size in the design's 384px wide panel, and scaled with it. */
	icon: typeof pillarTechnologyIcon;
}

function PillarCard(props: Readonly<PillarCardProps>): ReactNode {
	const { title, description, href, background, icon, label } = props;

	const headingId = useId();
	const labelId = useId();

	/**
	 * The rule below the title is decoration, drawn by the heading itself.
	 *
	 * The description's size follows the card's width, with a `text-pillar-*` size for each number of columns. Its
	 * measure is narrower than the card, as in the design, by an end padding rather than a maximum width: a fixed measure
	 * of about 25 characters left wide cards half empty and broke lines raggedly, where a share of the card's width lets
	 * the lines follow it. The narrowest four columns, below `xl`, have room for only a smaller one.
	 *
	 * The panel's height is computed from its container's width: firefox sizes a subgrid's rows by an image's natural
	 * height rather than its used one, so an image sized by the column would overflow its row. The container is a wrapper
	 * of its own: containment on the article would make it an independent grid, not a subgrid. In the single column, as
	 * in the mobile design, the panel is the design's fixed 304px tall and the icon drawn at its own size instead.
	 */
	return (
		<article className="relative row-span-4 grid grid-rows-subgrid">
			<div className="@container">
				<div className={cn("grid place-items-center block-76 sm:block-[calc(100cqi*305/384)]", background)}>
					<Image
						alt=""
						className="max-sm:inline-auto!"
						src={icon}
						style={{ inlineSize: `${(icon.width / 384) * 100}%` }}
					/>
				</div>
			</div>
			<h3
				className="mbs-10 font-heading text-title-2 uppercase after:mbs-7 after:block after:inline-25 after:border-be-3 after:border-stroke-pillar after:content-['']"
				id={headingId}
			>
				{title}
			</h3>
			<p className="mbs-7 pe-[15%] font-heading lg:max-xl:pe-[5%] text-pillar-1 leading-relaxed text-pretty sm:text-pillar-2 lg:text-pillar-4">
				{description}
			</p>
			<footer className="mbs-9 sm:mbs-7">
				<Link
					aria-labelledby={`${labelId} ${headingId}`}
					className="inline-flex items-center gap-2 font-medium underline-offset-6 outline-none after:absolute after:inset-0 decoration-2 hover:text-text-accent hover:underline focus-visible:after:outline-3 focus-visible:after:outline-offset-12 focus-visible:after:outline-focus-outline focus-visible:after:outline-solid"
					href={href}
				>
					<span id={labelId}>{label}</span>
					<ChevronRightIcon aria-hidden={true} className="size-4 text-icon-accent" strokeWidth={2.5} />
				</Link>
			</footer>
		</article>
	);
}

/**
 * The fourth card fills the second row of the two-column layout, and is hidden in the three-column one. It is shown in
 * the single column too, so that zooming in, which narrows the layout, never hides a card.
 */
async function NewsSection(): Promise<ReactNode> {
	const announcements = await getLatestAnnouncements();

	return (
		<ul className="col-span-full mbs-10 grid grid-cols-subgrid md:mbs-12" role="list">
			{announcements.map(({ item, isFeatured }, index) => (
				<li
					key={item.id}
					className="row-span-3 grid grid-rows-subgrid max-md:not-first:mbs-10 md:max-lg:nth-[n+3]:mbs-12 lg:nth-4:hidden"
				>
					<AnnouncementCard isFeatured={isFeatured} isLead={index === 0} item={item} />
				</li>
			))}
		</ul>
	);
}

/** The same list and grid rows as `NewsSection`, with a placeholder for each card's image, text, and link. */
function NewsSectionSkeleton(): ReactNode {
	const t = useTranslations();

	return (
		<Skeleton className="col-span-full mbs-10 grid grid-cols-subgrid md:mbs-12" label={t("Loading announcements…")}>
			{[0, 1, 2, 3].map((index) => (
				<div
					key={index}
					className="row-span-3 grid grid-rows-subgrid max-md:not-first:mbs-10 md:max-lg:nth-[n+3]:mbs-12 lg:nth-4:hidden"
				>
					<div className="@container self-end">
						<SkeletonShape
							className={cn(
								"rounded-none block-[max(10rem,100cqi*2/3)] sm:max-md:block-[max(10rem,100cqi*2/5)]",
								index === 0 && "2xl:block-[max(12.5rem,100cqi*340/736)]",
							)}
						/>
					</div>
					<div className="pbs-10">
						<SkeletonText className="font-heading text-title-4 leading-heading 2xl:text-title-3" lines={3} />
						<SkeletonText className="mbs-4 leading-body" lines={5} />
					</div>
					<div className="pbs-8">
						<SkeletonText className="inline-40" />
					</div>
				</div>
			))}
		</Skeleton>
	);
}

interface AnnouncementCardProps extends LatestAnnouncement {
	/**
	 * The first card is wider than the others from `2xl` (see the section's columns): there, it gets a flatter image and
	 * more padding around its label. So do all cards in the single column from `sm`, which would be too tall otherwise.
	 */
	isLead: boolean;
}

function AnnouncementCard(props: Readonly<AnnouncementCardProps>): ReactNode {
	const { item, isFeatured, isLead } = props;

	const t = useTranslations();
	const format = useFormatter();
	const headingId = useId();
	const labelId = useId();

	const labels: Record<Announcement["type"], string> = isFeatured
		? {
				news: t("Featured news"),
				opportunities: t("Featured opportunity"),
				funding_calls: t("Featured funding call"),
			}
		: {
				news: t("News"),
				opportunities: t("Opportunity"),
				funding_calls: t("Funding call"),
			};

	/**
	 * Contents in grid rows the list item shares with its siblings: image, text, link.
	 *
	 * Images follow the design's aspect ratios (5:2 and 7:4, 340px and 244px tall at 1920px), but don't shrink below a
	 * minimum height in narrow columns. A plain `aspect-ratio` would turn that minimum height into a minimum width, and
	 * widen the column instead, so the height is computed from the image's container width. The container is a wrapper of
	 * its own: containment on the article would make it an independent grid, not a subgrid.
	 */
	return (
		<article className="group relative row-span-3 grid grid-rows-subgrid">
			<div className="@container self-end">
				<div
					className={cn(
						"relative overflow-hidden border border-stroke-weak",
						"block-[max(10rem,100cqi*2/3)] sm:max-md:block-[max(10rem,100cqi*2/5)]",
						isLead && "2xl:block-[max(12.5rem,100cqi*340/736)]",
					)}
				>
					<ApiImage
						alt=""
						className="object-cover transition-transform duration-200 ease-out motion-safe:group-hover:scale-105 motion-safe:group-has-focus-visible:scale-105"
						fill={true}
						image={item.image}
						sizes={
							isLead
								? "(min-width: 120rem) 60rem, (min-width: 96rem) 50vw, (min-width: 64rem) 33vw, (min-width: 48rem) 50vw, 100vw"
								: "(min-width: 120rem) 30rem, (min-width: 96rem) 25vw, (min-width: 64rem) 33vw, (min-width: 48rem) 50vw, 100vw"
						}
					/>
					<div
						className={cn(
							"absolute inset-s-0 inset-be-0 flex flex-wrap content-center items-baseline gap-x-3 gap-y-1 bg-background-base px-4 py-3 min-block-15",
							isLead && "2xl:px-8",
						)}
					>
						<NewspaperIcon aria-hidden={true} className="size-4 shrink-0 self-center text-icon-accent" />
						<span className="text-small font-bold text-text-accent uppercase">{labels[item.type]}</span>
						<time className="text-caption whitespace-nowrap" dateTime={item.publishedAt}>
							{format.dateTime(new Date(item.publishedAt), { dateStyle: "long" })}
						</time>
					</div>
				</div>
			</div>
			<div className="pbs-10">
				<h3 className="font-heading text-title-4 leading-heading text-balance 2xl:text-title-3" id={headingId}>
					{item.title}
				</h3>
				<p className={cn("mbs-4 line-clamp-5 leading-body", isLead && "2xl:leading-reading")}>{item.summary}</p>
			</div>
			<footer className="pbs-8">
				<Link
					aria-labelledby={`${labelId} ${headingId}`}
					className="inline-flex items-center gap-2 font-medium underline-offset-6 outline-none after:absolute after:inset-0 decoration-2 hover:text-text-accent hover:underline focus-visible:after:outline-3 focus-visible:after:outline-offset-12 focus-visible:after:outline-focus-outline focus-visible:after:outline-solid"
					href={announcementHref(item)}
					prefetch="intent"
				>
					<span id={labelId}>{t("Continue reading")}</span>
					<ChevronRightIcon aria-hidden={true} className="size-4 text-icon-accent" strokeWidth={2.5} />
				</Link>
			</footer>
		</article>
	);
}

/**
 * The fourth event fills the second row of the two-column layout, and is hidden in the three-column one. It is shown in
 * the single column too, so that zooming in, which narrows the layout, never hides an event.
 */
async function EventsSection(): Promise<ReactNode> {
	const events = await getUpcomingEvents();

	return (
		<ul className="col-span-full mbs-16 grid grid-cols-subgrid gap-y-12 md:mbs-block md:gap-y-8" role="list">
			{events.map(({ event, isOngoing }) => (
				<li key={event.id} className="@container grid xl:nth-4:hidden">
					<EventCard event={event} isOnDark={true} status={isOngoing ? "ongoing" : "upcoming"} />
				</li>
			))}
		</ul>
	);
}

/** The same list as `EventsSection`, with a placeholder for each card. */
function EventsSectionSkeleton(): ReactNode {
	const t = useTranslations();

	return (
		<Skeleton
			className="col-span-full mbs-16 grid grid-cols-subgrid gap-y-12 md:mbs-block md:gap-y-8"
			label={t("Loading events…")}
		>
			{[0, 1, 2, 3].map((index) => (
				<div key={index} className="@container grid xl:nth-4:hidden">
					<EventCard event={null} isOnDark={true} />
				</div>
			))}
		</Skeleton>
	);
}

async function StatisticsSection(): Promise<ReactNode> {
	const statistics = await getStatistics();

	return <StatisticsList statistics={statistics} />;
}

/**
 * Each figure's image and label make up its term: the image is decorative, and `display: contents` lets both sit in the
 * figure's grid, the number between them in the source order screen readers follow, but below the image and beside the
 * label on screen. The label sets one word per line, as in the design, and its last line sits on the number's
 * baseline.
 *
 * The images and labels are known without the statistics, so while they load, the list is rendered as it will be, with
 * a placeholder for each figure.
 */
function StatisticsList(props: Readonly<{ statistics: Awaited<ReturnType<typeof getStatistics>> | null }>): ReactNode {
	const { statistics } = props;

	const t = useTranslations();

	const items = [
		{
			id: "member-countries",
			label: t("Member countries"),
			value: statistics?.memberCountries,
			icon: statisticMemberCountriesIcon,
		},
		{
			id: "partner-institutions",
			label: t("National partner institutions"),
			value: statistics?.partnerInstitutions,
			icon: statisticNationalPartnersIcon,
		},
		{
			id: "cooperating-partners",
			label: t("Cooperating partners"),
			value: statistics?.cooperatingPartners,
			icon: statisticCooperatingPartnersIcon,
		},
		{
			id: "working-groups",
			label: t("Working groups"),
			value: statistics?.workingGroups,
			icon: statisticWorkingGroupsIcon,
		},
	];

	return (
		<dl className="mbs-6 grid gap-x-10 gap-y-12 md:grid-cols-[repeat(2,minmax(0,21rem))] md:justify-center 2xl:grid-cols-4">
			{items.map((item, index) => (
				<div key={item.id} className="grid grid-cols-[1fr_auto_auto_1fr] items-baseline-last">
					<dt className="contents">
						<StatisticImage
							animation="pulse"
							className="col-span-full mbe-8 inline-full max-inline-100 justify-self-center sm:max-inline-80 2xl:mbe-20 2xl:max-inline-100"
							icon={item.icon}
							rings={index % 2 === 0 ? "odd" : "even"}
						/>
						<span className="col-start-3 row-start-2 max-inline-min ms-6 font-heading text-title-5 sm:text-title-3">
							{item.label}
						</span>
					</dt>
					<dd className="col-start-2 row-start-2 font-heading text-figure-statistic-narrow tabular-nums sm:text-figure-2 xl:text-figure-1 2xl:text-figure-statistic">
						{item.value ?? (
							<Fragment>
								<SkeletonText className="inline-[1.5em]" />
								<span className="sr-only">{t("Loading…")}</span>
							</Fragment>
						)}
					</dd>
				</div>
			))}
		</dl>
	);
}

/** The rings' radii and opacities, from the inside out, in the design's 407px square. */
const statisticRings = [
	{ radius: 125.401, className: undefined },
	{ radius: 157.866, className: "opacity-30" },
	{ radius: 191.914, className: "opacity-50" },
	{ radius: 203, className: "opacity-30" },
];

interface StatisticImageProps {
	/** `pulse` moves all rings together, as the gifs this replaces did; `breathe` only the outer two, and less. */
	animation: "breathe" | "pulse";
	className?: string;
	/** Drawn at its own size in the design's 407px square, and scaled with it. */
	icon: typeof statisticMemberCountriesIcon;
	/** The rings' colour alternates from one statistic to the next. */
	rings: "even" | "odd";
}

/**
 * A statistic's icon on a disc, over a glow, in concentric rings - drawn in the design's 407px square and scaled to the
 * element's width. The rings keep a 1px stroke at any size. They animate through `scale`, from the square's centre;
 * with reduced motion, the global rule stops them in the design's static frame.
 */
function StatisticImage(props: Readonly<StatisticImageProps>): ReactNode {
	const { animation, className, icon, rings } = props;

	const glowId = useId();

	return (
		<div className={cn("relative grid place-items-center", className)}>
			<svg aria-hidden={true} className="block inline-full" fill="none" viewBox="0 0 407 407">
				<defs>
					<linearGradient
						gradientUnits="userSpaceOnUse"
						id={glowId}
						x1={271.007}
						x2={124.432}
						y1={283.687}
						y2={131.145}
					>
						<stop offset={0.226} style={{ stopColor: "var(--color-statistic-disc)" }} />
						<stop offset={1} style={{ stopColor: "var(--color-statistic-glow)" }} />
					</linearGradient>
				</defs>
				<circle className="opacity-30" cx={203.5} cy={203.5} fill={`url(#${glowId})`} r={102.938} />
				<g
					className={cn(
						"origin-center transform-view",
						rings === "odd" ? "stroke-statistic-ring-odd" : "stroke-statistic-ring-even",
						animation === "pulse" && "animate-rings-pulse",
					)}
				>
					{statisticRings.map((ring, index) => (
						<circle
							key={ring.radius}
							className={cn(
								ring.className,
								animation === "breathe" && index >= 2 && "origin-center animate-rings-breathe transform-view",
							)}
							cx={203.5}
							cy={203.5}
							r={ring.radius}
							vectorEffect="non-scaling-stroke"
						/>
					))}
				</g>
				<circle className="fill-statistic-disc" cx={203.5} cy={203.5} r={72.057} />
			</svg>
			<Image alt="" className="absolute" src={icon} style={{ inlineSize: `${(icon.width / 407) * 100}%` }} />
		</div>
	);
}
