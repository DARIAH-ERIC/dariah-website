import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";
import { notFound } from "next/navigation";
import { cache } from "react";

import { env } from "@/config/env.config";
import type { paths } from "@/lib/api/types";
import { HttpError, request } from "@/lib/utils/request";

const baseUrl = env.NEXT_PUBLIC_API_BASE_URL;

export type DocumentOrPolicy =
	paths["/api/v1/documents-policies/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"];
export type DocumentOrPolicyList =
	paths["/api/v1/documents-policies"]["get"]["responses"][200]["content"]["application/json"];

export type Event =
	paths["/api/v1/events/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"];
export type EventList =
	paths["/api/v1/events"]["get"]["responses"][200]["content"]["application/json"];

export type ImpactCaseStudy =
	paths["/api/v1/impact-case-studies/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"];
export type ImpactCaseStudyList =
	paths["/api/v1/impact-case-studies"]["get"]["responses"][200]["content"]["application/json"];

export type MemberOrPartner =
	paths["/api/v1/members-partners/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"];
export type MemberOrPartnerList =
	paths["/api/v1/members-partners"]["get"]["responses"][200]["content"]["application/json"];

export type NewsItem =
	paths["/api/v1/news/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"];
export type NewsItemList =
	paths["/api/v1/news"]["get"]["responses"][200]["content"]["application/json"];

export type NewsletterList =
	paths["/api/v1/newsletters"]["get"]["responses"][200]["content"]["application/json"];

export type Page =
	paths["/api/v1/pages/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"];
export type PageList =
	paths["/api/v1/pages"]["get"]["responses"][200]["content"]["application/json"];

export type Person =
	paths["/api/v1/persons/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"];
export type PersonList =
	paths["/api/v1/persons"]["get"]["responses"][200]["content"]["application/json"];

export type Project =
	paths["/api/v1/projects/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"];
export type ProjectList =
	paths["/api/v1/projects"]["get"]["responses"][200]["content"]["application/json"];

export type SpotlightArticle =
	paths["/api/v1/spotlight-articles/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"];
export type SpotlightArticleList =
	paths["/api/v1/spotlight-articles"]["get"]["responses"][200]["content"]["application/json"];

export type WorkingGroup =
	paths["/api/v1/working-groups/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"];
export type WorkingGroupList =
	paths["/api/v1/working-groups"]["get"]["responses"][200]["content"]["application/json"];

export const client = {
	documentsPolicies: {
		bySlug: cache(async function bySlug({
			slug,
		}: paths["/api/v1/documents-policies/slugs/{slug}"]["get"]["parameters"]["path"]) {
			const url = createUrl({
				baseUrl,
				pathname: `/api/v1/documents-policies/slugs/${slug}`,
			});

			const result = await request<DocumentOrPolicy>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			if (result.isErr() && HttpError.is(result.error) && result.error.response.status === 404) {
				notFound();
			}

			return result.unwrap();
		}),
		list: cache(async function list({
			limit = 10,
			offset = 0,
		}: paths["/api/v1/documents-policies"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/documents-policies",
				searchParams: createUrlSearchParams({
					limit,
					offset,
				}),
			});

			const result = await request<DocumentOrPolicyList>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			return result.unwrap();
		}),
		slugs: cache(async function slugs({
			limit = 10,
			offset = 0,
		}: paths["/api/v1/documents-policies/slugs"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/documents-policies/slugs",
				searchParams: createUrlSearchParams({
					limit,
					offset,
				}),
			});

			const result = await request<
				paths["/api/v1/documents-policies/slugs"]["get"]["responses"][200]["content"]["application/json"]
			>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			return result.unwrap();
		}),
	},
	events: {
		bySlug: cache(async function bySlug({
			slug,
		}: paths["/api/v1/events/slugs/{slug}"]["get"]["parameters"]["path"]) {
			const url = createUrl({
				baseUrl,
				pathname: `/api/v1/events/slugs/${slug}`,
			});

			const result = await request<Event>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
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

			const result = await request<EventList>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			return result.unwrap();
		}),
		slugs: cache(async function slugs({
			limit = 10,
			offset = 0,
		}: paths["/api/v1/events/slugs"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/events/slugs",
				searchParams: createUrlSearchParams({
					limit,
					offset,
				}),
			});

			const result = await request<
				paths["/api/v1/events/slugs"]["get"]["responses"][200]["content"]["application/json"]
			>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
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

			const result = await request<ImpactCaseStudy>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
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

			const result = await request<ImpactCaseStudyList>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			return result.unwrap();
		}),
		slugs: cache(async function slugs({
			limit = 10,
			offset = 0,
		}: paths["/api/v1/impact-case-studies/slugs"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/impact-case-studies/slugs",
				searchParams: createUrlSearchParams({
					limit,
					offset,
				}),
			});

			const result = await request<
				paths["/api/v1/impact-case-studies/slugs"]["get"]["responses"][200]["content"]["application/json"]
			>(url, { responseType: "json", retry: { backoff: "exponential", delayMs: 200, times: 2 } });

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

			const result = await request<MemberOrPartner>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
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

			const result = await request<MemberOrPartnerList>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			return result.unwrap();
		}),
		slugs: cache(async function slugs({
			limit = 10,
			offset = 0,
		}: paths["/api/v1/members-partners/slugs"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/members-partners/slugs",
				searchParams: createUrlSearchParams({
					limit,
					offset,
				}),
			});

			const result = await request<
				paths["/api/v1/members-partners/slugs"]["get"]["responses"][200]["content"]["application/json"]
			>(url, { responseType: "json", retry: { backoff: "exponential", delayMs: 200, times: 2 } });

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

			const result = await request<NewsItem>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
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

			const result = await request<NewsItemList>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			return result.unwrap();
		}),
		slugs: cache(async function slugs({
			limit = 10,
			offset = 0,
		}: paths["/api/v1/news/slugs"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/news/slugs",
				searchParams: createUrlSearchParams({
					limit,
					offset,
				}),
			});

			const result = await request<
				paths["/api/v1/news/slugs"]["get"]["responses"][200]["content"]["application/json"]
			>(url, { responseType: "json", retry: { backoff: "exponential", delayMs: 200, times: 2 } });

			return result.unwrap();
		}),
	},
	newsletters: {
		list: cache(async function list({
			limit = 10,
			offset = 0,
		}: paths["/api/v1/newsletters"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/newsletters",
				searchParams: createUrlSearchParams({
					limit,
					offset,
				}),
			});

			const result = await request<NewsletterList>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

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

			const result = await request<Page>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
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

			const result = await request<PageList>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			return result.unwrap();
		}),
		slugs: cache(async function slugs({
			limit = 10,
			offset = 0,
		}: paths["/api/v1/pages/slugs"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/pages/slugs",
				searchParams: createUrlSearchParams({
					limit,
					offset,
				}),
			});

			const result = await request<
				paths["/api/v1/pages/slugs"]["get"]["responses"][200]["content"]["application/json"]
			>(url, { responseType: "json", retry: { backoff: "exponential", delayMs: 200, times: 2 } });

			return result.unwrap();
		}),
	},
	persons: {
		bySlug: cache(async function bySlug({
			slug,
		}: paths["/api/v1/persons/slugs/{slug}"]["get"]["parameters"]["path"]) {
			const url = createUrl({
				baseUrl,
				pathname: `/api/v1/persons/slugs/${slug}`,
			});

			const result = await request<Person>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			if (result.isErr() && HttpError.is(result.error) && result.error.response.status === 404) {
				notFound();
			}

			return result.unwrap();
		}),
		list: cache(async function list({
			limit = 10,
			offset = 0,
		}: paths["/api/v1/persons"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/persons",
				searchParams: createUrlSearchParams({
					limit,
					offset,
				}),
			});

			const result = await request<PersonList>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			return result.unwrap();
		}),
		slugs: cache(async function slugs({
			limit = 10,
			offset = 0,
		}: paths["/api/v1/persons/slugs"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/persons/slugs",
				searchParams: createUrlSearchParams({
					limit,
					offset,
				}),
			});

			const result = await request<
				paths["/api/v1/persons/slugs"]["get"]["responses"][200]["content"]["application/json"]
			>(url, { responseType: "json", retry: { backoff: "exponential", delayMs: 200, times: 2 } });

			return result.unwrap();
		}),
	},
	projects: {
		bySlug: cache(async function bySlug({
			slug,
		}: paths["/api/v1/dariah-projects/slugs/{slug}"]["get"]["parameters"]["path"]) {
			const url = createUrl({
				baseUrl,
				pathname: `/api/v1/dariah-projects/slugs/${slug}`,
			});

			const result = await request<Project>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			if (result.isErr() && HttpError.is(result.error) && result.error.response.status === 404) {
				notFound();
			}

			return result.unwrap();
		}),
		list: cache(async function list({
			limit = 10,
			offset = 0,
		}: paths["/api/v1/dariah-projects"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/dariah-projects",
				searchParams: createUrlSearchParams({
					limit,
					offset,
				}),
			});

			const result = await request<ProjectList>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			return result.unwrap();
		}),
		slugs: cache(async function slugs({
			limit = 10,
			offset = 0,
		}: paths["/api/v1/dariah-projects/slugs"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/dariah-projects/slugs",
				searchParams: createUrlSearchParams({
					limit,
					offset,
				}),
			});

			const result = await request<
				paths["/api/v1/dariah-projects/slugs"]["get"]["responses"][200]["content"]["application/json"]
			>(url, { responseType: "json", retry: { backoff: "exponential", delayMs: 200, times: 2 } });

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

			const result = await request<SpotlightArticle>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
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

			const result = await request<SpotlightArticleList>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			return result.unwrap();
		}),
		slugs: cache(async function slugs({
			limit = 10,
			offset = 0,
		}: paths["/api/v1/spotlight-articles/slugs"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/spotlight-articles/slugs",
				searchParams: createUrlSearchParams({
					limit,
					offset,
				}),
			});

			const result = await request<
				paths["/api/v1/spotlight-articles/slugs"]["get"]["responses"][200]["content"]["application/json"]
			>(url, { responseType: "json", retry: { backoff: "exponential", delayMs: 200, times: 2 } });

			return result.unwrap();
		}),
	},
	workingGroups: {
		bySlug: cache(async function bySlug({
			slug,
		}: paths["/api/v1/working-groups/slugs/{slug}"]["get"]["parameters"]["path"]) {
			const url = createUrl({
				baseUrl,
				pathname: `/api/v1/working-groups/slugs/${slug}`,
			});

			const result = await request<WorkingGroup>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			if (result.isErr() && HttpError.is(result.error) && result.error.response.status === 404) {
				notFound();
			}

			return result.unwrap();
		}),
		list: cache(async function list({
			limit = 10,
			offset = 0,
		}: paths["/api/v1/working-groups"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/working-groups",
				searchParams: createUrlSearchParams({
					limit,
					offset,
				}),
			});

			const result = await request<WorkingGroupList>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			return result.unwrap();
		}),
		slugs: cache(async function slugs({
			limit = 10,
			offset = 0,
		}: paths["/api/v1/working-groups/slugs"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/working-groups/slugs",
				searchParams: createUrlSearchParams({
					limit,
					offset,
				}),
			});

			const result = await request<
				paths["/api/v1/working-groups/slugs"]["get"]["responses"][200]["content"]["application/json"]
			>(url, { responseType: "json", retry: { backoff: "exponential", delayMs: 200, times: 2 } });

			return result.unwrap();
		}),
	},
};
