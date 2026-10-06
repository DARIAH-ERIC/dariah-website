import { useExtracted as useTranslations } from "next-intl";
import { getExtracted as getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { type ReactNode, Suspense, useId } from "react";

import { Pagination } from "#/app/(app)/(default)/_components/pagination.tsx";
import logo from "#/assets/images/logo-dariah-eu.svg";
import { ApiImage } from "#/components/api-image.tsx";
import { DateRange } from "#/components/date-range.tsx";
import { Image } from "#/components/image.tsx";
import { Badge } from "#/components/ui/badge.tsx";
import { Skeleton, SkeletonShape, SkeletonText } from "#/components/ui/skeleton.tsx";
import type { FundingCallBase } from "#/lib/api/schemas.ts";
import { today } from "#/lib/data/events.ts";
import { type FundingCallStatus, getFundingCallStatus, getFundingCallsPage } from "#/lib/data/funding-calls.ts";
import { type Href, href } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

/** The url of a page of the list: the first is the list's own. */
function fundingCallsPageHref(page: number): Href {
	return page === 1
		? href({ pathname: "/get-involved/funding-calls" })
		: href({ pathname: "/get-involved/funding-calls/page/[page]", params: { page: String(page) } });
}

interface FundingCallListProps {
	page: number;
}

/** One page of the funding calls - see `app/(app)/(default)/get-involved/funding-calls/(list)/layout.tsx`. */
export async function FundingCallList(props: Readonly<FundingCallListProps>): Promise<ReactNode> {
	const list = await getFundingCallsPage(props.page);

	if (list == null) {
		notFound();
	}

	return (
		<section>
			<ul className="flex flex-col gap-y-14" role="list">
				{list.items.map((call) => (
					<li key={call.id} className="flex shadow-card">
						<FundingCallCard call={call} />
					</li>
				))}
			</ul>
			{list.pages > 1 ? (
				<Pagination
					className="mbs-16"
					hrefFor={fundingCallsPageHref}
					page={list.page}
					pages={list.pages}
					prefetch={true}
				/>
			) : null}
		</section>
	);
}

/**
 * The same list as `FundingCallList` while a page loads, with a placeholder for each card: a page which was not
 * prerendered, see `app/(app)/(default)/get-involved/funding-calls/(list)/page/[page]/page.tsx`.
 */
export function FundingCallListSkeleton(): ReactNode {
	const t = useTranslations();

	return (
		<Skeleton className="flex flex-col gap-y-14" label={t("Loading funding calls…")}>
			{[0, 1].map((index) => (
				<div key={index} className="flex shadow-card">
					<FundingCallCard call={null} />
				</div>
			))}
		</Skeleton>
	);
}

/**
 * A banner: the DARIAH logo, the title, the call's status (as on an opportunity) and the dates it runs between, on the
 * base background, with the call's image fading in towards the end edge. The text keeps to the start half, where the
 * image is still mostly faded, so it stays legible over any photo. Below `sm` there is no room beside the text, and the
 * image sits above it, unfaded.
 *
 * The title's link stretches over the whole card, so its focus outline is drawn on the card's box. The card draws its
 * edge shadow, its list item the soft one (see `--shadow-card` in `styles/index.css`).
 *
 * Without a call, the card is its own loading skeleton: the same boxes, with the logo, which does not depend on the
 * call, and placeholders for the image, the title and the dates.
 */
function FundingCallCard(props: Readonly<{ call: FundingCallBase | null }>): ReactNode {
	const { call } = props;

	const headingId = useId();

	const Root = call != null ? "article" : "div";

	return (
		<Root
			aria-labelledby={call != null ? headingId : undefined}
			className="group relative flex inline-full flex-col bg-background-base shadow-card-edge sm:min-block-64 sm:justify-center"
		>
			<div className="relative aspect-1200/565 sm:absolute sm:inset-y-0 sm:inset-e-0 sm:inline-3/5 sm:aspect-auto sm:mask-[linear-gradient(to_right,transparent,black_60%)]">
				{call != null ? (
					<ApiImage
						alt=""
						className="object-cover"
						fill={true}
						image={call.image}
						sizes="(min-width: 120rem) 63rem, (min-width: 40rem) 55vw, calc(100vw - 3rem)"
					/>
				) : (
					<SkeletonShape className="absolute inset-0 rounded-none" />
				)}
			</div>
			<div className="z-1 flex flex-col items-start gap-y-5 px-6 py-8 sm:max-inline-1/2 sm:px-13">
				<Image alt="" className="block-16 inline-auto" src={logo} />
				{call != null ? (
					<h2 className="flex flex-col items-start gap-y-2 font-heading text-title-3" id={headingId}>
						<Link
							className="underline-offset-4 outline-none group-hover:underline after:absolute after:inset-0 focus-visible:after:outline-3 focus-visible:after:outline-offset-4 focus-visible:after:outline-focus-outline focus-visible:after:outline-solid"
							href={href({ pathname: "/get-involved/funding-calls/[slug]", params: { slug: call.entity.slug } })}
							prefetch="intent"
						>
							{call.title}
						</Link>
						<Suspense fallback={<SkeletonShape className="text-badge block-[calc(1lh+--spacing(1))] inline-16" />}>
							<FundingCallStatusBadge call={call} />
						</Suspense>
					</h2>
				) : (
					<SkeletonText className="self-stretch font-heading text-title-3" lines={2} />
				)}
				{call != null ? (
					<DateRange className="text-caption" end={call.duration.end} start={call.duration.start} />
				) : (
					<SkeletonText className="inline-48 text-caption" />
				)}
			</div>
		</Root>
	);
}

/**
 * A call's status is relative to today, so it is rendered at request time: the card around it stays in the page's
 * static shell, with a placeholder in the badge's place until the status streams in.
 */
async function FundingCallStatusBadge(props: Readonly<{ call: FundingCallBase }>): Promise<ReactNode> {
	const { call } = props;

	await connection();
	const status = getFundingCallStatus(call, today());

	const t = await getTranslations();

	const labels: Record<FundingCallStatus, string> = {
		upcoming: t("Upcoming"),
		open: t("Open"),
		closed: t("Closed"),
	};

	return <Badge tone={status === "open" ? "highlight" : "muted"}>{labels[status]}</Badge>;
}
