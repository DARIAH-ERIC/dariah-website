import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { Main } from "@/app/(default)/_components/main";
import { SearchContainer } from "@/components/pages/resources/search/search-container";
import { navigation } from "@/lib/data/client";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("SearchPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default function ContactPage(): ReactNode {
	const breadcrumbs = navigation().breadcrumbs.search;

	return (
		<Main className="container relative flex flex-col gap-16 items-end">
			<Suspense>
				<SearchContainer breadcrumbs={breadcrumbs} />
			</Suspense>
		</Main>
	);
}
