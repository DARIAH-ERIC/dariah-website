import type { Metadata } from "next";
import { useExtracted as useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { type ReactNode, Suspense } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { Article } from "#/components/article.tsx";
import { PageHeaderSkeleton } from "#/components/page-header.tsx";
import { getImpactCaseStudyBySlug, getImpactCaseStudySlugs } from "#/lib/data/impact-case-studies.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";

interface ImpactCaseStudyPageProps extends PageProps<"/about/impact-case-studies/[slug]"> {}

/**
 * A link's prefetch of this page - see `Link`'s `prefetch="intent"` - is served from static output, never rendered per
 * request. Every slug known at build time is prerendered; for one that is not, the prefetch holds the skeleton.
 */
export const ensureStatic = "prefetch";

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
	const slugs = await getImpactCaseStudySlugs();

	return slugs.map((slug) => {
		return { slug };
	});
}

/**
 * An unknown slug is answered with `notFound()` here as well as in the page: html-limited bots (see `htmlLimitedBots`)
 * get metadata before the response starts, so for them that is a real `404` status, where the page's own call, inside a
 * Suspense boundary, comes too late for anything but a `noindex`.
 */
export async function generateMetadata(props: Readonly<ImpactCaseStudyPageProps>): Promise<Metadata> {
	const { slug } = await props.params;

	const item = await getImpactCaseStudyBySlug(slug);

	if (item == null) {
		notFound();
	}

	return createMetadata({
		href: href({ pathname: "/about/impact-case-studies/[slug]", params: { slug } }),
		title: item.title,
		description: item.summary,
		image: item.image,
		publishedTime: item.publishedAt,
	});
}

/**
 * The article depends on the slug, so it streams in behind its skeleton. The skeleton is the route's app shell, which a
 * link to any article prefetches, so following one shows it at once; a slug known at build time is prerendered whole.
 */
export default function ImpactCaseStudyPage(props: Readonly<ImpactCaseStudyPageProps>): ReactNode {
	const t = useTranslations();

	return (
		<Main>
			<Suspense
				fallback={
					<PageHeaderSkeleton
						label={t("Loading article…")}
						className="px-main"
						image="banner"
						parent={href({ pathname: "/about/impact-case-studies" })}
						titleLines={{ base: 4, sm: 3, lg: 2 }}
					/>
				}
			>
				<ImpactCaseStudy params={props.params} />
			</Suspense>
		</Main>
	);
}

async function ImpactCaseStudy(props: Pick<ImpactCaseStudyPageProps, "params">): Promise<ReactNode> {
	const { slug } = await props.params;

	const item = await getImpactCaseStudyBySlug(slug);

	if (item == null) {
		notFound();
	}

	return (
		<Article
			current={href({ pathname: "/about/impact-case-studies/[slug]", params: { slug } })}
			item={item}
			parent={href({ pathname: "/about/impact-case-studies" })}
		/>
	);
}
