import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { Image } from "@/components/image";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { NewsCard } from "@/components/ui/news-card/news-card";
import { RelatedContent } from "@/components/ui/related-content/related-content";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import { getFormattedDateForNews } from "@/utils/news-page.utils";

interface NewsItemPageProps extends PageProps<"/news/[slug]"> {}

export async function generateStaticParams(): Promise<
	Array<Pick<Awaited<NewsItemPageProps["params"]>, "slug">>
> {
	const response = await client.news.slugs();

	return response.data.data.map((item) => {
		return { slug: item.entity.slug };
	});
}

export async function generateMetadata(props: Readonly<NewsItemPageProps>): Promise<Metadata> {
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.news.bySlug({ slug });

	const { title } = response.data;

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function NewsItemPage(props: Readonly<NewsItemPageProps>): Promise<ReactNode> {
	const { params } = props;
	const t = await getTranslations("NewssDetailPage");

	const breadcrumbs = navigation().breadcrumbs.newsDetailPage;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const [response, latestNewsResponse] = await Promise.all([
		client.news.bySlug({ slug }),
		client.news.list({ limit: 4 }),
	]);

	const { title, image, content, summary, publishedAt, relatedEntities } = response.data;
	const { data: latestNews } = latestNewsResponse.data;

	return (
		<Main className="container flex flex-1 flex-col mb-16 lg:mb-20 lg:gap-20">
			<div className="flex flex-1 flex-col gap-14 px-8 py-12 lg:gap-18.25 xl:px-16 2xl:px-30">
				{breadcrumbs.length > 0 && (
					<Breadcrumbs>
						{breadcrumbs.map(({ label, href }) => {
							return (
								<Breadcrumb key={label} className="w-fit" href={href}>
									{label}
								</Breadcrumb>
							);
						})}
						<Breadcrumb>{slug.replaceAll("-", " ")}</Breadcrumb>
					</Breadcrumbs>
				)}
				<div className="flex flex-col gap-12 lg:flex-row">
					<div className="flex flex-col gap-12 max-w-full lg:w-265">
						<div className="flex flex-col gap-6">
							<Typography className="font-bold" variant="h2">
								{title}
							</Typography>
							<Typography variant="regular">{getFormattedDateForNews(publishedAt)}</Typography>
						</div>
						<Typography variant="h4">{summary}</Typography>
						<Image alt={title} className="w-full" height={628.25} src={image.url} width={1150} />
						<div>
							<ContentBlocks fields={content} />
						</div>
					</div>
					<div className="flex flex-col gap-23.25 lg:pt-12 lg:w-109">
						<div className="flex flex-col gap-6">
							<Typography variant="h2">{t("relatedContent.title")}</Typography>
							{relatedEntities.length > 0 ? (
								relatedEntities.map((entity) => {
									const { id, entityType, label } = entity;
									return (
										<RelatedContent
											key={id}
											category={
												entityType as
													| "news"
													| "working-group"
													| "opportunity"
													| "event"
													| "project"
													| "spotlight-article"
													| "case-study"
													| "resources"
											}
											title={label ?? ""}
										/>
									);
								})
							) : (
								<Typography variant="regular">{t("relatedContent.emptyState")}</Typography>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="bg-gray-200 w-full py-20 px-4 flex flex-col gap-12 lg:px-34">
				<Typography variant="h2">{t("latest.title")}</Typography>
				{latestNews.length > 0 ? (
					<div className="flex flex-col gap-10 items-center lg:justify-between lg:flex-wrap lg:gap-17 lg:flex-row">
						{latestNews.map((newsItem) => {
							return (
								<NewsCard
									key={newsItem.id}
									date={newsItem.publishedAt}
									description={newsItem.summary}
									imageUrl={newsItem.image.url}
									linkUrl={`/news/${newsItem.entity.slug}`}
									title={newsItem.title}
									variant="standard"
								/>
							);
						})}
					</div>
				) : (
					<Typography variant="regular">{t("latest.emptyState")}</Typography>
				)}
			</div>
		</Main>
	);
}
