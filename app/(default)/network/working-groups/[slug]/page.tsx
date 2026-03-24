import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { client } from "@/lib/data/api-client";

interface WorkingGroupPageProps extends PageProps<"/network/working-groups/[slug]"> {}

export async function generateStaticParams(): Promise<
	Array<Pick<Awaited<WorkingGroupPageProps["params"]>, "slug">>
> {
	const response = await client.workingGroups.slugs();

	return response.data.data.map((item) => {
		return { slug: item.entity.slug };
	});
}

export async function generateMetadata(props: Readonly<WorkingGroupPageProps>): Promise<Metadata> {
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.workingGroups.bySlug({ slug });

	const { name } = response.data;

	const metadata: Metadata = {
		title: name,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function WorkingGroupPage(
	props: Readonly<WorkingGroupPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.workingGroups.bySlug({ slug });

	const { name, image, description } = response.data;

	return (
		<Main className="container flex flex-1 flex-col gap-8 px-8 py-12 xs:px-16">
			<h1 className="text-2xl font-extrabold tracking-tight">{name}</h1>
			{image != null ? <img alt="" src={image.url} /> : null}
			<ContentBlocks fields={description} />
		</Main>
	);
}
