import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { Organigram } from "#/app/(app)/(default)/about/organisation-and-governance/_components/organigram.tsx";
import { ContentBlocks } from "#/components/content-blocks.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { getGovernanceBodies } from "#/lib/data/governance-bodies.ts";
import { getPageBySlug } from "#/lib/data/pages.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";

interface OrganisationAndGovernancePageProps extends PageProps<"/about/organisation-and-governance"> {}

/**
 * Nothing on this page depends on the request, so it is prerendered whole, and `next build` fails if a change makes any
 * of it render per request.
 */
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const page = await getPageBySlug("organisation-and-governance");

	if (page == null) {
		return {};
	}

	return createMetadata({
		href: href({ pathname: "/about/organisation-and-governance" }),
		title: page.title,
		description: page.summary,
		image: page.image,
	});
}

/**
 * The page's content is set as on the members and partners page (see
 * `app/(app)/(default)/network/members-and-partners/page.tsx`): in two columns from `lg` up, larger than a content
 * page's body text, as an introduction to the organigram below.
 */
export default async function OrganisationAndGovernancePage(
	_props: Readonly<OrganisationAndGovernancePageProps>,
): Promise<ReactNode> {
	const [page, items] = await Promise.all([getPageBySlug("organisation-and-governance"), getGovernanceBodies()]);

	if (page == null) {
		notFound();
	}

	return (
		<Main className="px-main pbe-24">
			<PageHeader
				current={href({ pathname: "/about/organisation-and-governance" })}
				image={page.image}
				title={page.title}
			/>
			<ContentBlocks
				blocks={page.content}
				className="gap-x-gutter lg:columns-2 [&_.prose]:text-lead [&_.prose]:font-regular [&_.prose]:leading-body [&_.prose_p]:break-inside-avoid"
			/>
			<div className="mbs-16">
				<Organigram items={items} />
			</div>
		</Main>
	);
}
