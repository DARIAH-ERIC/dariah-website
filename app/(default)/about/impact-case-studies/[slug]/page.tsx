import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { Image } from "@/components/image";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { PersonCard } from "@/components/ui/person-card/person-card";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";

interface ImpactCaseStudyPageProps extends PageProps<"/about/impact-case-studies/[slug]"> {}

export async function generateStaticParams(): Promise<
	Array<Pick<Awaited<ImpactCaseStudyPageProps["params"]>, "slug">>
> {
	const response = await client.impactCaseStudies.slugs();

	return response.data.data.map((item) => {
		return { slug: item.entity.slug };
	});
}

export async function generateMetadata(
	props: Readonly<ImpactCaseStudyPageProps>,
): Promise<Metadata> {
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.impactCaseStudies.bySlug({ slug });

	const { title } = response.data;

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function ImpactCaseStudyPage(
	props: Readonly<ImpactCaseStudyPageProps>,
): Promise<ReactNode> {
	const { params } = props;
	const t = await getTranslations("ImpactCaseStudiesDetailPage");

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.impactCaseStudies.bySlug({ slug });
	const breadcrumbs = navigation().breadcrumbs.impactCaseStudyDetailPage;

	const { title, image, content, contributors } = response.data;

	return (
		<Main className="container flex flex-1 flex-col gap-14">
			<div className="flex flex-col gap-14 pt-8">
				{breadcrumbs.length > 0 && (
					<Breadcrumbs className="px-4 lg:px-34.5">
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
				<Typography className="px-4 lg:px-60 xl:px-98.5" variant="h2">
					{title}
				</Typography>
			</div>
			<div className="flex flex-col gap-11.5">
				<Image alt={title} height={621} src={image.url} width={1920} />
				<div className="px-4 lg:px-62 xl:px-102.5">
					<ContentBlocks fields={content} />
				</div>
			</div>
			<div className="flex flex-col gap-10 pb-14 px-4 lg:px-62 xl:px-102.5">
				<Typography variant="h4">{t("contributors.title")}</Typography>
				{contributors.length > 0 ? (
					<div className="flex flex-wrap gap-x-23 gap-y-10">
						{contributors.map((contributor) => {
							const {
								id,
								name,
								position,
								image: { url: imageUrl },
							} = contributor;

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
					<Typography variant="regular">{t("contributors.empty")}</Typography>
				)}
			</div>
		</Main>
	);
}
