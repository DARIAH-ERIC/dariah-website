import type { JSONContent } from "@tiptap/core";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { CarouselSection } from "@/components/pages/static-pages/carousel-section";
import { QuickLinks } from "@/components/pages/static-pages/quick-links";
import { SectionPanel } from "@/components/pages/static-pages/section-panel";
import { BackToTop } from "@/components/ui/back-to-top/back-to-top";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import { addIdsToContent, getSectionsFromContent } from "@/utils/static-page.utils";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("DariahInANutshell");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function ImpactCaseStudiesPage(): Promise<ReactNode> {
	const _t = await getTranslations("DariahInANutshell");
	const response = await client.pages.bySlug({ slug: "dariah-in-nutshell" });
	const breadcrumbs = navigation().breadcrumbs.documentsAndPolicies;
	const {
		data: { title, content, image },
	} = response;

	if (content.length === 0) return redirect("/");
	const sections =
		content[0]?.type === "rich_text"
			? getSectionsFromContent(content[0].content as JSONContent)
			: [];

	const parsedContent = addIdsToContent(content);

	return (
		<Main className="container flex flex-col mb-16 relative lg:gap-0 lg:mb-0">
			<div className="flex flex-1 flex-col gap-8 px-4 pt-8 lg:px-8 lg:pb-12 xl:px-40">
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
				<Typography className="text-[45px] font-light" variant="h2">
					{title}
				</Typography>
				<div className="flex-col flex gap-8 justify-between lg:py-12 lg:flex-row lg:gap-21">
					<SectionPanel sections={sections} />
					<div className="max-w-full xl:w-252.5">
						<ContentBlocks fields={parsedContent} />
					</div>
					<QuickLinks className="hidden lg:flex" />
				</div>
			</div>
			{image && <CarouselSection images={[{ ...image, id: "1" }]} />}
			<QuickLinks className="flex px-4 mt-16 lg:hidden" />
			<BackToTop />
		</Main>
	);
}
