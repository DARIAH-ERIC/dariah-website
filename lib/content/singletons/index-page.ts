import { createCollection } from "@acdh-oeaw/content-lib";
import type { MDXContent } from "mdx/types";
import { VFile } from "vfile";

import { reader } from "@/lib/content/keystatic/reader";
import { compile, type CompileOptions } from "@/lib/content/mdx/compile";
import {
	createGitHubMarkdownPlugin,
	createTypographicQuotesPlugin,
} from "@/lib/content/mdx/remark-plugins";
import { createRemarkRehypeOptions } from "@/lib/content/mdx/remark-rehype-options";
import { getImageDimensions } from "@/lib/content/utils/get-image-dimensions";
import { defaultLocale, getIntlLanguage } from "@/lib/i18n/locales";

const locale = defaultLocale;

const compileOptions: CompileOptions = {
	remarkPlugins: [
		createGitHubMarkdownPlugin(),
		createTypographicQuotesPlugin(getIntlLanguage(locale)),
	],
	remarkRehypeOptions: createRemarkRehypeOptions(locale),
	rehypePlugins: [],
};

export const indexPage = createCollection({
	name: "index-page",
	directory: "./content/en/index-page/",
	include: ["index.json"],
	read() {
		return reader.singletons["en:index-page"].readOrThrow({ resolveLinkedFiles: true });
	},
	async transform(data, item, context) {
		const image = await getImageDimensions(data.image);

		return {
			...data,
			image,
		};
	},
});
