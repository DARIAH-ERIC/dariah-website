import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { ContentImage, Image } from "@/components/image";
import { SearchContainer } from "@/components/pages/resources/dariah-resources-by-source/search-container";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import { createOpenGraphMetadata } from "@/lib/metadata/open-graph";
import logoSshoc from "@/public/assets/images/logo-sshoc.svg";

interface DariahResourceCataloguePageProps extends PageProps<"/resources/ssh-open-marketplace"> {}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("SSHMarketplaceResourcesPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: await createOpenGraphMetadata({ title }),
	};

	return metadata;
}

export default async function DariahResourceCataloguePage(
	_props: Readonly<DariahResourceCataloguePageProps>,
): Promise<ReactNode> {
	const t = await getTranslations("SSHMarketplaceResourcesPage");
	const staticContentResponse = await client.pages.bySlug({ slug: "ssh-open-marketplace" });
	const breadcrumbs = navigation().breadcrumbs.sshOpenMarketplace;

	const {
		data: { content, image, title },
	} = staticContentResponse;
	const ResourceLogo = image?.url == null ? Image : ContentImage;
	const resourceLogo = image?.url ?? logoSshoc;

	return (
		<Main className="container relative flex flex-col gap-20 pb-20">
			<div className="absolute inset-0 mask-(--resource-catalogue-divider) bg-(image:--resource-catalogue-divider) h-20 backdrop-blur-[5rem]" />
			<div className="flex w-full flex-col gap-14 px-4 py-8 lg:px-33">
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
				<div className="grid w-full gap-x-15 gap-y-8 xl:grid-cols-[minmax(0,1fr)_auto]">
					<div className="flex w-full max-w-251 min-w-0 flex-col gap-8">
						<Typography className="text-h2 font-medium" variant="h1">
							{title}
						</Typography>
						<ResourceLogo
							alt={image?.alt ?? ""}
							className="block w-full max-w-108.5 mt-4 xl:mt-0 xl:hidden"
							src={resourceLogo}
						/>
					</div>
					<div className="w-full max-w-251 min-w-0 xl:row-start-2 xl:col-start-1">
						<ContentBlocks fields={content} />
					</div>
					<ResourceLogo
						alt={image?.alt ?? ""}
						className="hidden w-108.5 xl:row-start-2 xl:col-start-2 xl:block"
						src={resourceLogo}
					/>
				</div>
			</div>
			<Suspense>
				<SearchContainer source="ssh-open-marketplace" />
			</Suspense>

			<div className="mb-16 pl-6 bg-pagination-bg w-80.5 max-w-125 h-21 flex items-center ml-auto lg:mb-20 lg:w-125">
				<Link
					href="https://marketplace.sshopencloud.eu/"
					variant="color-bg"
					withDefaultRightIcon={true}
				>
					{t("explore")}
				</Link>
			</div>
		</Main>
	);
}
