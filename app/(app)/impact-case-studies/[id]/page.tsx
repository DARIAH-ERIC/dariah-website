import type { Metadata, ResolvingMetadata } from "next";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { env } from "@/config/env.config";
import { defaultLocale } from "@/lib/i18n/locales";
import { createCollectionResource } from "@/lib/keystatic/resources";

interface ImpactCaseStudyPageProps {
	params: {
		id: string;
	};
}

export const dynamicParams = false;

export async function generateStaticParams(_props: {
	params: ImpactCaseStudyPageProps["params"];
}): Promise<Awaited<Array<Pick<ImpactCaseStudyPageProps["params"], "id">>>> {
	const ids = await createCollectionResource("impact-case-studies", defaultLocale).list();

	return ids.map((id) => {
		/** @see https://github.com/vercel/next.js/issues/63002 */
		return { id: env.NODE_ENV === "production" ? id : encodeURIComponent(id) };
	});
}

export async function generateMetadata(
	props: Readonly<ImpactCaseStudyPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const id = decodeURIComponent(params.id);

	const impactCaseStudyItem = await createCollectionResource(
		"impact-case-studies",
		defaultLocale,
	).read(id);

	const metadata: Metadata = {
		title: impactCaseStudyItem.data.title,
	};

	return metadata;
}

export default async function ImpactCaseStudyPage(
	props: Readonly<ImpactCaseStudyPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const id = decodeURIComponent(params.id);

	const impactCaseStudyItem = await createCollectionResource(
		"impact-case-studies",
		defaultLocale,
	).read(id);
	const { default: Content } = await impactCaseStudyItem.compile(impactCaseStudyItem.data.content);

	return (
		<MainContent className="layout-grid content-start">
			<section className="layout-subgrid relative bg-fill-weaker py-16 xs:py-24">
				<h1>{impactCaseStudyItem.data.title}</h1>
				<Content />
			</section>
		</MainContent>
	);
}
