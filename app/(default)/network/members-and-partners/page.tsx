import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { MapWrapper } from "@/components/pages/members-and-partners/map-wrapper";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import geoJson from "@/public/assets/map/custom.geo.json";
import type { CountryGeoJSON } from "@/types/map";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("MembersAndPartnersPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function WorkingGroupsPage(): Promise<ReactNode> {
	const breadcrumbs = navigation().breadcrumbs.membersAndPartners;
	const response = await client.membersAndPartners.list({ limit: 100 });
	const staticContentResponse = await client.pages.bySlug({ slug: "members-and-partners" });
	const { data: items } = response.data;

	const {
		data: { content },
	} = staticContentResponse;

	return (
		<Main className="container flex flex-1 flex-col gap-8 xl:gap-0">
			<div className="flex flex-col gap-12 px-4 py-8 xl:px-31 2xl:pb-15">
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
				<div className="gap-4 xl:columns-2 3xl:gap-x-23.5 [&>*:first-child]:pb-4 [&>h1:first-child]:[column-span:all] [&>*:nth-child(2)]:mt-0!">
					<ContentBlocks fields={content} />
				</div>
			</div>
			<MapWrapper countries={items} geoJson={geoJson as CountryGeoJSON} />
		</Main>
	);
}
