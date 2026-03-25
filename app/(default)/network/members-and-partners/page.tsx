import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { MapWrapper } from "@/components/pages/members-and-partners/map-wrapper";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { Typography } from "@/components/ui/typography/typography";
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
	const t = await getTranslations("MembersAndPartnersPage");
	const breadcrumbs = navigation().breadcrumbs.membersAndPartners;
	const response = await client.membersAndPartners.list({ limit: 100 });
	const { data: items } = response.data;

	return (
		<Main className="container flex flex-1 flex-col gap-8 xl:gap-0">
			<div className="flex flex-col gap-12 px-4 py-8 lg:px-31">
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
				<Typography variant="h2">{t("title")}</Typography>
				<div className="flex flex-col gap-23.5 lg:flex-row">
					<Typography
						className="text-[22px] w-full max-w-175 whitespace-pre-line"
						variant="regular"
					>
						{t("description.part1")}
					</Typography>
					<Typography className="text-[22px] w-full max-w-175" variant="regular">
						{t("description.part2")}
					</Typography>
				</div>
			</div>
			<MapWrapper countries={items} geoJson={geoJson as CountryGeoJSON} />
		</Main>
	);
}
