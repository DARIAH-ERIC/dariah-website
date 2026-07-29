import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { Image } from "@/components/image";
import { SearchContainer } from "@/components/pages/resources/dariah-resources-by-source/search-container";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import { createOpenGraphMetadata } from "@/lib/metadata/open-graph";
import logoSshoc from "@/public/assets/images/logo-sshoc.svg";

interface DariahResourceCataloguePageProps extends PageProps<"/resources/dariah-resource-catalogue"> {}

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
					<div className="flex flex-col gap-8">
						<Typography className="text-h2 font-medium" variant="h1">
							{title}
						</Typography>
						<Image
							alt={image?.alt ?? "SSH open marketplace Logo"}
							className="block w-full max-w-108.5 mt-4 xl:mt-0 xl:hidden"
							src={image?.url ?? logoSshoc}
						/>
						<div>
							<ContentBlocks fields={content} />
						</div>
					</div>
				</div>
				<Image
					alt={image?.alt ?? "SSH open marketplace Logo"}
					className="hidden w-108.5 md:block"
					src={image?.url ?? logoSshoc}
				/>
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
