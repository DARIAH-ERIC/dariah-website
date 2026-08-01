import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ProjectTabs } from "@/components/pages/projects/project-tabs";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { ListDescription } from "@/components/ui/list-description/list-description";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import { createOpenGraphMetadata } from "@/lib/metadata/open-graph";

interface ProjectsPageProps extends PageProps<"/projects"> {}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("ProjectsPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		openGraph: await createOpenGraphMetadata({ title }),
	};

	return metadata;
}

export default async function ProjectsPage(props: Readonly<ProjectsPageProps>): Promise<ReactNode> {
	const { searchParams } = props;
	const { status = "active" } = await searchParams;

	const parsedStatus =
		status.toString() === "past"
			? "inactive"
			: (status.toString() as "active" | "inactive" | undefined);

	const response = await client.projects.list({
		status: parsedStatus,
		limit: 50,
	});
	const staticContentResponse = await client.pages.bySlug({ slug: "projects" });
	const breadcrumbs = navigation().breadcrumbs.projects;

	const { data: items } = response.data;

	const {
		data: { content, title },
	} = staticContentResponse;

	return (
		<Main className="container flex flex-1 flex-col gap-8">
			<div className="flex flex-col gap-9.25 px-4 py-8 xl:px-12 2xl:px-31">
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
				<ListDescription content={content} title={title} />
			</div>
			<ProjectTabs items={items} status={parsedStatus} />
		</Main>
	);
}
