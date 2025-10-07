import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { client } from "@/lib/content/client";
import { createGitHubClient } from "@/lib/content/github-client";
import { getPreviewMode } from "@/lib/content/github-client/get-preview-mode";

export function generateMetadata(): Metadata {
	const metadata: Metadata = {
		/**
		 * Fall back to `title.default` from `layout.tsx`.
		 *
		 * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title}
		 */
		// title: undefined,
	};

	return metadata;
}

export default async function IndexPage(): Promise<ReactNode> {
	const t = await getTranslations("IndexPage");

	const preview = await getPreviewMode();

	const page =
		preview.status === "enabled"
			? await createGitHubClient(preview).singletons.indexPage.get()
			: client.singletons.indexPage.get();

	return (
		<div className="mx-auto w-full max-w-(--breakpoint-2xl) px-6">
			<h1>{t("title")}</h1>
			<pre>{JSON.stringify(page)}</pre>
		</div>
	);
}
