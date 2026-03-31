import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { CarouselSection } from "@/components/pages/static-pages/carousel-section";
import { QuickLinks } from "@/components/pages/static-pages/quick-links";
// import { SectionPanel } from "@/components/pages/static-pages/section-panel";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
// import { getSectionsFromContent } from "@/utils/static-page.utils";

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
	const {
		data: { title, content },
	} = response;

	const links = [
		{
			link: "/",
			label: "test",
		},
		{
			link: "/",
			label: "test2",
		},
		{
			link: "/",
			label: "test3",
		},
	];

	if (content.length === 0) return redirect("/");
	// const sections = content[0]?.type === "rich_text" && getSectionsFromContent(content[0]?.content);

	const images = [
		{
			id: "1",
			url: "/assets/images/temp-news-1.jpg",
		},
		{
			id: "2",
			url: "/assets/images/temp-news-2.png",
		},
		{
			id: "3",
			url: "/assets/images/temp-news-3.jpg",
		},
		{
			id: "4",
			url: "/assets/images/temp-news-3.jpg",
		},
		{
			id: "5",
			url: "/assets/images/temp-news-1.jpg",
		},
	];

	return (
		<Main className="container">
			<div className="flex flex-1 flex-col gap-8 px-8 py-12 xs:px-16">
				<Typography className="text-[45px] font-light" variant="h2">
					{title}
				</Typography>
				<div className="py-12 px-40 flex-col flex justify-between lg:flex-row">
					{/* <SectionPanel activeSection="description" sections={sections} /> */}
					{"content"}
					{links.length > 0 && <QuickLinks links={links} />}
				</div>
			</div>
			<CarouselSection images={images} />
		</Main>
	);
}
