import type { Metadata } from "next";
import { useExtracted as useTranslations } from "next-intl";
import { getFormatter, getExtracted as getTranslations } from "next-intl/server";
import { connection } from "next/server";
import { type ReactNode, Suspense } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { VisitsChart, VisitsChartSkeleton } from "#/app/(app)/(default)/analytics/_components/visits-chart.tsx";
import { PageHeader } from "#/components/page-header.tsx";
import { Skeleton, SkeletonShape } from "#/components/ui/skeleton.tsx";
import { analyticsMonths, getMonthlyVisits } from "#/lib/data/analytics.ts";
import { createMetadata } from "#/lib/metadata.ts";
import { href } from "#/lib/navigation/href.ts";

interface AnalyticsPageProps extends PageProps<"/analytics"> {}

/** Not linked from anywhere, nor indexed: a url to hand to stakeholders, who need no matomo account to look it up. */
export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations();

	return createMetadata({
		href: href({ pathname: "/analytics" }),
		title: t("Analytics"),
		description: t("Visits to the DARIAH-EU website per month."),
		noindex: true,
	});
}

export default function AnalyticsPage(_props: Readonly<AnalyticsPageProps>): ReactNode {
	const t = useTranslations();

	return (
		<Main className="px-main pbe-24">
			<PageHeader current={href({ pathname: "/analytics" })} image={null} title={t("Analytics")} />
			<div className="max-inline-title">
				<p className="text-lead font-regular text-text-weak">
					{t("Visits to the DARIAH-EU website over the past {count} months, as counted by Matomo.", {
						count: String(analyticsMonths),
					})}
				</p>
				<Suspense fallback={<AnalyticsSkeleton />}>
					<Analytics />
				</Suspense>
			</div>
		</Main>
	);
}

function toDate(month: string): Date {
	const [year = 0, monthIndex = 1] = month.split("-").map(Number);

	return new Date(Date.UTC(year, monthIndex - 1, 1));
}

async function Analytics(): Promise<ReactNode> {
	await connection();

	const t = await getTranslations();
	const format = await getFormatter();
	const months = await getMonthlyVisits();

	if (months == null) {
		return <p className="mbs-12">{t("Analytics are not configured for this website.")}</p>;
	}

	/** Months are formatted in utc, since they are calendar months, not instants. */
	function formatMonth(month: string): string {
		return format.dateTime(toDate(month), { month: "long", year: "numeric", timeZone: "UTC" });
	}

	const hasUniqueVisitors = months.some((month) => month.uniqueVisitors != null);
	/** The last month is the current one, still in progress, so the figures are for the one before. */
	const current = months.at(-1);
	const latest = months.at(-2);
	const previous = months.at(-3);

	function formatChange(value: number | null | undefined, previousValue: number | null | undefined): string | null {
		if (value == null || previousValue == null || previousValue === 0 || previous == null) {
			return null;
		}

		return t("{change} compared with {month}", {
			change: format.number(value / previousValue - 1, {
				style: "percent",
				signDisplay: "exceptZero",
				maximumFractionDigits: 0,
			}),
			month: formatMonth(previous.month),
		});
	}

	return (
		<div className="flex flex-col gap-y-16 mbs-12">
			{latest != null ? (
				<dl className="grid gap-6 sm:grid-cols-2">
					<Figure
						change={formatChange(latest.visits, previous?.visits)}
						label={t("Visits in {month}", { month: formatMonth(latest.month) })}
						value={format.number(latest.visits)}
					/>
					{hasUniqueVisitors && latest.uniqueVisitors != null ? (
						<Figure
							change={formatChange(latest.uniqueVisitors, previous?.uniqueVisitors)}
							label={t("Unique visitors in {month}", { month: formatMonth(latest.month) })}
							value={format.number(latest.uniqueVisitors)}
						/>
					) : null}
				</dl>
			) : null}

			<section aria-labelledby="analytics-per-month" className="flex flex-col gap-y-8">
				<h2 className="text-title-2" id="analytics-per-month">
					{t("Per month")}
				</h2>
				<VisitsChart hasUniqueVisitors={hasUniqueVisitors} months={months} />
				<div className="overflow-x-auto">
					<table className="inline-full text-start">
						<caption className="text-start text-small text-text-weak caption-bottom pbs-3">
							{current != null ? t("{month} is still in progress.", { month: formatMonth(current.month) }) : null}
						</caption>
						<thead>
							<tr className="border-be-2 border-stroke-strong">
								<th className="py-3 pe-6 text-start" scope="col">
									{t("Month")}
								</th>
								<th className="py-3 ps-6 text-end" scope="col">
									{t("Visits")}
								</th>
								{hasUniqueVisitors ? (
									<th className="py-3 ps-6 text-end" scope="col">
										{t("Unique visitors")}
									</th>
								) : null}
							</tr>
						</thead>
						<tbody>
							{months.toReversed().map((month) => (
								<tr key={month.month} className="border-be border-stroke-weak">
									<th className="py-3 pe-6 text-start font-regular" scope="row">
										{month === current
											? t("{month} (in progress)", { month: formatMonth(month.month) })
											: formatMonth(month.month)}
									</th>
									<td className="py-3 ps-6 text-end">{format.number(month.visits)}</td>
									{hasUniqueVisitors ? (
										<td className="py-3 ps-6 text-end">
											{month.uniqueVisitors != null ? format.number(month.uniqueVisitors) : t("n/a")}
										</td>
									) : null}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			<section aria-labelledby="analytics-about" className="flex flex-col gap-y-4">
				<h2 className="text-title-4" id="analytics-about">
					{t("About these numbers")}
				</h2>
				<p>
					{t(
						"A visit is a series of page views without a break of more than 30 minutes. The website does not set cookies, so a visitor is recognised by their browser and network for one day at most: someone who returns on another day is counted as another unique visitor. Unique visitors per month are therefore an upper bound.",
					)}
				</p>
				<p>{t("The numbers are updated hourly.")}</p>
			</section>
		</div>
	);
}

interface FigureProps {
	label: string;
	value: string;
	change: string | null;
}

/** A headline figure: proportional digits, since it stands alone rather than in a column. */
function Figure(props: Readonly<FigureProps>): ReactNode {
	const { label, value, change } = props;

	return (
		<div className="flex flex-col gap-y-2 bg-background-muted p-8">
			<dt className="text-caption text-text-weak">{label}</dt>
			<dd className="order-first font-heading text-display font-bold">{value}</dd>
			{change != null ? <dd className="text-small text-text-weak">{change}</dd> : null}
		</div>
	);
}

function AnalyticsSkeleton(): ReactNode {
	const t = useTranslations();

	return (
		<Skeleton className="flex flex-col gap-y-16 mbs-12" label={t("Loading analytics…")}>
			<div className="grid gap-6 sm:grid-cols-2">
				<SkeletonShape className="block-44" />
				<SkeletonShape className="block-44" />
			</div>
			<VisitsChartSkeleton />
		</Skeleton>
	);
}
