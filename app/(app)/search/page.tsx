import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Search } from "@/app/(app)/_components/search/search";
import { MainContent } from "@/components/main-content";
import { defaultLocale } from "@/lib/i18n/locales";
import { createSingletonResource } from "@/lib/keystatic/resources";

export async function generateMetadata(): Promise<Metadata> {
	const page = await createSingletonResource("search", defaultLocale).read();

	const { title } = page.data;

	const metadata: Metadata = {
		title,
	};

	return metadata;
}

export default async function SearchPage(): Promise<ReactNode> {
	const page = await createSingletonResource("search", defaultLocale).read();

	const { title, lead } = page.data;

	return (
		<MainContent>
			<h1 className="text-h1 text-balance">{title}</h1>
			<p>{lead}</p>

			<section className="py-16 xs:py-24">
				<Search />
			</section>
		</MainContent>
	);
}
