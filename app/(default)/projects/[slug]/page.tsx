import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { client } from "@/lib/data/client";

interface ProjectPageProps extends PageProps<"/projects/[slug]"> {}

export async function generateStaticParams(): Promise<
	Array<Pick<Awaited<ProjectPageProps["params"]>, "slug">>
> {
	const slugs = await client.projects.slugs();

	return slugs.map((slug) => {
		return { slug };
	});
}

export async function generateMetadata(props: Readonly<ProjectPageProps>): Promise<Metadata> {
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const data = await client.projects.read(slug);

	if (data == null) {
		notFound();
	}

	const { item } = data;
	const { name: title } = item;

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

	const data = await client.projects.read(slug);

	if (data == null) {
		notFound();
	}

	const { item } = data;
	const { name } = item;

	return (
		<Main className="container flex flex-1 flex-col gap-8 px-8 py-12 xs:px-16">
			<h1 className="text-2xl font-extrabold tracking-tight">{name}</h1>
		</Main>
	);
}
