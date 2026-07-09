import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { Image } from "@/components/image";
import { SearchContainer } from "@/components/pages/resources/dariah-resources-by-source/search-container";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { Link } from "@/components/ui/link/link";
import { client } from "@/lib/data/api-client";
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
	const staticContentResponse = await client.pages.bySlug({ slug: "dariah-campus" });
	const breadcrumbs = navigation().breadcrumbs.dariahCampus;

	const {
		data: { content, image },
	} = staticContentResponse;

	return (
		<Main className="container relative flex flex-col gap-20 pb-20">
			<div className="absolute inset-0 z-0 mask-(--resource-catalogue-divider) bg-(image:--resource-catalogue-divider) h-20 backdrop-blur-[80px]" />
			<div className="flex gap-15 px-4 py-8 z-1 lg:px-33">
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
					<div>
						<ContentBlocks fields={content} />
					</div>
				</div>
				<Image
					alt={image?.alt ?? "Dariah campus Logo"}
					className="hidden w-108.5 xl:block"
					src={image?.url ?? logoDariahCampus}
				/>
			</div>
			<Suspense>
				<SearchContainer source="dariah-campus" />
			</Suspense>

			<div className="mb-16 pl-6 bg-pagination-bg w-80.5 max-w-125 h-21 flex items-center ml-auto lg:mb-20 lg:w-125">
				<Link href="https://campus.dariah.eu/" variant="color-bg" withDefaultRightIcon={true}>
					{t("explore")}
				</Link>
			</div>
		</Main>
	);
}
