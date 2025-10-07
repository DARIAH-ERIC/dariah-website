import type { Metadata } from "next";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { defaultLocale } from "@/lib/i18n/locales";
import { createCollectionResource, createSingletonResource } from "@/lib/keystatic/resources";

export async function generateMetadata(): Promise<Metadata> {
	const page = await createSingletonResource(
		"documents-and-policies-overview",
		defaultLocale,
	).read();

	const { title } = page.data;

	const metadata: Metadata = {
		title,
	};

	return metadata;
}

export default async function DocumentAndPoliciesPage(): Promise<ReactNode> {
	const page = await createSingletonResource(
		"documents-and-policies-overview",
		defaultLocale,
	).read();

	const entries = await createCollectionResource("documents-and-policies", defaultLocale).all();

	return (
		<MainContent>
			<pre>{JSON.stringify(page.data, null, 2)}</pre>
			<pre>
				{JSON.stringify(
					entries.map((entry) => {
						return entry.data;
					}),
					null,
					2,
				)}
			</pre>
		</MainContent>
	);
}
