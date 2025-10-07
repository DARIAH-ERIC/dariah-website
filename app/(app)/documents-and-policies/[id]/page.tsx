import { promise } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { env } from "@/config/env.config";
import { defaultLocale } from "@/lib/i18n/locales";
import { createCollectionResource } from "@/lib/keystatic/resources";

interface DocumentOrPolicyPageProps {
	params: {
		id: string;
	};
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<
	Array<Pick<DocumentOrPolicyPageProps["params"], "id">>
> {
	const ids = await createCollectionResource("documents-and-policies", defaultLocale).list();

	return ids.map((id) => {
		/** @see https://github.com/vercel/next.js/issues/63002 */
		return { id: env.NODE_ENV === "production" ? id : encodeURIComponent(id) };
	});
}

export async function generateMetadata(
	props: Readonly<DocumentOrPolicyPageProps>,
): Promise<Metadata> {
	const { params } = props;

	const id = decodeURIComponent(params.id);

	const { data: entry, error } = await promise(() => {
		return createCollectionResource("documents-and-policies", defaultLocale).read(id);
	});

	if (error != null) {
		notFound();
	}

	const { title } = entry.data;

	const metadata: Metadata = {
		title: title,
	};

	return metadata;
}

export default async function DocumentOrPolicyPage(
	props: Readonly<DocumentOrPolicyPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const id = decodeURIComponent(params.id);

	const { data: entry, error } = await promise(() => {
		return createCollectionResource("documents-and-policies", defaultLocale).read(id);
	});

	if (error != null) {
		notFound();
	}

	return (
		<MainContent>
			<pre>{JSON.stringify(entry.data, null, 2)}</pre>
		</MainContent>
	);
}
