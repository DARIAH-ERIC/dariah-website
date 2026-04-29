import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { Image } from "@/components/image";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { OpenInNewIcon } from "@/components/ui/icons/open-in-new";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";

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

	const { name, image, description, participants } = response.data;

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
					<Link href="/network/working-groups" variant="secondary" withDefaultLeftIcon={true}>
						{t("browseAll")}
					</Link>
					<Typography className="uppercase" variant="h3">
						{slug}
					</Typography>
					<div>
						{image?.url !== undefined && (
							<Image
								alt={name}
								className="w-62.5 h-48 object-cover md:float-right md:ml-5"
								height={192}
								src={image.url}
								width={250}
							/>
						)}
						<ContentBlocks fields={description} />
					</div>
					<div className="flex flex-col py-6 gap-10">
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
						<Typography variant="regular">{t("relatedContent.emptyState")}</Typography>
						<Typography variant="h2">{t("featuredOutcome.title")}</Typography>
						<Typography variant="regular">{t("featuredOutcome.emptyState")}</Typography>
					</div>
				</div>
			</div>
		</Main>
	);
}
