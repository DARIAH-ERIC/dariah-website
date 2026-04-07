import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { Image } from "@/components/image";
import { MembersAndPartnersTabs } from "@/components/pages/members-and-partners/detail-page/members-and-partners-tabs";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";

interface MembersAndPartnersPageProps extends PageProps<"/network/members-and-partners/[slug]"> {}

export async function generateStaticParams(): Promise<
	Array<Pick<Awaited<MembersAndPartnersPageProps["params"]>, "slug">>
> {
	const response = await client.membersAndPartners.slugs();

	return response.data.data.map((item) => {
		return { slug: item.entity.slug };
	});
}

export async function generateMetadata(
	props: Readonly<MembersAndPartnersPageProps>,
): Promise<Metadata> {
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.membersAndPartners.bySlug({ slug });

	const { name } = response.data;

	const metadata: Metadata = {
		title: name,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function MembersAndPartnersPage(
	props: Readonly<MembersAndPartnersPageProps>,
): Promise<ReactNode> {
	const { params } = props;
	const t = await getTranslations("MembersAndPartnersDetailPage");

	const breadcrumbs = navigation().breadcrumbs.membersAndPartnersDetailPage;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.membersAndPartners.bySlug({ slug });

	const { name, image, status } = response.data;

	return (
		<Main className="container flex flex-1 flex-col gap-8 px-8 py-12 xl:px-30">
			<div className="flex flex-col gap-10 lg:flex-row lg:gap-33.5">
				<div className="flex flex-col gap-12 max-w-full lg:gap-10 lg:w-265">
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
					<Link href="/network/members-and-partners" variant="secondary" withDefaultLeftIcon={true}>
						{t("browseAll")}
					</Link>
					<div className="flex flex-col gap-8">
						<Typography className="font-medium" variant="h2">
							{name.toUpperCase()}{" "}
							{status === "is_member"
								? `(${t("status.is_member")})`
								: `(${t("status.is_cooperating_partner")})`}
						</Typography>
						{image?.url !== undefined && (
							<Image alt={name} height={72} src={image.url} width={207} />
						)}
						<MembersAndPartnersTabs memberOrPartner={response.data} />
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
