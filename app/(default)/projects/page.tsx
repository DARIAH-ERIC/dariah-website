import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ProjectTabs } from "@/components/pages/projects/project-tabs";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";

interface ProjectsPageProps extends PageProps<"/projects"> {}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("ProjectsPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function ProjectsPage(props: Readonly<ProjectsPageProps>): Promise<ReactNode> {
	const { searchParams } = props;
	const { status = "active" } = await searchParams;
	const t = await getTranslations("ProjectsPage");

	const parsedStatus = status.toString() as "active" | "inactive" | undefined;

	const response = await client.projects.list({
		status: parsedStatus,
	});
	const breadcrumbs = navigation().breadcrumbs.projects;

	const { data: items } = response.data;

	return (
		<Main className="container flex flex-1 flex-col gap-8">
			<div className="flex flex-col gap-9.25 px-4 py-8 lg:px-31">
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
				<div className="flex flex-col gap-12.25 lg:px-12.25">
					<Typography className="text-[45px] font-light" variant="h2">
						{t("title")}
					</Typography>
					<div className="flex flex-col items-center gap-23.5 justify-between lg:flex-row">
						<Typography className="text-[22px] lg:max-w-[50%]" variant="regular">
							{t("description.part1")}
						</Typography>
						<Typography className="text-[22px] lg:max-w-[50%]" variant="regular">
							{t("description.part2")}
						</Typography>
					</div>
				</div>
			</div>
			<ProjectTabs items={items} status={parsedStatus} />
		</Main>
	);
}
