import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { Main } from "@/app/(default)/_components/main";
import { Image } from "@/components/image";
import { SearchContainer } from "@/components/pages/resources/dariah-resources-by-source/search-box";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";
import { navigation } from "@/lib/data/client";
import logoDariahCampus from "@/public/assets/images/logo-dariah-campus.svg";

interface DariahResourceCataloguePageProps extends PageProps<"/resources/dariah-resource-catalogue"> {}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("DariahCampusResourcesPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function DariahResourceCataloguePage(
	_props: Readonly<DariahResourceCataloguePageProps>,
): Promise<ReactNode> {
	const t = await getTranslations("DariahCampusResourcesPage");
	const breadcrumbs = navigation().breadcrumbs.dariahResourceCatalogue.breadcrumbs;

	return (
		<Main className="container relative flex flex-col gap-20 pb-20">
			<div className="absolute inset-0 mask-(--resource-catalogue-divider) bg-(image:--resource-catalogue-divider) h-20 backdrop-blur-[80px]" />
			<div className="flex gap-15 px-4 py-8 lg:px-33">
				<div className="flex flex-col gap-14 max-w-251">
					{breadcrumbs.length > 0 && (
						<Breadcrumbs>
							{breadcrumbs.map(({ label, href }) => {
								return (
									<Breadcrumb key={label} className="w-fit" href={href}>
										{label}
									</Breadcrumb>
								);
							})}
						</Breadcrumbs>
					)}
					<div className="flex flex-col gap-12">
						<Typography className="font-medium" variant="h2">
							{t("title")}
						</Typography>
						<Image
							alt="SSH open marketplace Logo"
							className="w-82 md:hidden"
							src={logoDariahCampus}
						/>
						<Typography variant="regular">{t("description")}</Typography>
					</div>
				</div>
				<Image
					alt="SSH open marketplace Logo"
					className="hidden w-108.5 md:block"
					src={logoDariahCampus}
				/>
			</div>
			<Suspense>
				<SearchContainer source="dariah-campus" />
			</Suspense>

			<div className="mb-16 pl-6 bg-pagination-bg w-80.5 max-w-125 h-21 flex items-center ml-auto lg:mb-20 lg:w-125">
				<Link
					href="/resources/dariah-resource-catalogue"
					variant="color-bg"
					withDefaultRightIcon={true}
				>
					{t("explore")}
				</Link>
			</div>
		</Main>
	);
}
