import { cn } from "@acdh-oeaw/style-variants";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { Image } from "@/components/image";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { OpenInNewIcon } from "@/components/ui/icons/open-in-new";
import { Link } from "@/components/ui/link/link";
import { PersonCard } from "@/components/ui/person-card/person-card";
import { PersonCardDetailsContainer } from "@/components/ui/person-card/person-card-details-container";
import { RelatedContent } from "@/components/ui/related-content/related-content";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import { createOpenGraphMetadata } from "@/lib/metadata/open-graph";
import { config as socialMediaConfig } from "@/lib/social-media/social-media.config";
import { getGrouppedPersonMembers, mergeEntitiesAndResources } from "@/utils/global.utils";

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

	const { name, summary } = response.data;

	const metadata: Metadata = {
		title: name,
		description: summary ?? undefined,
		openGraph: await createOpenGraphMetadata({
			description: summary ?? undefined,
			title: name,
		}),
	};

	return metadata;
}

export default async function WorkingGroupPage(
	props: Readonly<WorkingGroupPageProps>,
): Promise<ReactNode> {
	const { params, searchParams } = props;

	const t = await getTranslations("WorkingGroupsDetailPage");

	const breadcrumbs = navigation().breadcrumbs.workingGroupsDetailPage;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);
	const { person } = await searchParams;

	const response = await client.workingGroups.bySlug({ slug });
	const { data: selectedPerson } =
		person !== undefined && typeof person === "string"
			? await client.persons.bySlug({ slug: person })
			: {};

	const {
		name,
		image,
		description,
		relatedEntities,
		relatedResources,
		chairs,
		socialMedia,
		email,
		mailingList,
	} = response.data;

	const relatedContent = mergeEntitiesAndResources(relatedEntities, relatedResources);

	const website = socialMedia.find((media) => {
		return media.type === "website";
	});

	const otherSocialMedia = socialMedia.filter((media) => {
		return media.id !== website?.id;
	});

	const grouppedChairs = getGrouppedPersonMembers(chairs);
	const grouppedChairsKeys = [
		"is_affiliated_with",
		"is_chair_of",
		"is_vice_chair_of",
		"is_member_of",
		"is_director_of",
		"is_president_of",
		"is_contact_for",
		"national_coordinator",
		"national_coordinator_deputy",
		"national_representative",
		"national_representative_deputy",
	];

	const getContactInfo = (): string | undefined => {
		if (email !== null && email !== "") {
			return `mailto:${email}`;
		}

		if (mailingList !== null && mailingList !== "")
			try {
				new URL(mailingList);
				return mailingList;
			} catch {
				return `mailto:${mailingList}`;
			}

		return undefined;
	};

	const hasMailOrMailingList =
		(email !== null && email !== "") || (mailingList !== null && mailingList !== "");

	const contactHref = getContactInfo();

	return (
		<Main className="container flex flex-1 flex-col gap-8 px-8 py-12 2xl:px-30">
			<div className="flex flex-col gap-10 2xl:gap-33.5 lg:flex-row">
				<div className="flex flex-col gap-12 max-w-full lg:w-200 xl:w-210 2xl:gap-14 3xl:w-265">
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
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-8">
							<Typography className="text-h2 font-medium" variant="h1">
								{name}
							</Typography>
							<div className="flex flex-col gap-2">
								{(website !== undefined || otherSocialMedia.length > 0) && (
									<div className="flex flex-col gap-x-6 lg:items-center lg:flex-row lg:flex-wrap">
										{website && (
											<Link
												endIcon={<OpenInNewIcon className="size-5" />}
												href={website.url}
												target="_blank"
												variant="primary"
											>
												{t("visitWebsite")}
											</Link>
										)}
										{otherSocialMedia.length > 0 && (
											<div className="flex gap-4 items-center">
												<Typography variant="regular">{t("visitSocialMedia")}</Typography>
												<div className="flex gap-4 items-center flex-wrap">
													{otherSocialMedia.map((item) => {
														const { type, url, name } = item;
														const Icon = socialMediaConfig[type].icon;
														return (
															<Link
																key={url}
																aria-label={name}
																className="group focus:border-b-2 focus:py-1.5"
																href={url}
																target="_blank"
															>
																<Icon
																	className={cn(
																		"size-5",
																		type !== "website" && type !== "other"
																			? "fill-gray-700 group-hover:fill-primary"
																			: "stroke-gray-700 group-hover:stroke-primary",
																	)}
																/>
															</Link>
														);
													})}
												</div>
											</div>
										)}
									</div>
								)}
								<div>
									<ContentBlocks fields={description} />
								</div>
							</div>
						</div>
						{image != null ? (
							<Image
								alt={image.alt ?? "Image description will be added soon"}
								className="max-h-full max-w-full w-100 object-contain md:w-150 md:h-75 lg:h-110.5 lg:w-197.25"
								height={442}
								src={image.url}
								width={789}
							/>
						) : null}
						<div className="flex flex-col gap-10 pt-6 pb-14 relative">
							<div className="absolute -top-20" id="chairs" />
							{!selectedPerson ? (
								grouppedChairsKeys.length > 0 ? (
									<div className="flex flex-wrap gap-x-23 gap-y-10">
										{grouppedChairsKeys.map((chairsGroupKey) => {
											if (
												grouppedChairs[chairsGroupKey]?.length === 0 ||
												grouppedChairs[chairsGroupKey] === undefined
											)
												return null;

											return (
												<div key={chairsGroupKey} className="flex flex-col flex-wrap gap-6">
													<div className="flex flex-col justify-between h-10">
														<Typography className="text-small font-bold font-body" variant="h2">
															{t(
																`chairs.groups.${chairsGroupKey as "author" | "editor" | "contributor"}`,
															)}
														</Typography>
														<hr className="w-17.5 h-0.5 border-t-2 border-gray-200" />
													</div>
													<div className="flex flex-wrap justify-between gap-6">
														{grouppedChairs[chairsGroupKey].map((chair) => {
															const {
																id,
																name,
																positions,
																image: chairImage,
																slug: personSlug,
															} = chair;

															const { url: imageUrl } = chairImage ?? { url: null };

															return (
																<PersonCard
																	key={id}
																	href={`/network/working-groups/${slug}?person=${personSlug}#chairs`}
																	imageUrl={imageUrl}
																	name={name}
																	nameTag="h3"
																	position={positions}
																/>
															);
														})}
													</div>
												</div>
											);
										})}
									</div>
								) : (
									<Typography variant="regular">{t("groupChars.emptyState")}</Typography>
								)
							) : (
								<PersonCardDetailsContainer
									backToListText={t("groupChars.backToList")}
									href={`/network/working-groups/${slug}#chairs`}
									selectedPerson={selectedPerson}
								/>
							)}
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-23.25 lg:pt-40.5 lg:w-109">
					{hasMailOrMailingList && (
						<div className="flex flex-col gap-6">
							<div className="flex flex-col gap-4">
								<Typography variant="h2">{t("joinGroup.title")}</Typography>
								<hr className="w-22.5 h-0.5 bg-(image:--working-group-detail-divider)" />
							</div>
							<Typography variant="regular">{t("joinGroup.description")}</Typography>
							<Link className="w-fit" href={contactHref} variant="button-tertiary">
								{t("joinGroup.button")}
							</Link>
						</div>
					)}
					<div className="flex flex-col gap-6">
						<Typography variant="h2">{t("relatedContent.title")}</Typography>
						{relatedContent.length > 0 ? (
							relatedContent.map((entity) => {
								const { id, type, label, link } = entity;

								return <RelatedContent key={id} category={type} href={link} title={label ?? ""} />;
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
