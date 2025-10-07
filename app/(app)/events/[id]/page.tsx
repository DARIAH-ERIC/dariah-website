import type { Metadata } from "next";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { env } from "@/config/env.config";
import { defaultLocale } from "@/lib/i18n/locales";
import { createCollectionResource } from "@/lib/keystatic/resources";

interface EventPageProps {
	params: {
		id: string;
	};
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<Pick<EventPageProps["params"], "id">>> {
	const ids = await createCollectionResource("events", defaultLocale).list();

	return ids.map((id) => {
		/** @see https://github.com/vercel/next.js/issues/63002 */
		return { id: env.NODE_ENV === "production" ? id : encodeURIComponent(id) };
	});
}

export async function generateMetadata(props: Readonly<EventPageProps>): Promise<Metadata> {
	const { params } = props;

	const id = decodeURIComponent(params.id);

	const entry = await createCollectionResource("events", defaultLocale).read(id);

	const { title } = entry.data;

	const metadata: Metadata = {
		title,
	};

	return metadata;
}

export default async function EventPage(props: Readonly<EventPageProps>): Promise<ReactNode> {
	const { params } = props;

	const id = decodeURIComponent(params.id);

	const entry = await createCollectionResource("events", defaultLocale).read(id);

	return (
		<MainContent>
			<pre>{JSON.stringify(entry.data, null, 2)}</pre>
		</MainContent>
	);
}
