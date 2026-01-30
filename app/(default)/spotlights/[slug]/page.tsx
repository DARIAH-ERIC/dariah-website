import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { client } from "@/lib/data/api-client";

interface SpotlightArticlePageProps extends PageProps<"/spotlights/[slug]"> {}

// export async function generateStaticParams(): Promise<
// 	Array<Pick<Awaited<SpotlightArticlePageProps["params"]>, "slug">>
// > {
// 	const slugs = await client.spotlightArticles.slugs();

// 	return slugs.map((slug) => {
// 		return { slug };
// 	});
// }

export async function generateMetadata(
	props: Readonly<SpotlightArticlePageProps>,
): Promise<Metadata> {
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.spotlightArticles.bySlug({ slug });

	const { data: item } = response;

	const { title } = item;

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function SpotlightArticlePage(
	props: Readonly<SpotlightArticlePageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.spotlightArticles.bySlug({ slug });

	const { data: item } = response;

	const { title } = item;

	return (
		<Main className="container flex flex-1 flex-col gap-8 px-8 py-12 xs:px-16">
			<h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
		</Main>
	);
}
