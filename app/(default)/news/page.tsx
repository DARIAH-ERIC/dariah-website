import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { NewsCard } from "@/components/ui/news-card/news-card";
import { Pagination } from "@/components/ui/pagination/pagination";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/client";

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

export default async function NewsPage(): Promise<ReactNode> {
	const t = await getTranslations("NewsPage");
	const breadcrumbs = await client.news.breadcrumbs();

	const data = await client.news.list();

	const { items } = data;

	if (items.length === 0)
		return (
			<Main className="flex flex-1 flex-col gap-8 px-34.5 pt-8 pb-30 container">
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
				<Typography className="text-[45px] font-light" variant="h2">
					{t("title")}
				</Typography>
				<p>{t("noNews")}</p>
			</Main>
		);

	const headlineItem = items[0];

	return (
		<Main className="container flex flex-col gap-20">
			<div className="flex flex-col gap-9.25 px-34 py-8">
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
				{headlineItem && (
					<NewsCard
						date={headlineItem.publishedAt.toDateString()}
						description={headlineItem.summary}
						imageUrl={headlineItem.image.url}
						linkUrl={`/news/${headlineItem.slug}`}
						title={headlineItem.title}
						variant="list-headline"
					/>
				)}
			</div>

			<div className="flex flex-col px-34 gap-14">
				<Typography className="text-[45px] font-light" variant="h2">
					{t("title")}
				</Typography>
				<ul className="grid grid-cols-1 gap-y-16 gap-x-35.5 2xl:grid-cols-2" role="list">
					{items.map((item) => {
						const { image, slug, summary, title, publishedAt } = item;

						const href = `/news/${slug}`;

						return (
							<li key={slug} className="flex justify-center">
								<NewsCard
									date={publishedAt.toDateString()}
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

			<div className="mb-20 pl-6 bg-pagination-bg max-w-125 w-125 h-21 flex items-center ml-auto">
				<Pagination pageCount={5} schouldScroll={true} />
			</div>
		</Main>
	);
}
