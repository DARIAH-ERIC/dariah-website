import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { MembersAndPartnersMap } from "#/app/(app)/(default)/network/members-and-partners/_components/members-and-partners-map.tsx";
import { ContentBlocks } from "#/components/content-blocks.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { getMembersAndPartners } from "#/lib/data/members-and-partners.ts";
import { getPageBySlug } from "#/lib/data/pages.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";

interface MembersAndPartnersPageProps extends PageProps<"/network/members-and-partners"> {}

/**
 * Nothing on this page depends on the request, so it is prerendered whole, and `next build` fails if a change makes any
 * of it render per request.
 */
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const page = await getPageBySlug("members-and-partners");

	if (page == null) {
		return {};
	}

	return createMetadata({
		href: href({ pathname: "/network/members-and-partners" }),
		title: page.title,
		description: page.summary,
		image: page.image,
	});
}

/**
 * The page's content is set as on the impact case studies page (see
 * `app/(app)/(default)/about/impact-case-studies/page.tsx`): in two columns from `lg` up, larger than a content page's
 * body text, as an introduction to the map below.
 */
export default async function MembersAndPartnersPage(
	_props: Readonly<MembersAndPartnersPageProps>,
): Promise<ReactNode> {
	const [page, items] = await Promise.all([getPageBySlug("members-and-partners"), getMembersAndPartners()]);

	if (page == null) {
		notFound();
	}

	return (
		<Main className="px-main pbe-24">
			<PageHeader current={href({ pathname: "/network/members-and-partners" })} image={page.image} title={page.title} />
			<ContentBlocks
				blocks={page.content}
				className="gap-x-gutter lg:columns-2 [&_.prose]:text-lead [&_.prose]:font-regular [&_.prose]:leading-body [&_.prose_p]:break-inside-avoid"
			/>
			<div className="mbs-16">
				<MembersAndPartnersMap
					items={items.map((item) => {
						return {
							id: item.id,
							name: item.name,
							slug: item.entity.slug,
							status: item.status,
							institutionsCount: item.institutionsCount,
						};
					})}
				/>
			</div>
		</Main>
	);
}
