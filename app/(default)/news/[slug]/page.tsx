import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { Image } from "@/components/image";
import { RichTextCaption } from "@/components/rich-text-caption";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { NewsCard } from "@/components/ui/news-card/news-card";
import { RelatedContent } from "@/components/ui/related-content/related-content";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import { createOpenGraphMetadata } from "@/lib/metadata/open-graph";
import { mergeEntitiesAndResources } from "@/utils/global.utils";
import { getFormattedDateForNews, getHrefForAnnouncement } from "@/utils/news-page.utils";

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

	const { title, image, summary } = response.data;

	const metadata: Metadata = {
		title,
		description: summary,
		openGraph: await createOpenGraphMetadata({
			description: summary,
			image,
			imagePathname: `/news/${_slug}/opengraph-image`,
			title,
			type: "article",
		}),
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
		client.announcements.list({ limit: 5 }),
	]);

	const { id, title, image, content, summary, publishedAt, relatedEntities, relatedResources } =
		response.data;
	const { data: latestNews } = latestNewsResponse.data;

	const relatedContent = mergeEntitiesAndResources(relatedEntities, relatedResources);

	const filterLatestNews = () => {
		const hasCurrentNews = latestNews.find((news) => {
			return news.id === id;
		});

		if (hasCurrentNews) {
			return latestNews.filter((news) => {
				return news.id !== id;
			});
		}

		const sortedNews = latestNews.toSorted((newsA, newsB) => {
			return newsB.publishedAt.getTime() - newsA.publishedAt.getTime();
		});

		return sortedNews.slice(0, 4);
	};

	const filteredLatestNews = filterLatestNews();

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
						<figure className="flex flex-col gap-y-4">
							<Image
								alt={image.alt ?? ""}
								className="w-full"
								height={628.25}
								src={image.url}
								width={1150}
							/>
							{image.caption !== null && (
								<figcaption className="text-small text-gray-900">
									<RichTextCaption content={image.caption} />. {image.license?.name}
								</figcaption>
							)}
						</figure>
						<div>
							<ContentBlocks fields={content} />
						</div>
					</div>
					<div className="flex flex-col gap-23.25 lg:pt-12 lg:w-109">
						<div className="flex flex-col gap-6">
							<Typography variant="h2">{t("relatedContent.title")}</Typography>
							{relatedContent.length > 0 ? (
								relatedContent.map((entity) => {
									const { id, type, label, link } = entity;

									return (
										<RelatedContent key={id} category={type} href={link} title={label ?? ""} />
									);
								})
							) : (
								<Typography variant="regular">{t("relatedContent.emptyState")}</Typography>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="bg-gray-200 w-full py-20 px-4 flex flex-col gap-6 xl:px-12 3xl:gap-12 3xl:px-34">
				<Typography variant="h2">{t("latest.title")}</Typography>
				{filteredLatestNews.length > 0 ? (
					<div className="flex flex-col gap-10 items-center lg:justify-between xl:gap-6 xl:flex-row 3xl:gap-17">
						{filteredLatestNews.map((newsItem) => {
							const href = getHrefForAnnouncement({
								slug: newsItem.entity.slug,
								type: newsItem.type,
							});

							return (
								<NewsCard
									key={newsItem.id}
									className="xl:max-w-[23%]! 3xl:max-w-full!"
									date={newsItem.publishedAt}
									description={newsItem.summary}
									imageAlt={newsItem.image.alt}
									imageUrl={newsItem.image.url}
									linkUrl={href}
									title={newsItem.title}
									type={newsItem.type}
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
