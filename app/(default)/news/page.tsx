import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { Main } from "@/app/(default)/_components/main";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { NewsCard } from "@/components/ui/news-card/news-card";
import { Pagination } from "@/components/ui/pagination/pagination";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";

interface NewsPageProps extends PageProps<"/news"> {}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("NewsPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function NewsPage(props: Readonly<NewsPageProps>): Promise<ReactNode> {
	const { searchParams } = props;
	const { page = 1, per_page = 14 } = await searchParams;
	const t = await getTranslations("NewsPage");

	const response = await client.news.list({
		limit: Number(per_page),
		offset: (Number(page) - 1) * Number(per_page),
	});
	const breadcrumbs = navigation().breadcrumbs.news;

	const { data: items, total } = response.data;

	if (items.length === 0)
		return (
			<Main className="flex flex-1 flex-col gap-8 container px-4 py-8 lg:pb-30 lg:px-34.5 lg:pt-8">
				{breadcrumbs.length > 0 && (
					<Breadcrumbs>
						{breadcrumbs.map(({ label, href }) => {
							return (
								<Breadcrumb key={label} href={href}>
									{label}
								</Breadcrumb>
							);
						})}
					</Breadcrumbs>
				)}
				<Typography variant="h2">{t("title")}</Typography>
				<p>{t("noNews")}</p>
			</Main>
		);

	const headlineItem = items[0]!;

	const {
		image: headlineImage,
		entity: { slug: headlineSlug },
		summary: headlineSummary,
		title: headlineTitle,
		publishedAt: headlinePublishedAt,
	} = headlineItem;

	return (
		<Main className="container flex flex-col gap-20">
			<div className="flex flex-col gap-9.25 px-4 py-8 lg:px-34">
				{breadcrumbs.length > 0 && (
					<Breadcrumbs>
						{breadcrumbs.map(({ label, href }) => {
							return (
								<Breadcrumb key={label} href={href}>
									{label}
								</Breadcrumb>
							);
						})}
					</Breadcrumbs>
				)}
				<NewsCard
					date={new Date(headlinePublishedAt)}
					description={headlineSummary}
					imageUrl={headlineImage.url}
					linkUrl={`/news/${headlineSlug}`}
					title={headlineTitle}
					variant="list-headline"
				/>
			</div>

			<div className="flex flex-col px-4 gap-14 lg:px-34">
				<Typography variant="h2">{t("title")}</Typography>
				<ul
					className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-1 2xl:gap-x-35.5 2xl:grid-cols-2"
					role="list"
				>
					{items.map((item) => {
						const { entity, image, publishedAt, summary, title } = item;
						const { slug } = entity;

						const href = `/news/${slug}`;

						return (
							<li key={slug} className="flex justify-center">
								<NewsCard
									date={new Date(publishedAt)}
									description={summary}
									imageUrl={image.url}
									linkUrl={href}
									title={title}
									variant="list-item"
								/>
							</li>
						);
					})}
				</ul>
			</div>

			<div className="mb-16 pl-6 bg-pagination-bg w-80.5 max-w-125 h-21 flex items-center ml-auto lg:mb-20 lg:w-125">
				<Suspense>
					<Pagination pageCount={Math.ceil(total / Number(per_page))} shouldScroll={true} />
				</Suspense>
			</div>
		</Main>
	);
}
