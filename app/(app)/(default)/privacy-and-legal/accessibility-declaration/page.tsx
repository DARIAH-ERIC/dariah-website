import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { ContentLayout } from "#/components/content-layout.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { getPageBySlug } from "#/lib/data/pages.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";

interface AccessibilityDeclarationPageProps extends PageProps<"/privacy-and-legal/accessibility-declaration"> {}

/**
 * Nothing on this page depends on the request, so it is prerendered whole, and `next build` fails if a change makes any
 * of it render per request.
 */
export const ensureStatic = "navigation";

export async function generateMetadata(): Promise<Metadata> {
	const page = await getPageBySlug("accessibility-declaration");

	if (page == null) {
		return {};
	}

	return createMetadata({
		href: href({ pathname: "/privacy-and-legal/accessibility-declaration" }),
		title: page.title,
		description: page.summary,
		image: page.image,
	});
}

export default async function AccessibilityDeclarationPage(
	_props: Readonly<AccessibilityDeclarationPageProps>,
): Promise<ReactNode> {
	const page = await getPageBySlug("accessibility-declaration");

	if (page == null) {
		notFound();
	}

	return (
		<Main className="px-main">
			<PageHeader
				current={href({ pathname: "/privacy-and-legal/accessibility-declaration" })}
				image={page.image}
				title={page.title}
			/>
			<ContentLayout
				related="quick-links"
				blocks={page.content}
				relatedEntities={page.relatedEntities}
				relatedResources={page.relatedResources}
				tableOfContents={page.showTableOfContents}
			/>
		</Main>
	);
}
