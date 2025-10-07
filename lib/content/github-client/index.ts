import "server-only";

import { assert, createUrl } from "@acdh-oeaw/lib";
import { createGitHubReader } from "@keystatic/core/reader/github";
import { cache } from "react";

import { client } from "@/lib/content/client";
import type { Documentation } from "@/lib/content/client/documentation";
import type { IndexPage } from "@/lib/content/client/index-page";
import { config } from "@/lib/content/keystatic/config";
import { evaluate, type EvaluateOptions } from "@/lib/content/mdx/evaluate";
import {
	createCustomHeadingIdsPlugin,
	createHeadingIdsPlugin,
	createIframeTitlesPlugin,
	createMermaidDiagramsPlugin,
	createRemoteImageUrlsPlugin,
	createSyntaxHighlighterPlugin,
	createTableOfContentsPlugin,
	createUnwrappedMdxFlowContentPlugin,
} from "@/lib/content/mdx/rehype-plugins";
import {
	createFootnotesPlugin,
	createGitHubMarkdownPlugin,
	createTypographicQuotesPlugin,
} from "@/lib/content/mdx/remark-plugins";
import { createRemarkRehypeOptions } from "@/lib/content/mdx/remark-rehype-options";
import { defaultLocale, getIntlLanguage } from "@/lib/i18n/locales";

const locale = defaultLocale;

const createEvaluateOptions = (baseUrl: string) => {
	return {
		remarkPlugins: [
			createGitHubMarkdownPlugin(),
			createFootnotesPlugin(),
			createTypographicQuotesPlugin(getIntlLanguage(locale)),
		],
		remarkRehypeOptions: createRemarkRehypeOptions(locale),
		rehypePlugins: [
			createCustomHeadingIdsPlugin(),
			createHeadingIdsPlugin(),
			createIframeTitlesPlugin(["Embed", "Video"]),
			createMermaidDiagramsPlugin(),
			createSyntaxHighlighterPlugin(),
			createTableOfContentsPlugin(),
			createUnwrappedMdxFlowContentPlugin(["LinkButton"]),
			createRemoteImageUrlsPlugin(baseUrl, ["Figure", "VideoCard"]),
		],
	} satisfies EvaluateOptions;
};

export const createGitHubClient = cache(function createGitHubClient({
	owner,
	repo,
	branch,
	token,
}: {
	owner: string;
	repo: string;
	branch: string;
	token: string;
}) {
	const reader = createGitHubReader(config, {
		repo: `${owner}/${repo}`,
		ref: branch,
		token,
	});

	const baseUrl = "https://raw.githubusercontent.com";
	const basePath = `/${owner}/${repo}/refs/heads/${branch}`;

	const createGitHubUrl = function createGitHubUrl(src: string) {
		assert(src.startsWith("/"), "Only images in the public folder are supported.");

		const filePath = `/public${src}`;

		return String(createUrl({ baseUrl, pathname: basePath + filePath }));
	};

	const evaluateOptions = createEvaluateOptions(String(createUrl({ baseUrl, pathname: basePath })));

	const indexPage = {
		async get(): Promise<IndexPage> {
			const data = await reader.singletons["en:index-page"].readOrThrow({
				resolveLinkedFiles: true,
			});

			const image = createGitHubUrl(data.image);

			return {
				...data,
				image,
			};
		},
	};

	const documentation = {
		async get(id: string): Promise<Documentation | null> {
			const data = await reader.collections["en:documentation"].read(id, {
				resolveLinkedFiles: true,
			});

			if (data == null) {
				return null;
			}

			const { content, ...metadata } = data;

			const href = `/documentation/${id}`;
			const { default: component, tableOfContents } = await evaluate(content, evaluateOptions);

			return {
				id,
				content: component,
				href,
				metadata,
				tableOfContents,
			};
		},
	};

	return {
		collections: {
			documentation,
		},
		singletons: {
			indexPage,
		},
	};
});
