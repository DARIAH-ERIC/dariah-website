import type { Metadata, ResolvingMetadata } from "next";
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

export async function generateStaticParams(_props: {
	params: DocumentationPageProps["params"];
}): Promise<Awaited<Array<Pick<DocumentationPageProps["params"], "id">>>> {
	const ids = await createCollectionResource("documentation", defaultLocale).list();

	return ids.map((id) => {
		/** @see https://github.com/vercel/next.js/issues/63002 */
		return { id: env.NODE_ENV === "production" ? id : encodeURIComponent(id) };
	});
}

export async function generateMetadata(
	props: Readonly<DocumentationPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const id = decodeURIComponent(params.id);

	const entry = await createCollectionResource("documentation", defaultLocale).read(id);
	const { title } = entry.data;

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

	const entry = await createCollectionResource("documentation", defaultLocale).read(id);
	const { content, lead, title } = entry.data;
	const { default: Content } = await entry.compile(content);

	return (
		<MainContent className="layout-grid content-start">
			<section className="layout-subgrid relative bg-fill-weaker py-16 xs:py-20">
				<div className="max-w-text grid gap-y-4">
					<h1 className="text-balance font-heading text-heading-1 font-strong text-neutral-900">
						{title}
					</h1>
					<p className="font-heading text-small text-neutral-600 xs:text-heading-4">{lead}</p>
				</div>
			</section>

			<section className="layout-subgrid typography content-max-w-text relative border-t border-neutral-200 py-16 xs:py-20">
				<Content />
			</section>
		</MainContent>
	);
}
