import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { defaultLocale } from "@/lib/i18n/locales";
import { createSingletonResource } from "@/lib/keystatic/resources";

export async function generateMetadata(): Promise<Metadata> {
	const _t = await getTranslations("IndexPage");

	const metadata: Metadata = {
		/**
		 * Fall back to `title.default` from `layout.tsx`.
		 *
		 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title
		 */
		// title: undefined,
	};

	return metadata;
}

export default async function IndexPage(): Promise<ReactNode> {
	const page = await createSingletonResource("index-page", defaultLocale).read();

	const { hero } = page.data;

	return (
		<MainContent>
			<h1>{hero.title}</h1>
			<pre>{JSON.stringify(page.data, null, 2)}</pre>
		</MainContent>
	);
}
