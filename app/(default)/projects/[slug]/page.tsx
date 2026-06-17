import type { JSONContent } from "@tiptap/core";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { ProjectDetails } from "@/components/pages/projects/project-details/project-details";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { OpenInNewIcon } from "@/components/ui/icons/open-in-new";
import { Link } from "@/components/ui/link/link";
import { RelatedContent } from "@/components/ui/related-content/related-content";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import { mergeEntitiesAndResources } from "@/utils/global.utils";

interface ProjectPageProps extends PageProps<"/projects/[slug]"> {}

export async function generateStaticParams(): Promise<
	Array<Pick<Awaited<ProjectPageProps["params"]>, "slug">>
> {
	const response = await client.projects.slugs();

	return response.data.data.map((item) => {
		return { slug: item.entity.slug };
	});
}

export async function generateMetadata(props: Readonly<ProjectPageProps>): Promise<Metadata> {
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.projects.bySlug({ slug });

	const { name: title } = response.data;

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function ProjectPage(props: Readonly<ProjectPageProps>): Promise<ReactNode> {
	const { params } = props;
	const t = await getTranslations("ProjectsDetailPage");

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const breadcrumbs = navigation().breadcrumbs.projectsDetailPage;
	const response = await client.projects.bySlug({ slug });

	const {
		acronym,
		name,
		image,
		funding,
		description,
		participants,
		relatedEntities,
		relatedResources,
		topic,
		coordinators,
		summary,
		duration: { start, end },
	} = response.data;

	const relatedContent = mergeEntitiesAndResources(relatedEntities, relatedResources);

	const descriptionJsonContent = description.find((item) => {
		return item.type === "rich_text";
	})?.content as JSONContent | null;

	const hasRichText =
		descriptionJsonContent?.content !== undefined
			? descriptionJsonContent.content.length > 0
			: false;

	return (
		<Main className="container flex flex-1 flex-col gap-8 px-8 py-12 xl:px-30">
			<div className="flex flex-col gap-10 lg:flex-row lg:gap-33.5">
				<div className="flex flex-col max-w-full lg:w-265">
					<div className="flex flex-col gap-10">
						{breadcrumbs.length > 0 && (
							<Breadcrumbs>
								{breadcrumbs.map(({ label, href }) => {
									return (
										<Breadcrumb key={label} className="w-fit" href={href}>
											{label}
										</Breadcrumb>
									);
								})}
								<Breadcrumb>{acronym}</Breadcrumb>
							</Breadcrumbs>
						)}
						<Link href="/projects" variant="secondary" withDefaultLeftIcon={true}>
							{t("browseAll")}
						</Link>
						<Typography className="uppercase" variant="h3">
							{acronym}
						</Typography>
					</div>
					<ProjectDetails
						coordinators={coordinators}
						end={end}
						funding={funding}
						image={image}
						name={name}
						start={start}
						topic={topic}
					/>
					<div className="flex flex-col gap-4 px-2 py-10">
						<Typography variant="h3">{"Summary"}</Typography>
						<Typography variant="regular">{summary}</Typography>
					</div>
					{hasRichText && (
						<div className="py-6 px-2">
							<ContentBlocks fields={description} />
						</div>
					)}
					<div className="flex flex-col py-6 px-2 gap-10">
						<div className="flex flex-col gap-4">
							<Typography variant="h4">
								{t("participants.title", { number: participants.length.toString() || "0" })}
							</Typography>
							{participants.length === 0 ? (
								<Typography variant="regular">{t("participants.emptyState")}</Typography>
							) : (
								participants.map((participant) => {
									const { id, socialMedia } = participant;
									const website = socialMedia.find((social) => {
										return social.type === "website";
									});

									const { url: websiteUrl } = website ?? {};

									if (websiteUrl === undefined) {
										return (
											<Typography key={id} className="w-fit cursor-default" variant="regular">
												{participant.name}
											</Typography>
										);
									}

									return (
										<Link
											key={id}
											endIcon={<OpenInNewIcon className="size-5" />}
											href={websiteUrl}
											target="_blank"
											variant="paragraph"
										>
											{participant.name}
										</Link>
									);
								})
							)}
						</div>
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
