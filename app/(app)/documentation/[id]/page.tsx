import { promise } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { env } from "@/config/env.config";
import { defaultLocale } from "@/lib/i18n/locales";
import { createCollectionResource } from "@/lib/keystatic/resources";

interface DocumentationPageProps {
	params: {
		id: string;
	};
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<
	Array<Pick<DocumentationPageProps["params"], "id">>
> {
	const ids = await createCollectionResource("documentation", defaultLocale).list();

	return ids.map((id) => {
		/** @see https://github.com/vercel/next.js/issues/63002 */
		return { id: env.NODE_ENV === "production" ? id : encodeURIComponent(id) };
	});
}

export async function generateMetadata(props: Readonly<DocumentationPageProps>): Promise<Metadata> {
	const { params } = props;

	const id = decodeURIComponent(params.id);

	const { data: page, error } = await promise(() => {
		return createCollectionResource("documentation", defaultLocale).read(id);
	});

	if (error != null) {
		notFound();
	}

	const { title } = page.data;

	const metadata: Metadata = {
		title,
	};

	return metadata;
}

export default async function DocumentationPage(
	props: Readonly<DocumentationPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const id = decodeURIComponent(params.id);

	const { data: page, error } = await promise(() => {
		return createCollectionResource("documentation", defaultLocale).read(id);
	});

	if (error != null) {
		notFound();
	}

	return (
		<MainContent>
			<pre>{JSON.stringify(page.data, null, 2)}</pre>
		</MainContent>
	);
}
