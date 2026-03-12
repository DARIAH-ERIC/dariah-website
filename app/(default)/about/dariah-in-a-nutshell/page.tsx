import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { QuickLinks } from "@/components/pages/static-pages/quick-links";
import { SectionPanel } from "@/components/pages/static-pages/section-panel";
import { Typography } from "@/components/ui/typography/typography";

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
	const t = await getTranslations("DariahInANutshell");

	const links = [
		{
			link: "/",
			label: "test",
		},
		{
			link: "/",
			label: "test",
		},
		{
			link: "/",
			label: "test",
		},
	];

	const sections = ["description", "activity", "impact", "mission_&_vision", "history_of_dariah"];

	return (
		<Main className="container flex flex-1 flex-col gap-8 px-8 py-12 xs:px-16">
			<Typography className="text-[45px] font-light" variant="h2">
				{t("title")}
			</Typography>
			<div className="py-12 px-40 flex-col flex justify-between lg:flex-row">
				<SectionPanel activeSection="description" sections={sections} />
				{"content"}
				{links.length > 0 && <QuickLinks links={links} />}
			</div>
		</Main>
	);
}
