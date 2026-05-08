import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { FundingCallCard } from "@/components/ui/funding-call-card/funding-call-card";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { ChevronUpIcon } from "@/components/ui/icons/chevron-up";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import { sortFundingCalls } from "@/utils/funding-call-page.utils";

interface FundingCallsSearchParams {
	status?: "closed";
}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("FundingCallsPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function FundingCalls({
	searchParams,
}: Readonly<{
	searchParams: Promise<FundingCallsSearchParams>;
}>): Promise<ReactNode> {
	const params = await searchParams;
	const { status } = params;
	const t = await getTranslations("FundingCallsPage");

	const response = await client.fundingCalls.list({
		limit: 100,
		status: ["open", "upcoming"],
	});

	const closedResponse =
		status === "closed"
			? await client.fundingCalls.list({
					limit: 100,
					status: ["closed"],
				})
			: undefined;
	const breadcrumbs = navigation().breadcrumbs.fundingCalls;

	const shouldDisplayClosedFundingCalls = status === "closed";

	const { data: activeFundingCalls } = response.data;
	const { data: closedFundingCalls } = closedResponse?.data ?? {};

	const sortedActiveFundingCalls = sortFundingCalls(activeFundingCalls);
	const sortedClosedFundingCalls =
		closedFundingCalls !== undefined ? sortFundingCalls(closedFundingCalls) : undefined;

	return (
		<Main className="flex flex-1 flex-col gap-8 container py-8">
			<div className="flex flex-col gap-12 px-4 xl:px-32.5">
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
				<Typography className="w-full xl:px-13" variant="h2">
					{t("title")}
				</Typography>
			</div>
			<div className="flex flex-col gap-12 px-36 pt-4 pb-14">
				{sortedActiveFundingCalls.map((fundingCall, index) => {
					const {
						id,
						title,
						entity: { slug },
						duration: { start: startDate, end: endDate },
					} = fundingCall;

					return (
						<FundingCallCard
							key={id}
							endDate={endDate}
							index={index}
							slug={slug}
							startDate={startDate}
							title={title}
						/>
					);
				})}
				<hr className="w-full h-0.5 border-t-2 border-gray-400" />
				{shouldDisplayClosedFundingCalls && (
					<>
						{sortedClosedFundingCalls && sortedClosedFundingCalls.length > 0 ? (
							sortedClosedFundingCalls.map((fundingCall, index) => {
								const {
									id,
									title,
									entity: { slug },
									duration: { start: startDate, end: endDate },
								} = fundingCall;

								return (
									<FundingCallCard
										key={id}
										endDate={endDate}
										index={index}
										slug={slug}
										startDate={startDate}
										title={title}
									/>
								);
							})
						) : (
							<Typography className="w-full text-center" variant="regular">
								{t("emptyClosedCalls")}
							</Typography>
						)}
						<Link
							endIcon={<ChevronUpIcon className="size-5" />}
							href="/get-involved/dariah-funding-call"
							variant="primary"
						>
							{t("hidePastCalls")}
						</Link>
					</>
				)}
				{!shouldDisplayClosedFundingCalls && (
					<Link
						endIcon={<ChevronDownIcon className="size-5" />}
						href="/get-involved/dariah-funding-call?status=closed"
						variant="primary"
					>
						{t("seePastCalls")}
					</Link>
				)}
			</div>
		</Main>
	);
}
