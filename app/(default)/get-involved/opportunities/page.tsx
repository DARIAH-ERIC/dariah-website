import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

import { Main } from "@/app/(default)/_components/main";
import { Image } from "@/components/image";
import { Filters } from "@/components/pages/opportunities/filters";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { OpportunityCard } from "@/components/ui/opportunity-card/opportunity-card";
import { Pagination } from "@/components/ui/pagination/pagination";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";

interface OpportunitiesSearchParams {
	page?: string;
	availability?: "open" | "closed" | "upcoming";
	source?: "dariah" | "external";
}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("Opportunities");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

const DEFAULT_PER_PAGE = 10;

export default async function OpportunitiesPage({
	searchParams,
}: Readonly<{
	searchParams: Promise<OpportunitiesSearchParams>;
}>): Promise<ReactNode> {
	const params = await searchParams;
	const { page = 1, availability, source } = params;
	const t = await getTranslations("Opportunities");

	const response = await client.opportunities.list({
		limit: DEFAULT_PER_PAGE,
		offset: (Number(page) - 1) * DEFAULT_PER_PAGE,
		source: source !== undefined ? [source] : source,
		status: availability !== undefined ? [availability] : availability,
	});
	const breadcrumbs = navigation().breadcrumbs.opportunities;

	const {
		data: { data, total },
	} = response;

	return (
		<Main className="flex flex-1 flex-col gap-8 container py-8">
			{breadcrumbs.length > 0 && (
				<Breadcrumbs className="px-4 xl:px-34.5">
					{breadcrumbs.map(({ label, href }) => {
						return (
							<Breadcrumb key={label} href={href}>
								{label}
							</Breadcrumb>
						);
					})}
				</Breadcrumbs>
			)}
			<div className="flex flex-col px-4 gap-14 lg:px-16 xl:px-32 2xl:px-80">
				<div className="flex flex-col gap-6 items-center">
					<Typography className="w-full" variant="h2">
						{t("title")}
					</Typography>
					<Image
						alt={t("title")}
						className="w-82 h-42.25 object-cover md:w-308 md:h-55.75"
						height={223}
						src={"/assets/images/opportunities-list-image.png"}
						width={1232}
					/>
				</div>
				<div className="flex flex-col gap-14">
					<Filters />
				</div>
				<div className="flex flex-col gap-8 lg:px-25 2xl:px-51">
					<Typography variant="h4">{t("results", { count: data.length })}</Typography>
					{data.length === 0 ? (
						<div className="py-2 flex flex-col gap-6 items-center pb-16">
							<Image
								alt={t("emptyState")}
								height={228}
								src={"/assets/images/no-opportunities.svg"}
								width={220}
							/>
							<Typography variant="regular">{t("emptyState")}</Typography>
						</div>
					) : (
						<div className="flex flex-col gap-8 pb-16 items-center">
							{data.map((opportunity) => {
								const {
									id,
									source: { source: variant },
									title,
									website,
									summary,
									duration: { start: startDate, end: endDate },
								} = opportunity;
								return (
									<OpportunityCard
										key={id}
										endDate={endDate}
										startDate={startDate}
										summary={summary}
										title={title}
										variant={variant}
										website={website}
									/>
								);
							})}
						</div>
					)}
				</div>
			</div>

			{total > 10 && (
				<div className="mb-16 pl-6 bg-pagination-bg w-80.5 max-w-125 h-21 flex items-center ml-auto lg:mb-20 lg:w-125">
					<Suspense>
						<Pagination pageCount={Math.ceil(total / DEFAULT_PER_PAGE)} shouldScroll={true} />
					</Suspense>
				</div>
			)}
		</Main>
	);
}
