import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { LatestResources } from "#/app/(app)/(default)/resources/_components/latest-resources.tsx";
import logoSshOpenMarketplace from "#/assets/images/logo-sshoc.svg";
import { ContentLayout } from "#/components/content-layout.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { getPageBySlug } from "#/lib/data/pages.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";

interface SshOpenMarketplacePageProps extends PageProps<"/resources/ssh-open-marketplace"> {}

/**
 * Nothing on this page depends on the request, so it is prerendered whole, and `next build` fails if a change makes any
 * of it render per request.
 */
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const page = await getPageBySlug("ssh-open-marketplace");

	if (page == null) {
		return {};
	}

	return createMetadata({
		href: href({ pathname: "/resources/ssh-open-marketplace" }),
		title: page.title,
		description: page.summary,
	});
}

export default async function SshOpenMarketplacePage(
	_props: Readonly<SshOpenMarketplacePageProps>,
): Promise<ReactNode> {
	const page = await getPageBySlug("ssh-open-marketplace");

	if (page == null) {
		notFound();
	}

	return (
		<Main className="px-main">
			<PageHeader
				current={href({ pathname: "/resources/ssh-open-marketplace" })}
				image={null}
				logo={logoSshOpenMarketplace}
				title={page.title}
			/>
			<ContentLayout
				related="quick-links"
				blocks={page.content}
				relatedEntities={page.relatedEntities}
				relatedResources={page.relatedResources}
				tableOfContents={page.showTableOfContents}
			/>
			<LatestResources source="ssh-open-marketplace" upstreamUrl="https://marketplace.sshopencloud.eu/" />
		</Main>
	);
}
