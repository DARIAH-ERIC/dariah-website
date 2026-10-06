import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { ContentBlocks } from "#/components/content-blocks.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { getPageBySlug } from "#/lib/data/pages.ts";
import { href } from "#/lib/navigation/href.ts";

interface ImpactCaseStudiesLayoutProps extends LayoutProps<"/about/impact-case-studies"> {}

/**
 * The first page of the case studies is at `/about/impact-case-studies`, each later one at
 * `/about/impact-case-studies/page/<n>`, so every page is prerendered whole and has a single url (see
 * `lib/navigation/page-segment.ts`). The header and the content are shared, here.
 *
 * The page's content flows in two columns from `lg` up, set larger than a content page's body text, as an introduction
 * to the case studies below rather than a text to read at length. A paragraph is never split across the columns.
 */
export default async function ImpactCaseStudiesLayout(
	props: Readonly<ImpactCaseStudiesLayoutProps>,
): Promise<ReactNode> {
	const { children } = props;

	const page = await getPageBySlug("impact-case-studies");

	if (page == null) {
		notFound();
	}

	return (
		<Main className="px-main pbe-24">
			<PageHeader current={href({ pathname: "/about/impact-case-studies" })} image={page.image} title={page.title} />
			<ContentBlocks
				blocks={page.content}
				className="gap-x-gutter lg:columns-2 [&_.prose]:text-lead [&_.prose]:font-regular [&_.prose]:leading-body [&_.prose_p]:break-inside-avoid"
			/>
			{children}
		</Main>
	);
}
