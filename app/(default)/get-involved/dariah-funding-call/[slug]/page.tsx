import type { JSONContent } from "@tiptap/core";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { SectionPanel } from "@/components/pages/static-pages/section-panel";
import { BackToTop } from "@/components/ui/back-to-top/back-to-top";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import { addIdsToContent, getSectionsFromContent } from "@/utils/static-page.utils";

interface FundingCallPageProps extends PageProps<"/get-involved/dariah-funding-call/[slug]"> {}

export async function generateStaticParams(): Promise<
	Array<Pick<Awaited<FundingCallPageProps["params"]>, "slug">>
> {
	const response = await client.fundingCalls.slugs();

	return response.data.data.map((item) => {
		return { slug: item.entity.slug };
	});
}

export async function generateMetadata(props: Readonly<FundingCallPageProps>): Promise<Metadata> {
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);

	const response = await client.fundingCalls.bySlug({ slug });

	const { title } = response.data;

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function FundingCallPage(
	props: Readonly<FundingCallPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { slug: _slug } = await params;
	const slug = decodeURIComponent(_slug);
	const response = await client.fundingCalls.bySlug({ slug });
	const breadcrumbs = navigation().breadcrumbs.fundingCallsDetailPage;

	const {
		data: { title, content },
	} = response;

	if (content.length === 0) return redirect("/");
	const richTextContent = content.find((c) => {
		return c.type === "rich_text";
	});
	const sections = richTextContent
		? getSectionsFromContent(richTextContent.content as JSONContent)
		: [];

	const parsedContent = addIdsToContent(content);

	return (
		<Main className="container flex flex-col mb-16 relative lg:gap-0 lg:mb-0">
			<div className="flex flex-1 flex-col gap-8 px-4 pt-8 lg:px-8 lg:pb-12 xl:px-40">
				{breadcrumbs.length > 0 && (
					<Breadcrumbs>
						{breadcrumbs.map(({ label, href }) => {
							return (
								<Breadcrumb key={label} href={href}>
									{label}
								</Breadcrumb>
							);
						})}
						<Breadcrumb>{slug.replaceAll("-", " ")}</Breadcrumb>
					</Breadcrumbs>
				)}
				<Typography className="text-[45px] font-light" variant="h2">
					{title}
				</Typography>
				<div className="flex-col flex gap-8 justify-between lg:py-12 lg:flex-row lg:gap-21">
					<SectionPanel sections={sections} />
					<div className="max-w-full xl:w-252.5">
						<ContentBlocks fields={parsedContent} />
					</div>
				</div>
			</div>
			<BackToTop />
		</Main>
	);
}
