import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { Image } from "@/components/image";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import { getFormattedDateForDetails } from "@/utils/spotlight-page.utils";

interface SpotlightArticlePageProps extends PageProps<"/spotlights/[slug]"> {}

export async function generateStaticParams(): Promise<
	Array<Pick<Awaited<SpotlightArticlePageProps["params"]>, "slug">>
> {
	const response = await client.spotlightArticles.slugs();

	return response.data.data.map((item) => {
		return { slug: item.entity.slug };
	});
}

export async function generateMetadata(
	props: Readonly<SpotlightArticlePageProps>,
): Promise<Metadata> {
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.spotlightArticles.bySlug({ slug });

	const { title } = response.data;

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function SpotlightArticlePage(
	props: Readonly<SpotlightArticlePageProps>,
): Promise<ReactNode> {
	const { params } = props;
	const t = await getTranslations("SpotlightArticlesDetailPage");

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const breadcrumbs = navigation().breadcrumbs.projectsDetailPage;
	const response = await client.spotlightArticles.bySlug({ slug });

	const { title, content, image, publishedAt } = response.data;

	return (
		<Main className="container flex flex-1 flex-col gap-8 px-8 py-12 xl:px-30">
			<div className="flex flex-col gap-10 lg:flex-row lg:gap-33.5">
				<div className="flex flex-col gap-10 max-w-full lg:w-265">
					{breadcrumbs.length > 0 && (
						<Breadcrumbs>
							{breadcrumbs.map(({ label, href }) => {
								return (
									<Breadcrumb key={label} className="w-fit" href={href}>
										{label}
									</Breadcrumb>
								);
							})}
							<Breadcrumb>{slug}</Breadcrumb>
						</Breadcrumbs>
					)}
					<Link href="/spotlights" variant="secondary" withDefaultLeftIcon={true}>
						{t("browseAll")}
					</Link>
					<div className="flex flex-col gap-4">
						<Typography className="uppercase" variant="h3">
							{title}
						</Typography>
						<Typography variant="regular">{getFormattedDateForDetails(publishedAt)}</Typography>
					</div>
					<Image
						alt={title}
						className="w-full h-87.5 object-contain"
						height={350}
						src={image.url}
						width={1100}
					/>
					<div>
						<ContentBlocks fields={content} />
					</div>
					<div className="flex flex-col gap-10 pt-6 pb-9">
						<Typography variant="h4">{t("contributors.title")}</Typography>
						<Typography variant="regular">{t("contributors.empty")}</Typography>
					</div>
				</div>
				<div className="flex flex-col gap-23.25 lg:pt-40.5 lg:w-109">
					<div className="flex flex-col gap-6">
						<Typography variant="h2">{t("relatedContent.title")}</Typography>
						<Typography variant="regular">{t("relatedContent.emptyState")}</Typography>
					</div>
				</div>
			</div>
		</Main>
	);
}
