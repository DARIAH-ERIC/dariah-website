import type { Metadata, ResolvingMetadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { env } from "@/config/env.config";
import type { Locale } from "@/config/i18n.config";
import { createCollectionResource } from "@/lib/keystatic/resources";

interface DocumentOrPolicyPageProps {
	params: {
		id: string;
		locale: Locale;
	};
}

export const dynamicParams = false;

export async function generateStaticParams(props: {
	params: Pick<DocumentOrPolicyPageProps["params"], "locale">;
}): Promise<Awaited<Array<Pick<DocumentOrPolicyPageProps["params"], "id">>>> {
	const { params } = props;

	const { locale } = params;

	const ids = await createCollectionResource("documents-and-policies", locale).list();

	return ids.map((id) => {
		/** @see https://github.com/vercel/next.js/issues/63002 */
		return { id: env.NODE_ENV === "production" ? id : encodeURIComponent(id) };
	});
}

export async function generateMetadata(
	props: Readonly<DocumentOrPolicyPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const id = decodeURIComponent(params.id);

	const documentOrPolicyItem = await createCollectionResource(
		"documents-and-policies",
		locale,
	).read(id);

	const metadata: Metadata = {
		title: documentOrPolicyItem.data.title,
	};

	return metadata;
}

export default async function DocumentOrPolicyPage(
	props: Readonly<DocumentOrPolicyPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { locale } = params;
	const id = decodeURIComponent(params.id);

	setRequestLocale(locale);

	const documentOrPolicyItem = await createCollectionResource(
		"documents-and-policies",
		locale,
	).read(id);
	const { default: Content } = await documentOrPolicyItem.compile(
		documentOrPolicyItem.data.content,
	);

	return (
		<MainContent className="layout-grid content-start">
			<section className="layout-subgrid relative bg-fill-weaker py-16 xs:py-24">
				<h1>{documentOrPolicyItem.data.title}</h1>
				<Content />
			</section>
		</MainContent>
	);
}
