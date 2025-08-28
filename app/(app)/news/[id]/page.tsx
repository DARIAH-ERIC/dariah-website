import type { Metadata, ResolvingMetadata } from "next";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { env } from "@/config/env.config";
import { defaultLocale } from "@/lib/i18n/locales";
import { createCollectionResource } from "@/lib/keystatic/resources";

interface NewsPageProps {
	params: {
		id: string;
	};
}

export const dynamicParams = false;

export async function generateStaticParams(_props: {
	params: NewsPageProps["params"];
}): Promise<Awaited<Array<Pick<NewsPageProps["params"], "id">>>> {
	const ids = await createCollectionResource("news", defaultLocale).list();

	return ids.map((id) => {
		/** @see https://github.com/vercel/next.js/issues/63002 */
		return { id: env.NODE_ENV === "production" ? id : encodeURIComponent(id) };
	});
}

export async function generateMetadata(
	props: Readonly<NewsPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const id = decodeURIComponent(params.id);

	const newsItem = await createCollectionResource("news", defaultLocale).read(id);

	const metadata: Metadata = {
		title: newsItem.data.title,
	};

	return metadata;
}

export default async function NewsPage(props: Readonly<NewsPageProps>): Promise<ReactNode> {
	const { params } = props;

	const id = decodeURIComponent(params.id);

	const newsItem = await createCollectionResource("news", defaultLocale).read(id);
	const { default: Content } = await newsItem.compile(newsItem.data.content);

	return (
		<MainContent className="layout-grid content-start">
			<section className="layout-subgrid relative bg-fill-weaker py-16 xs:py-24">
				<h1>{newsItem.data.title}</h1>
				<Content />
			</section>
		</MainContent>
	);
}
