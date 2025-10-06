import type { Metadata, ResolvingMetadata } from "next";
import type { ReactNode } from "react";

import { Card } from "@/components/card";
import { MainContent } from "@/components/main-content";
import { defaultLocale } from "@/lib/i18n/locales";
import { createCollectionResource, createSingletonResource } from "@/lib/keystatic/resources";

interface ProjectOverviewPageProps {}

export async function generateMetadata(
	_props: Readonly<ProjectOverviewPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const projectsOverview = await createSingletonResource("projects-overview", defaultLocale).read();

	const metadata: Metadata = {
		title: projectsOverview.data.title,
	};

	return metadata;
}

export default async function ProjectPage(
	_props: Readonly<ProjectOverviewPageProps>,
): Promise<ReactNode> {
	const projectsOverview = await createSingletonResource("projects-overview", defaultLocale).read();
	const projects = await createCollectionResource("projects", defaultLocale).all();

	return (
		<MainContent className="layout-grid content-start">
			<section className="layout-subgrid relative gap-y-12 py-16 xs:py-24">
				<header>
					<h1 className="text-balance font-heading text-heading-1 font-strong text-text-strong">
						{projectsOverview.data.title}
					</h1>
					<p className="mt-6 font-heading text-heading-4 text-text-weak">
						{projectsOverview.data.lead}
					</p>
				</header>
				<ul
					className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-8"
					role="list"
				>
					{projects.map(async (project) => {
						const id = project.id;
						const projectItem = await createCollectionResource("projects", defaultLocale).read(id);
						const link = { label: "", href: `/projects/${id}` };
						return (
							<li key={id}>
								<Card
									className="grid h-full grid-rows-[13rem_auto]"
									discriminent="project"
									{...projectItem.data}
									link={link}
								></Card>
							</li>
						);
					})}
				</ul>
			</section>
		</MainContent>
	);
}
