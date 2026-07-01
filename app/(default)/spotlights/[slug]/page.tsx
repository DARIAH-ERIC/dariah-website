import type { JSONContent } from "@tiptap/core";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { Image } from "@/components/image";
import { RichTextCaption } from "@/components/rich-text-caption";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { Link } from "@/components/ui/link/link";
import { PersonCard } from "@/components/ui/person-card/person-card";
import { PersonCardDetails } from "@/components/ui/person-card/person-card-details";
import { RelatedContent } from "@/components/ui/related-content/related-content";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import { getGrouppedPersonMembers, mergeEntitiesAndResources } from "@/utils/global.utils";
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
	const { params, searchParams } = props;
	const t = await getTranslations("SpotlightArticlesDetailPage");

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);
	const { person } = await searchParams;

	const breadcrumbs = navigation().breadcrumbs.spotlightArticlesDetailPage;
	const response = await client.spotlightArticles.bySlug({ slug });
	const { data: selectedPerson } =
		person !== undefined && typeof person === "string"
			? await client.persons.bySlug({ slug: person })
			: {};

	const { title, content, image, publishedAt, contributors, relatedEntities, relatedResources } =
		response.data;

	const relatedContent = mergeEntitiesAndResources(relatedEntities, relatedResources);

	const grouppedContributors = getGrouppedPersonMembers(contributors);
	const grouppedContributorsKeys = Object.keys(grouppedContributors);

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
							<Breadcrumb>{title}</Breadcrumb>
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
					<figure className="flex flex-col gap-7">
						<Image
							alt={image.alt ?? title}
							className="w-full h-87.5 object-contain"
							height={350}
							src={image.url}
							width={1100}
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
					<div className="flex flex-col gap-10 pt-6 pb-9 relative">
						<div className="absolute -top-20" id="contributors" />
						<Typography variant="h4">{t("contributors.title")}</Typography>
						{!selectedPerson ? (
							grouppedContributorsKeys.length > 0 ? (
								<div className="flex flex-wrap gap-x-23 gap-y-10">
									{grouppedContributorsKeys.map((contributorGroupKey) => {
										return (
											<div key={contributorGroupKey} className="flex flex-col flex-wrap gap-6">
												<div className="flex flex-col justify-between h-10">
													<Typography className="font-bold" variant="small">
														{t(
															`contributors.groups.${contributorGroupKey as "author" | "editor" | "contributor"}`,
														)}
													</Typography>
													<hr className="w-17.5 h-0.5 border-t-2 border-gray-200" />
												</div>
												<div className="flex flex-wrap justify-between gap-6">
													{grouppedContributors[contributorGroupKey]?.map((contributor) => {
														const {
															id,
															name,
															position,
															image: contributorImage,
															slug: personSlug,
														} = contributor;

														const { url: imageUrl } = contributorImage ?? { url: null };

														return (
															<PersonCard
																key={id}
																href={`/spotlights/${slug}?person=${personSlug}#contributors`}
																imageUrl={imageUrl}
																name={name}
																position={position}
															/>
														);
													})}
												</div>
											</div>
										);
									})}
								</div>
							) : (
								<Typography variant="regular">{t("contributors.empty")}</Typography>
							)
						) : (
							<div className="flex flex-col flex-wrap gap-10 w-full">
								<Link
									href={`/spotlights/${slug}#contributors`}
									variant="primary"
									withDefaultLeftIcon={true}
								>
									{t("contributors.backToList")}
								</Link>
								<PersonCardDetails
									description={
										selectedPerson.biography.find((content) => {
											return content.type === "rich_text";
										}) as JSONContent
									}
									email={selectedPerson.email ?? undefined}
									imageUrl={selectedPerson.image?.url}
									name={selectedPerson.name}
									position={
										selectedPerson.position
											?.map((pos) => {
												return pos.name;
											})
											.join(", ") ?? undefined
									}
								/>
							</div>
						)}
					</div>
				</div>
				<div className="flex flex-col gap-23.25 lg:pt-40.5 lg:w-109">
					<div className="flex flex-col gap-6">
						<Typography variant="h2">{t("relatedContent.title")}</Typography>
						{relatedContent.length > 0 ? (
							relatedContent.map((entity) => {
								const { id, type, label, link } = entity;

								return <RelatedContent key={id} category={type} href={link} title={label ?? ""} />;
							})
						) : (
							<Typography variant="regular">{t("relatedContent.emptyState")}</Typography>
						)}
					</div>
				</div>
			</div>
		</Main>
	);
}
