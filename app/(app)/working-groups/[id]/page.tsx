import type { Metadata, ResolvingMetadata } from "next";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { env } from "@/config/env.config";
import { defaultLocale } from "@/lib/i18n/locales";
import { createCollectionResource } from "@/lib/keystatic/resources";

interface WorkingGroupPageProps {
	params: {
		id: string;
	};
}

export const dynamicParams = false;

export async function generateStaticParams(_props: {
	params: WorkingGroupPageProps["params"];
}): Promise<Awaited<Array<Pick<WorkingGroupPageProps["params"], "id">>>> {
	const ids = await createCollectionResource("working-groups", defaultLocale).list();

	return ids.map((id) => {
		/** @see https://github.com/vercel/next.js/issues/63002 */
		return { id: env.NODE_ENV === "production" ? id : encodeURIComponent(id) };
	});
}

export async function generateMetadata(
	props: Readonly<WorkingGroupPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const id = decodeURIComponent(params.id);

	const strategyItem = await createCollectionResource("working-groups", defaultLocale).read(id);

	const metadata: Metadata = {
		title: strategyItem.data.name,
	};

	return metadata;
}

export default async function WorkingGroupPage(
	props: Readonly<WorkingGroupPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const id = decodeURIComponent(params.id);

	const workingGroupItem = await createCollectionResource("working-groups", defaultLocale).read(id);

	return (
		<MainContent className="layout-grid content-start">
			<section className="layout-subgrid relative bg-fill-weaker py-16 xs:py-24">
				<h1 className="text-balance font-heading text-heading-1 font-strong text-neutral-900">
					{workingGroupItem.data.name}
				</h1>
			</section>
		</MainContent>
	);
}
