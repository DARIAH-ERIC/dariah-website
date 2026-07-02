import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { SpotlightCard } from "@/components/ui/spotlight-card/spotlight-card";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("SpotlightArticlesPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function SpotlightArticlesPage(): Promise<ReactNode> {
	const t = await getTranslations("SpotlightArticlesPage");

	const response = await client.spotlightArticles.list();
	const staticContentResponse = await client.pages.bySlug({ slug: "spotlights" });
	const breadcrumbs = navigation().breadcrumbs.spotlightArticles;

	const { data: items } = response.data;

	const {
		data: { content },
	} = staticContentResponse;

	return (
		<Main className="container relative flex flex-1 flex-col pb-16 gap-16 xl:pb-40 xl:gap-12 md:px-8">
			<div className="absolute inset-0 mask-(--spotlight-list-divider) bg-(image:--spotlight-list-divider) h-20 backdrop-blur-[80px]" />
			<div className="flex flex-col gap-13 px-4 pt-8 lg:px-28">
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
				<div className="gap-4 xl:columns-2 3xl:gap-x-23.5 [&>*:first-child]:pb-4 [&>*:first-child]:[column-span:all] [&>*:nth-child(2)]:mt-0!">
					<ContentBlocks fields={content} />
				</div>
			</div>
			<div className="flex flex-col gap-10 px-4 3xl:px-35.5">
				<Typography variant="h3">{t("subtitle")}</Typography>
				{items.length > 0 ? (
					<ul
						className="grid gap-14 pt-10 mx-auto bg-gray-100 md:grid-cols-2 2xl:gap-x-20 3xl:gap-x-30"
						role="list"
					>
						{items.map((item) => {
							const { entity, image, publishedAt, summary, title } = item;
							const { slug } = entity;
							const href = `/spotlights/${slug}`;

							return (
								<SpotlightCard
									key={slug}
									href={href}
									imageUrl={image.url}
									publishedAt={publishedAt}
									summary={summary}
									title={title}
								/>
							);
						})}
					</ul>
				) : (
					<div className="flex flex-wrap justify-center gap-14 pt-10 bg-gray-100 lg:gap-x-30 2xl:justify-start">
						<Typography variant="regular">{t("emptyState")}</Typography>
					</div>
				)}
			</div>
		</Main>
	);
}
