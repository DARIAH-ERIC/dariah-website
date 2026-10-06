import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { ContentBlocks } from "#/components/content-blocks.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { getPageBySlug } from "#/lib/data/pages.ts";
import { href } from "#/lib/navigation/href.ts";

interface FundingCallsLayoutProps extends LayoutProps<"/get-involved/funding-calls"> {}

/**
 * The first page of the funding calls is at `/get-involved/funding-calls`, each later one at
 * `/get-involved/funding-calls/page/<n>`, so every page is prerendered whole and has a single url (see
 * `lib/navigation/page-segment.ts`). The header and the content are shared, here.
 */
export default async function FundingCallsLayout(props: Readonly<FundingCallsLayoutProps>): Promise<ReactNode> {
	const { children } = props;

	const page = await getPageBySlug("funding-calls");

	if (page == null) {
		notFound();
	}

	return (
		<Main className="px-main pbe-24">
			<PageHeader current={href({ pathname: "/get-involved/funding-calls" })} image={null} title={page.title} />
			<ContentBlocks
				blocks={page.content}
				className="gap-x-gutter lg:columns-2 [&_.prose]:text-lead [&_.prose]:font-regular [&_.prose]:leading-body [&_.prose_p]:break-inside-avoid"
			/>
			<div className="mbs-16">{children}</div>
		</Main>
	);
}
