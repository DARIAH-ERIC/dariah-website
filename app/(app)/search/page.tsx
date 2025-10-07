import type { Metadata, ResolvingMetadata } from "next";
import type { ReactNode } from "react";

import { Search } from "@/app/(app)/_components/search/search";
import { MainContent } from "@/components/main-content";
import { defaultLocale } from "@/lib/i18n/locales";
import { createSingletonResource } from "@/lib/keystatic/resources";

interface SearchPageProps {
	searchParams?: Promise<{
		query?: string;
		page?: string;
	}>;
}
export async function generateMetadata(
	_props: Readonly<SearchPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const search = await createSingletonResource("search", defaultLocale).read();

	const metadata: Metadata = {
		title: search.data.title,
	};

	return metadata;
}

export default async function SearchPage(_props: Readonly<SearchPageProps>): Promise<ReactNode> {
	/*const searchParams = await props.searchParams;
		const query = searchParams?.query || "";
		const currentPage = Number(searchParams?.page) || 1;*/

	const search = await createSingletonResource("search", defaultLocale).read();
	const { title, lead } = search.data;

	return (
		<MainContent className="layout-grid content-start">
			<section className="layout-subgrid relative py-16 xs:py-24">
				<h1 className="text-balance font-heading text-heading-1 font-strong text-neutral-900">
					{title}
				</h1>
				<p>{lead}</p>
				<section className="py-16 xs:py-24">
					<Search />
				</section>
			</section>
		</MainContent>
	);
}
