import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { Main } from "@/app/(default)/_components/main";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { CaseStudy } from "@/components/ui/case-study/case-study";
import { Pagination } from "@/components/ui/pagination/pagination";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import { groupCaseStudiesByYear } from "@/utils/case-study-page.utils";

interface ImpactCaseStudiesPageProps extends PageProps<"/about/impact-case-studies"> {}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("ImpactCaseStudiesPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function ImpactCaseStudiesPage(
	props: Readonly<ImpactCaseStudiesPageProps>,
): Promise<ReactNode> {
	const { searchParams } = props;
	const { page = 1, per_page = 12 } = await searchParams;
	const t = await getTranslations("ImpactCaseStudiesPage");

	const response = await client.impactCaseStudies.list({
		limit: Number(per_page),
		offset: (Number(page) - 1) * Number(per_page),
	});
	const breadcrumbs = navigation().breadcrumbs.impactCaseStudy;

	const { data: items, total } = response.data;
	const grouppedItems = groupCaseStudiesByYear(items);

	return (
		<Main className="container flex flex-1 flex-col gap-8">
			<div className="flex flex-col gap-9.25 px-4 pt-8 lg:gap-13.5 lg:px-31">
				{breadcrumbs.length > 0 && (
					<Breadcrumbs>
						{breadcrumbs.map(({ label, href }) => {
							return (
								<Breadcrumb key={label} href={href}>
									{label}
								</Breadcrumb>
							);
						})}
					</Breadcrumbs>
				)}
				<div className="flex flex-col gap-12.25 lg:px-12.25">
					<Typography className="text-[45px] font-light" variant="h2">
						{t("title")}
					</Typography>
					<div className="flex flex-col gap-23.25 justify-between lg:flex-row">
						<Typography className="text-[22px] lg:max-w-[50%]" variant="regular">
							{t("description.part1")}
						</Typography>
						<Typography
							className="text-[22px] whitespace-pre-line lg:max-w-[50%]"
							variant="regular"
						>
							{t("description.part2")}
						</Typography>
					</div>
				</div>
			</div>
			<div className="flex flex-col gap-18.75 pb-11">
				{grouppedItems.map(([year, items]) => {
					return (
						<div key={year} className="flex flex-col gap-10 px-4 lg:px-31">
							<div className="flex gap-2.5 items-end">
								<Typography className="text-[64px] leading-[100%] font-light" variant="h3">
									{year}
								</Typography>
								<Typography className="font-light uppercase" variant="h3">
									{"case studies"}
								</Typography>
							</div>
							<ul className="flex gap-5 flex-wrap justify-center 3xl:justify-start">
								{items.map((item) => {
									const { entity, image, title } = item;
									const { slug } = entity;
									const href = `/about/impact-case-studies/${slug}`;

									return <CaseStudy key={slug} href={href} imageUrl={image.url} title={title} />;
								})}
							</ul>
						</div>
					);
				})}
			</div>
			<div className="mb-16 pl-6 bg-pagination-bg w-80.5 max-w-125 h-21 flex items-center ml-auto lg:mb-20 lg:w-125">
				<Suspense>
					<Pagination pageCount={Math.ceil(total / Number(per_page))} shouldScroll={true} />
				</Suspense>
			</div>
		</Main>
	);
}
