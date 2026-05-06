import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { Image } from "@/components/image";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { Button } from "@/components/ui/button/button";
import { Link } from "@/components/ui/link/link";
import { PersonCard } from "@/components/ui/person-card/person-card";
import { RelatedContent } from "@/components/ui/related-content/related-content";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";

interface WorkingGroupPageProps extends PageProps<"/network/working-groups/[slug]"> {}

export async function generateStaticParams(): Promise<
	Array<Pick<Awaited<WorkingGroupPageProps["params"]>, "slug">>
> {
	const response = await client.workingGroups.slugs();

	return response.data.data.map((item) => {
		return { slug: item.entity.slug };
	});
}

export async function generateMetadata(props: Readonly<WorkingGroupPageProps>): Promise<Metadata> {
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.workingGroups.bySlug({ slug });

	const { name } = response.data;

	const metadata: Metadata = {
		title: name,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function WorkingGroupPage(
	props: Readonly<WorkingGroupPageProps>,
): Promise<ReactNode> {
	const { params } = props;
	const t = await getTranslations("WorkingGroupsDetailPage");

	const breadcrumbs = navigation().breadcrumbs.workingGroupsDetailPage;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.workingGroups.bySlug({ slug });

	const { name, image, description, relatedEntities, chairs, socialMedia } = response.data;

	const website = socialMedia.find((media) => {
		return media.type === "website";
	});

	return (
		<Main className="container flex flex-1 flex-col gap-8 px-8 py-12 2xl:px-30">
			<div className="flex flex-col gap-10 xl:flex-wrap xl:flex-row 2xl:gap-33.5">
				<div className="flex flex-col gap-12 max-w-full lg:gap-14 2xl:w-265">
					{breadcrumbs.length > 0 && (
						<Breadcrumbs>
							{breadcrumbs.map(({ label, href }) => {
								return (
									<Breadcrumb key={label} className="w-fit" href={href}>
										{label}
									</Breadcrumb>
								);
							})}
							<Breadcrumb>{name}</Breadcrumb>
						</Breadcrumbs>
					)}
					<Link href="/network/working-groups" variant="secondary" withDefaultLeftIcon={true}>
						{t("browseAll")}
					</Link>
					<div className="flex flex-col gap-8">
						<Typography className="font-medium" variant="h2">
							{name}
						</Typography>
						<ContentBlocks fields={description} />
					</div>
					{image != null ? (
						<Image
							alt={name}
							className="max-h-full max-w-full object-cover lg:h-110.5 lg:w-197.25"
							height={442}
							src={image.url}
							width={789}
						/>
					) : null}
					<div className="flex flex-col gap-10 pt-6 pb-14">
						<Typography variant="h4">{t("groupChars.title")}</Typography>
						{chairs.length > 0 ? (
							<div className="flex flex-wrap gap-x-23 gap-y-10">
								{chairs.map((chair) => {
									const {
										id,
										name,
										position,
										image: { url: imageUrl },
									} = chair;

									const positionNames = position
										? position.map((positionObj) => {
												return positionObj.name;
											})
										: [];

									return (
										<PersonCard
											key={id}
											imageUrl={imageUrl}
											name={name}
											position={positionNames.join(", ")}
										/>
									);
								})}
							</div>
						) : (
							<Typography variant="regular">{t("groupChars.empty")}</Typography>
						)}
					</div>
				</div>
				<div className="flex flex-col gap-23.25 lg:pt-40.5 lg:w-109">
					<div className="flex flex-col gap-6">
						<div className="flex flex-col gap-4">
							<Typography variant="h2">{t("joinGroup.title")}</Typography>
							<hr className="w-22.5 h-0.5 bg-(image:--working-group-detail-divider)" />
						</div>
						<Typography variant="regular">{t("joinGroup.description")}</Typography>
						<Button className="w-fit" href={website?.url} variant="tertiary">
							{t("joinGroup.button")}
						</Button>
					</div>
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
							<Typography variant="regular">{t("relatedContent.emptyState", { name })}</Typography>
						)}
					</div>
				</div>
			</div>
		</Main>
	);
}
