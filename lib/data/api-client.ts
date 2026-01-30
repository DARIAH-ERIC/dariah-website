import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";
import { notFound } from "next/navigation";
import { cache } from "react";

import { env } from "@/config/env.config";
import type { paths } from "@/lib/api/types";
import { HttpError, request } from "@/lib/utils/request";

const baseUrl = env.NEXT_PUBLIC_API_BASE_URL;

export const client = {
	events: {
		bySlug: cache(async function bySlug({
			slug,
		}: paths["/api/v1/events/slugs/{slug}"]["get"]["parameters"]["path"]) {
			const url = createUrl({
				baseUrl,
				pathname: `/api/v1/events/slugs/${slug}`,
			});

			const result = await request<
				paths["/api/v1/events/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"]
			>(url, {
				responseType: "json",
			});

			if (result.isErr() && HttpError.is(result.error) && result.error.response.status === 404) {
				notFound();
			}

			return result.unwrap();
		}),
		list: cache(async function list({
			limit = 10,
			offset = 0,
		}: paths["/api/v1/events"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/events",
				searchParams: createUrlSearchParams({
					limit,
					offset,
				}),
			});

			const result = await request<
				paths["/api/v1/events"]["get"]["responses"][200]["content"]["application/json"]
			>(url, {
				responseType: "json",
			});

			return result.unwrap();
		}),
	},
	impactCaseStudies: {
		bySlug: cache(async function bySlug({
			slug,
		}: paths["/api/v1/impact-case-studies/slugs/{slug}"]["get"]["parameters"]["path"]) {
			const url = createUrl({
				baseUrl,
				pathname: `/api/v1/impact-case-studies/slugs/${slug}`,
			});

			const result = await request<
				paths["/api/v1/impact-case-studies/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"]
			>(url, {
				responseType: "json",
			});

			if (result.isErr() && HttpError.is(result.error) && result.error.response.status === 404) {
				notFound();
			}

			return result.unwrap();
		}),
		list: cache(async function list({
			limit = 10,
			offset = 0,
		}: paths["/api/v1/impact-case-studies"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/impact-case-studies",
				searchParams: createUrlSearchParams({
					limit,
					offset,
				}),
			});

			const result = await request<
				paths["/api/v1/impact-case-studies"]["get"]["responses"][200]["content"]["application/json"]
			>(url, { responseType: "json" });

			return result.unwrap();
		}),
	},
	membersAndPartners: {
		bySlug: cache(async function bySlug({
			slug,
		}: paths["/api/v1/members-partners/slugs/{slug}"]["get"]["parameters"]["path"]) {
			const url = createUrl({
				baseUrl,
				pathname: `/api/v1/members-partners/slugs/${slug}`,
			});

			const result = await request<
				paths["/api/v1/members-partners/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"]
			>(url, {
				responseType: "json",
			});

			if (result.isErr() && HttpError.is(result.error) && result.error.response.status === 404) {
				notFound();
			}

			return result.unwrap();
		}),
		list: cache(async function list({
			limit = 10,
			offset = 0,
		}: paths["/api/v1/members-partners"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/members-partners",
				searchParams: createUrlSearchParams({
					limit,
					offset,
				}),
			});

			const result = await request<
				paths["/api/v1/members-partners"]["get"]["responses"][200]["content"]["application/json"]
			>(url, { responseType: "json" });

			return result.unwrap();
		}),
	},
	news: {
		bySlug: cache(async function bySlug({
			slug,
		}: paths["/api/v1/news/slugs/{slug}"]["get"]["parameters"]["path"]) {
			const url = createUrl({
				baseUrl,
				pathname: `/api/v1/news/slugs/${slug}`,
			});

			const result = await request<
				paths["/api/v1/news/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"]
			>(url, {
				responseType: "json",
			});

			if (result.isErr() && HttpError.is(result.error) && result.error.response.status === 404) {
				notFound();
			}

			return result.unwrap();
		}),
		list: cache(async function list({
			limit = 10,
			offset = 0,
		}: paths["/api/v1/news"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/news",
				searchParams: createUrlSearchParams({
					limit,
					offset,
				}),
			});

			const result = await request<
				paths["/api/v1/news"]["get"]["responses"][200]["content"]["application/json"]
			>(url, { responseType: "json" });

			return result.unwrap();
		}),
	},
	pages: {
		bySlug: cache(async function bySlug({
			slug,
		}: paths["/api/v1/pages/slugs/{slug}"]["get"]["parameters"]["path"]) {
			const url = createUrl({
				baseUrl,
				pathname: `/api/v1/pages/slugs/${slug}`,
			});

			const result = await request<
				paths["/api/v1/pages/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"]
			>(url, {
				responseType: "json",
			});

			if (result.isErr() && HttpError.is(result.error) && result.error.response.status === 404) {
				notFound();
			}

			return result.unwrap();
		}),
		list: cache(async function list({
			limit = 10,
			offset = 0,
		}: paths["/api/v1/pages"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/pages",
				searchParams: createUrlSearchParams({
					limit,
					offset,
				}),
			});

			const result = await request<
				paths["/api/v1/pages"]["get"]["responses"][200]["content"]["application/json"]
			>(url, { responseType: "json" });

			return result.unwrap();
		}),
	},
	spotlightArticles: {
		bySlug: cache(async function bySlug({
			slug,
		}: paths["/api/v1/spotlight-articles/slugs/{slug}"]["get"]["parameters"]["path"]) {
			const url = createUrl({
				baseUrl,
				pathname: `/api/v1/spotlight-articles/slugs/${slug}`,
			});

			const result = await request<
				paths["/api/v1/spotlight-articles/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"]
			>(url, {
				responseType: "json",
			});

			if (result.isErr() && HttpError.is(result.error) && result.error.response.status === 404) {
				notFound();
			}

			return result.unwrap();
		}),
		list: cache(async function list({
			limit = 10,
			offset = 0,
		}: paths["/api/v1/spotlight-articles"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/spotlight-articles",
				searchParams: createUrlSearchParams({
					limit,
					offset,
				}),
			});

			const result = await request<
				paths["/api/v1/spotlight-articles"]["get"]["responses"][200]["content"]["application/json"]
			>(url, { responseType: "json" });

			return result.unwrap();
		}),
	},
};
