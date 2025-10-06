import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { env } from "@/config/env.config";
import { defaultLocale } from "@/lib/i18n/locales";
import { createCollectionResource } from "@/lib/keystatic/resources";

interface ContentPageProps {
	params: {
		id: string;
	};
}

export const dynamicParams = false;

export async function generateStaticParams(_props: {
	params: ContentPageProps["params"];
}): Promise<Awaited<Array<Pick<ContentPageProps["params"], "id">>>> {
	const ids = await createCollectionResource("pages", defaultLocale).list();

	return ids.map((id) => {
		/** @see https://github.com/vercel/next.js/issues/63002 */
		return { id: env.NODE_ENV === "production" ? id : encodeURIComponent(id) };
	});
}

export async function generateMetadata(
	props: Readonly<ContentPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const id = decodeURIComponent(params.id);

	const metadata: Metadata = {};

	try {
		const page = await createCollectionResource("pages", defaultLocale).read(id);
		metadata.title = page.data.title;
	} catch {
		const t = await getTranslations("NotFoundPage");
		metadata.title = t("meta.title");
	}

	return metadata;
}

export default async function ContentPage(props: Readonly<ContentPageProps>): Promise<ReactNode> {
	const { params } = props;

	const id = decodeURIComponent(params.id);

	try {
		const page = await createCollectionResource("pages", defaultLocale).read(id);

		const { default: Content } = await page.compile(page.data.content);

		return (
			<MainContent className="layout-grid content-start">
				<section className="layout-subgrid prose relative py-16 xs:py-24">
					<h1 className="text-balance font-heading text-heading-1 font-strong text-neutral-900">
						{page.data.title}
					</h1>
					<Content />
				</section>
			</MainContent>
		);
	} catch {
		notFound();
	}
}
