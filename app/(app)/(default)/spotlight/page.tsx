import { SparklesIcon } from "lucide-react";
import type { Metadata } from "next";
import { useExtracted as useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { ApiImage } from "#/components/api-image.tsx";
import { ContentBlocks } from "#/components/content-blocks.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import type { SpotlightArticleBase } from "#/lib/api/schemas.ts";
import { getPageBySlug } from "#/lib/data/pages.ts";
import { getSpotlightArticles } from "#/lib/data/spotlight-articles.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

interface SpotlightPageProps extends PageProps<"/spotlight"> {}

/**
 * Nothing on this page depends on the request, so it is prerendered whole, and `next build` fails if a change makes any
 * of it render per request.
 */
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const page = await getPageBySlug("spotlight");

	if (page == null) {
		return {};
	}

	return createMetadata({
		href: href({ pathname: "/spotlight" }),
		title: page.title,
		description: page.summary,
		image: page.image,
	});
}

/**
 * Set like the impact case studies page (see `app/(app)/(default)/about/impact-case-studies/page.tsx`): the page's
 * content flows in two columns from `lg` up, as an introduction to the articles below, which are not grouped by year.
 */
export default async function SpotlightPage(_props: Readonly<SpotlightPageProps>): Promise<ReactNode> {
	const [page, items] = await Promise.all([getPageBySlug("spotlight"), getSpotlightArticles()]);

	if (page == null) {
		notFound();
	}

	return (
		<Main className="px-main pbe-24">
			<PageHeader current={href({ pathname: "/spotlight" })} image={page.image} title={page.title} />
			<ContentBlocks
				blocks={page.content}
				className="gap-x-gutter lg:columns-2 [&_.prose]:text-lead [&_.prose]:font-regular [&_.prose]:leading-body [&_.prose_p]:break-inside-avoid"
			/>
			{/** The same grid as the impact case studies: as many 22rem columns as fit, up to three. */}
			<ul
				className="mbs-16 grid grid-cols-[repeat(auto-fill,minmax(max(min(22rem,100%),(100%_-_2.5rem)/3),1fr))] gap-x-5 gap-y-8"
				role="list"
			>
				{items.map((item) => (
					<li key={item.id} className="flex shadow-card">
						<SpotlightArticleCard item={item} />
					</li>
				))}
			</ul>
		</Main>
	);
}

/** A card image's width, close enough - see the impact case studies page. */
const cardImageSizes = "(min-width: 120rem) 34rem, (min-width: 76rem) 30vw, (min-width: 50rem) 45vw, 90vw";

interface SpotlightArticleCardProps {
	item: SpotlightArticleBase;
}

/**
 * The title's link stretches over the whole card, so its focus outline is drawn on the card's box. The card draws its
 * edge shadow, its list item the soft one (see `--shadow-card` in `styles/index.css`).
 */
function SpotlightArticleCard(props: Readonly<SpotlightArticleCardProps>): ReactNode {
	const { item } = props;

	const t = useTranslations();

	return (
		<article className="group relative flex inline-full flex-col bg-background-base shadow-card-edge hover:bg-background-card-hover">
			<div className="relative aspect-5/3 border border-stroke-weak bg-background-base">
				<ApiImage alt="" className="object-cover" fill={true} image={item.image} sizes={cardImageSizes} />
			</div>
			<div className="flex flex-col gap-y-3 px-4 pbs-5 pbe-8">
				<p className="flex items-center gap-x-3">
					<SparklesIcon aria-hidden={true} className="size-4 shrink-0 text-icon-accent" />
					<span className="text-small font-bold text-text-accent uppercase">{t("Spotlight article")}</span>
				</p>
				<h2 className="font-heading text-title-4 group-hover:text-text-accent">
					<Link
						className="underline-offset-4 outline-none group-hover:underline after:absolute after:inset-0 focus-visible:after:outline-3 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus-outline focus-visible:after:outline-solid"
						href={href({ pathname: "/spotlight/[slug]", params: { slug: item.entity.slug } })}
						prefetch="intent"
					>
						{item.title}
					</Link>
				</h2>
			</div>
		</article>
	);
}
