import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
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
	const breadcrumbs = navigation().breadcrumbs.spotlightArticles;

	const { data: items } = response.data;

	return (
		<Main className="container relative flex flex-1 flex-col gap-16 pb-40 xl:gap-12 md:px-8">
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
				<div className="flex p-2.5 flex-col gap-12 xl:gap-11 xl:mx-6">
					<Typography variant="h2">{t("title")}</Typography>
					<div className="flex flex-col gap-12 xl:gap-6">
						<Typography className="text-[22px] font-medium" variant="regular">
							{t("description.part1")}
						</Typography>
						<div className="flex flex-col gap-12 xl:gap-20 xl:flex-row">
							<Typography className="text-[19px] max-w-175" variant="regular">
								{t("description.part2")}
							</Typography>
							<Typography className="text-[19px] max-w-175" variant="regular">
								{t("description.part3")}
							</Typography>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-10 px-4 lg:px-35.5">
				<Typography variant="h3">{t("subtitle")}</Typography>
				<ul
					className="flex flex-wrap justify-center gap-14 pt-10 bg-gray-100 lg:gap-x-30"
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
			</div>
		</Main>
	);
}
