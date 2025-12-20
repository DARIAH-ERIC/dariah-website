import type { Metadata } from "next";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { Link } from "@/components/link";
import { client } from "@/lib/data/client";

export function generateMetadata(): Metadata {
	const metadata: Metadata = {
		/**
		 * Fall back to `title.default` from `layout.tsx`.
		 *
		 * @see {@link https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title}
		 */
	};

	return metadata;
}

export default async function IndexPage(): Promise<ReactNode> {
	const { item } = await client.homePage.read();

	const { image, leadIn, sections, title } = item;

	return (
		<Main className="container flex flex-1 flex-col gap-8 px-8 py-12 xs:px-16">
			<section className="relative flex aspect-video w-full flex-col justify-end overflow-hidden rounded-md bg-background-inverse p-6">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					alt=""
					className="absolute inset-0 size-full object-cover opacity-25"
					src={image.url}
				/>
				<div className="relative flex max-w-3xl flex-col gap-2 text-pretty text-text-inverse-strong">
					<h1 className="text-5xl font-extrabold tracking-tight">{title}</h1>
					<div className="text-lg font-medium">{leadIn}</div>
				</div>
			</section>
			<section className="flex flex-col gap-6">
				<h2 className="text-xl">{sections.news.title}</h2>
				<ul className="flex flex-col gap-4" role="list">
					{sections.news.items.map((item) => {
						const { slug, summary, title } = item;

						const href = `/news/${slug}`;

						return (
							<li key={slug}>
								<article className="flex flex-col gap-2">
									<h3>
										<Link href={href}>{title}</Link>
									</h3>
									<div>{summary}</div>
								</article>
							</li>
						);
					})}
				</ul>
			</section>
			<section className="flex flex-col gap-6">
				<h2 className="text-xl">{sections.events.title}</h2>
				<ul className="flex flex-col gap-4" role="list">
					{sections.events.items.map((item) => {
						const { slug, summary, title } = item;

						const href = `/events/${slug}`;

						return (
							<li key={slug}>
								<article className="flex flex-col gap-2">
									<h3>
										<Link href={href}>{title}</Link>
									</h3>
									<div>{summary}</div>
								</article>
							</li>
						);
					})}
				</ul>
			</section>
		</Main>
	);
}
