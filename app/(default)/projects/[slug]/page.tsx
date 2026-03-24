import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { client } from "@/lib/data/api-client";

interface ProjectPageProps extends PageProps<"/projects/[slug]"> {}

export async function generateStaticParams(): Promise<
	Array<Pick<Awaited<ProjectPageProps["params"]>, "slug">>
> {
	const response = await client.projects.slugs();

	return response.data.data.map((item) => {
		return { slug: item.entity.slug };
	});
}

export async function generateMetadata(props: Readonly<ProjectPageProps>): Promise<Metadata> {
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.projects.bySlug({ slug });

	const { name: title } = response.data;

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function ProjectPage(props: Readonly<ProjectPageProps>): Promise<ReactNode> {
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.projects.bySlug({ slug });

	const { name, image, description } = response.data;

	return (
		<Main className="container flex flex-1 flex-col gap-8 px-8 py-12 xs:px-16">
			<h1 className="text-2xl font-extrabold tracking-tight">{name}</h1>
			{image != null ? <img alt="" src={image.url} /> : null}
			<ContentBlocks fields={description} />
		</Main>
	);
}
