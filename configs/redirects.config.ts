import type { NextConfig } from "next";

import { env } from "#/configs/env.config.ts";

type Redirects = Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>;

/**
 * A documents-policies entry's file, which the api streams by the entry's slug - the url the documents page links to as
 * well.
 */
function documentUrl(slug: string): string {
	return `${env.NEXT_PUBLIC_API_BASE_URL}/api/v1/documents-policies/slugs/${slug}/document`;
}

/** Redirects for urls from the legacy dariah.eu website. */
export const redirects: Redirects = [
	{
		source: "/about/dariah-in-nutshell",
		destination: "/about/dariah-in-a-nutshell",
		permanent: true,
	},
	{ source: "/about/documents-list", destination: "/about/documents", permanent: true },
	{
		source: "/about/history-of-dariah",
		destination: "/about/dariah-in-a-nutshell",
		permanent: true,
	},
	{ source: "/about/join-dariah", destination: "/get-involved/join-dariah", permanent: true },
	{
		source: "/about/mission-vision",
		destination: "/about/dariah-in-a-nutshell",
		permanent: true,
	},
	{
		source: "/activities/dariah-theme",
		destination: "/get-involved/funding-calls",
		permanent: true,
	},
	{
		source: "/activities/impact-case-studies/:path*",
		destination: "/about/impact-case-studies/:path*",
		permanent: true,
	},
	{
		source: "/activities/working-groups-list",
		destination: "/network/working-groups",
		permanent: true,
	},
	{
		source: "/activities/working-groups/:path*",
		destination: "/network/working-groups/:path*",
		permanent: true,
	},
	{ source: "/activities/open-science", destination: "/about/strategy", permanent: true },
	{
		source: "/activities/open-science/dariah-open",
		destination: "/about/strategy",
		permanent: true,
	},
	{
		source: "/activities/open-science/data-re-use",
		destination: "/about/strategy",
		permanent: true,
	},
	{
		source: "/activities/open-science/openmethods",
		destination: "/about/strategy",
		permanent: true,
	},
	{
		source: "/activities/open-science/transformations",
		destination: "/resources/transformations",
		permanent: true,
	},
	{ source: "/activities/projects-list", destination: "/projects", permanent: true },
	{
		source: "/activities/projects-and-affiliations/:path*",
		destination: "/projects/:path*",
		permanent: true,
	},
	{
		source: "/activities/spotlight/:path*",
		destination: "/spotlight/:path*",
		permanent: true,
	},
	{
		source: "/activities/training-and-education",
		destination: "/about/strategy",
		permanent: true,
	},
	{ source: "/category/news", destination: "/news", permanent: true },
	{
		source: "/country/:id",
		destination: "/network/members-and-partners/:id",
		permanent: true,
	},
	{ source: "/event/:path*", destination: "/events/:path*", permanent: true },
	/** The legacy calendar feed, which calendar apps keep polling at the url they subscribed to. */
	{
		source: "/events",
		has: [{ type: "query", key: "ical" }],
		destination: "/feeds/events.ics",
		permanent: true,
	},
	{ source: "/news-events/dariah-newsletters", destination: "/newsletters", permanent: true },
	{
		source: "/tools-services/tools-and-services",
		destination: "/resources/resource-catalogue",
		permanent: true,
	},
	{
		source: String.raw`/:year(\d{4})/:month(\d{2})/:date(\d{2})/:path*`,
		destination: "/news/:path*",
		permanent: true,
	},
	/** Download links to files the legacy website hosted, which are documents-policies entries now. */
	{
		source: "/wp-content/uploads/2019/08/Strategic-Plan_2019-2026.pdf",
		destination: documentUrl("dariah-strategic-plan-2019-2026"),
		permanent: true,
	},
];
