import type { Metadata } from "next";
import { getExtracted as getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { type ReactNode, Suspense } from "react";

import { NewsList, NewsListFrame, NewsListSkeleton } from "#/app/(app)/(default)/news/_components/news-list.tsx";
import { getNewsPage } from "#/lib/data/news.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";
import { pageSegmentParams, parsePageSegment } from "#/lib/navigation/page-segment.ts";

interface NewsListPageProps extends PageProps<"/news/page/[page]"> {}

/**
 * Every page the list has at build time is prerendered. A page added later - the list grows by one every `newsPageSize`
 * announcements - is served as app shell on first visit and then upgraded, as a detail page published after the build
 * is (see `app/(app)/(default)/news/[slug]/page.tsx`).
 */
/**
 * A link's prefetch of this page - the pagination's, with `prefetch={true}` - is served from static output, never
 * rendered per request. Not `"navigation"`: a page number not known at build time is answered with the route's skeleton
 * while it is generated, rather than holding up the navigation.
 */
export const ensureStatic = "prefetch";

export async function generateStaticParams(): Promise<Array<{ page: string }>> {
	const news = await getNewsPage(1);

	return pageSegmentParams(news?.pages ?? 1);
}

/**
 * Each page of the list is its own canonical url, so later pages are not folded into the first. A malformed or
 * out-of-range page is answered with `notFound()` here as well as in the page: html-limited bots (see `htmlLimitedBots` -
 * Bingbot and link previews, not Googlebot, which renders the page) get metadata before the response starts, so for
 * them that is a real `404` status, where the page's own call, inside a Suspense boundary, comes too late for anything
 * but a `noindex`.
 */
export async function generateMetadata(props: Readonly<NewsListPageProps>): Promise<Metadata> {
	const { page } = await props.params;

	const t = await getTranslations();
	const number = parsePageSegment(page);

	if (number == null || (await getNewsPage(number)) == null) {
		notFound();
	}

	return createMetadata({
		href: href({ pathname: "/news/page/[page]", params: { page } }),
		title: t("News"),
		description: t("News, announcements and stories from DARIAH-EU and its community across Europe."),
	});
}

/** A later page of the news list - see the layout. The list depends on the page, so it streams in behind its skeleton. */
export default function NewsListPage(props: Readonly<NewsListPageProps>): ReactNode {
	return (
		<NewsListFrame>
			<Suspense fallback={<NewsListSkeleton />}>
				<NewsListForParams params={props.params} />
			</Suspense>
		</NewsListFrame>
	);
}

async function NewsListForParams(props: Pick<NewsListPageProps, "params">): Promise<ReactNode> {
	const page = parsePageSegment((await props.params).page);

	if (page == null) {
		notFound();
	}

	return <NewsList page={page} />;
}
