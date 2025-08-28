import type { Metadata, ResolvingMetadata } from "next";
import type { ReactNode } from "react";

import { Search } from "@/app/(app)/_components/search/search";
import { MainContent } from "@/components/main-content";
import { defaultLocale } from "@/lib/i18n/locales";
import { createSingletonResource } from "@/lib/keystatic/resources";

interface ResourcesPageProps {
	searchParams?: Promise<{
		query?: string;
		page?: string;
	}>;
}
export async function generateMetadata(
	_props: Readonly<ResourcesPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const resources = await createSingletonResource("resources", defaultLocale).read();

	const metadata: Metadata = {
		title: resources.data.title,
	};

	return metadata;
}

export default async function ResourcesPage(
	_props: Readonly<ResourcesPageProps>,
): Promise<ReactNode> {
	/*const searchParams = await props.searchParams;
		const query = searchParams?.query || "";
		const currentPage = Number(searchParams?.page) || 1;*/

	const resources = await createSingletonResource("resources", defaultLocale).read();
	const { title, lead } = resources.data;

	return (
		<MainContent className="layout-grid content-start">
			<section className="layout-subgrid relative py-16 xs:py-24">
				<h1 className="text-balance font-heading text-heading-1 font-strong text-text-strong">
					{title}
				</h1>
				<p>{lead}</p>
				<section className="py-16 xs:py-24">
					<Search content="resources" />
				</section>
			</section>
		</MainContent>
	);
}
