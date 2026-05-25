import type { JSONContent } from "@tiptap/core";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { Image } from "@/components/image";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { Link } from "@/components/ui/link/link";
import { PersonCard } from "@/components/ui/person-card/person-card";
import { PersonCardDetails } from "@/components/ui/person-card/person-card-details";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import { getGrouppedPersonMembers } from "@/utils/global.utils";

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
	const { params, searchParams } = props;
	const t = await getTranslations("ImpactCaseStudiesDetailPage");
	const personTranslations = await getTranslations("(default).PersonCard");

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);
	const { person } = await searchParams;

	const response = await client.impactCaseStudies.bySlug({ slug });
	const breadcrumbs = navigation().breadcrumbs.impactCaseStudyDetailPage;
	const { data: selectedPerson } =
		person !== undefined && typeof person === "string"
			? await client.persons.bySlug({ slug: person })
			: {};

	const { title, image, content, contributors } = response.data;

	const grouppedContributors = getGrouppedPersonMembers(contributors);
	const grouppedContributorsKeys = Object.keys(grouppedContributors);

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
													image: { url: imageUrl },
													slug: personSlug,
												} = contributor;

												const positionNames = position
													? position.map((positionObj) => {
															const { role, name } = positionObj;

															return personTranslations(`roles.${role}`, {
																name,
															});
														})
													: [];

												return (
													<PersonCard
														key={id}
														href={`/spotlights/${slug}?person=${personSlug}#contributors`}
														imageUrl={imageUrl}
														name={name}
														position={positionNames.join(", ")}
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
							imageUrl={selectedPerson.image.url}
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
		</Main>
	);
}
