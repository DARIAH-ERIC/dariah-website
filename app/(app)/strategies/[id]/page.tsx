import type { Metadata } from "next";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { env } from "@/config/env.config";
import { defaultLocale } from "@/lib/i18n/locales";
import { createCollectionResource } from "@/lib/keystatic/resources";

interface StrategyPageProps {
	params: {
		id: string;
	};
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<
	Array<Pick<StrategyPageProps["params"], "id">>
> {
	const ids = await createCollectionResource("strategies", defaultLocale).list();

	return ids.map((id) => {
		/** @see https://github.com/vercel/next.js/issues/63002 */
		return { id: env.NODE_ENV === "production" ? id : encodeURIComponent(id) };
	});
}

export async function generateMetadata(props: Readonly<StrategyPageProps>): Promise<Metadata> {
	const { params } = props;

	const id = decodeURIComponent(params.id);

	const entry = await createCollectionResource("strategies", defaultLocale).read(id);

	const { title } = entry.data;

	const metadata: Metadata = {
		title,
	};

	return metadata;
}

export default async function StrategyPage(props: Readonly<StrategyPageProps>): Promise<ReactNode> {
	const { params } = props;

	const id = decodeURIComponent(params.id);

	const entry = await createCollectionResource("strategies", defaultLocale).read(id);

	return (
		<MainContent>
			<pre>{JSON.stringify(entry.data, null, 2)}</pre>
		</MainContent>
	);
}
