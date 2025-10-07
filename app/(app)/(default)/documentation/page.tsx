import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { client } from "@/lib/content/client";
import { createGitHubClient } from "@/lib/content/github-client";
import { getPreviewMode } from "@/lib/content/github-client/get-preview-mode";

interface DocumentationPageProps extends PageProps<"/documentation/[id]"> {}

export function generateStaticParams(): Array<
	Pick<Awaited<DocumentationPageProps["params"]>, "id">
> {
	const ids = client.collections.documentation.ids();

	return ids.map((id) => {
		return { id };
	});
}

export async function generateMetadata(props: Readonly<DocumentationPageProps>): Promise<Metadata> {
	const { params } = props;

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const preview = await getPreviewMode();

	const page =
		preview.status === "enabled"
			? await createGitHubClient(preview).collections.documentation.get(id)
			: client.collections.documentation.get(id);

	if (page == null) {
		notFound();
	}

	const { title } = page.metadata;

	const metadata: Metadata = {
		title,
	};

	return metadata;
}

export default async function DocumentationPage(
	props: Readonly<DocumentationPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	// const t = await getTranslations("DocumentationPage");

	const { id: _id } = await params;
	const id = decodeURIComponent(_id);

	const preview = await getPreviewMode();

	const page =
		preview.status === "enabled"
			? await createGitHubClient(preview).collections.documentation.get(id)
			: client.collections.documentation.get(id);

	if (page == null) {
		notFound();
	}

	const { lead, title } = page.metadata;
	const Content = page.content;
	const tableOfContents = page.tableOfContents ?? [];

	const docs = client.collections.documentation.all();

	return (
		<div className="mx-auto w-full max-w-(--breakpoint-2xl) px-6">
			<h1>{title}</h1>
		</div>
	);
}
