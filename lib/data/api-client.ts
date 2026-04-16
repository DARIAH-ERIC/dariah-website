import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";
import { unstable_cache as nextCache } from "next/cache";
import { notFound } from "next/navigation";
import { cache } from "react";

import { env } from "@/config/env.config";
import type { paths } from "@/lib/api/types";
import { HttpError, request } from "@/lib/utils/request";

const baseUrl = env.NEXT_PUBLIC_API_BASE_URL;

type WithPublishedAt<T extends { publishedAt: string }> = Omit<T, "publishedAt"> & {
	publishedAt: Date;
};

type WithDuration<T extends { duration: { start: string; end?: string } }> = Omit<T, "duration"> & {
	duration: { start: Date; end?: Date };
};

type DocumentOrPolicyResponse =
	paths["/api/v1/documents-policies/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"];
type DocumentOrPolicyListResponse =
	paths["/api/v1/documents-policies"]["get"]["responses"][200]["content"]["application/json"];

type EventResponse =
	paths["/api/v1/events/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"];
type EventListResponse =
	paths["/api/v1/events"]["get"]["responses"][200]["content"]["application/json"];

type ImpactCaseStudyResponse =
	paths["/api/v1/impact-case-studies/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"];
type ImpactCaseStudyListResponse =
	paths["/api/v1/impact-case-studies"]["get"]["responses"][200]["content"]["application/json"];

type MemberOrPartnerResponse =
	paths["/api/v1/members-partners/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"];
type MemberOrPartnerListResponse =
	paths["/api/v1/members-partners"]["get"]["responses"][200]["content"]["application/json"];

type NavigationResponse =
	paths["/api/v1/navigation"]["get"]["responses"][200]["content"]["application/json"];

type NewsItemResponse =
	paths["/api/v1/news/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"];
type NewsItemListResponse =
	paths["/api/v1/news"]["get"]["responses"][200]["content"]["application/json"];

type NewsletterListResponse =
	paths["/api/v1/newsletters"]["get"]["responses"][200]["content"]["application/json"];

type PageResponse =
	paths["/api/v1/pages/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"];
type PageListResponse =
	paths["/api/v1/pages"]["get"]["responses"][200]["content"]["application/json"];

type PersonResponse =
	paths["/api/v1/persons/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"];
type PersonListResponse =
	paths["/api/v1/persons"]["get"]["responses"][200]["content"]["application/json"];

type ProjectResponse =
	paths["/api/v1/dariah-projects/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"];
type ProjectListResponse =
	paths["/api/v1/dariah-projects"]["get"]["responses"][200]["content"]["application/json"];

type SiteMetadataResponse =
	paths["/api/v1/site-metadata"]["get"]["responses"][200]["content"]["application/json"];

type SpotlightArticleResponse =
	paths["/api/v1/spotlight-articles/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"];
type SpotlightArticleListResponse =
	paths["/api/v1/spotlight-articles"]["get"]["responses"][200]["content"]["application/json"];

type WorkingGroupResponse =
	paths["/api/v1/working-groups/slugs/{slug}"]["get"]["responses"][200]["content"]["application/json"];
type WorkingGroupListResponse =
	paths["/api/v1/working-groups"]["get"]["responses"][200]["content"]["application/json"];

export type DocumentOrPolicy = WithPublishedAt<DocumentOrPolicyResponse>;
export type DocumentOrPolicyList = Omit<DocumentOrPolicyListResponse, "data"> & {
	data: Array<WithPublishedAt<DocumentOrPolicyListResponse["data"][number]>>;
};

export type Event = WithPublishedAt<WithDuration<EventResponse>>;
export type EventList = Omit<EventListResponse, "data"> & {
	data: Array<WithPublishedAt<WithDuration<EventListResponse["data"][number]>>>;
};

export type ImpactCaseStudy = WithPublishedAt<ImpactCaseStudyResponse>;
export type ImpactCaseStudyList = Omit<ImpactCaseStudyListResponse, "data"> & {
	data: Array<WithPublishedAt<ImpactCaseStudyListResponse["data"][number]>>;
};

export type MemberOrPartner = WithPublishedAt<MemberOrPartnerResponse>;
export type MemberOrPartnerList = Omit<MemberOrPartnerListResponse, "data"> & {
	data: Array<WithPublishedAt<MemberOrPartnerListResponse["data"][number]>>;
};

export type NewsItem = WithPublishedAt<NewsItemResponse>;
export type NewsItemList = Omit<NewsItemListResponse, "data"> & {
	data: Array<WithPublishedAt<NewsItemListResponse["data"][number]>>;
};

export type NewsletterList =
	paths["/api/v1/newsletters"]["get"]["responses"][200]["content"]["application/json"];

export type Page = WithPublishedAt<PageResponse>;
export type PageList = Omit<PageListResponse, "data"> & {
	data: Array<WithPublishedAt<PageListResponse["data"][number]>>;
};

export type Person = WithPublishedAt<PersonResponse>;
export type PersonList = Omit<PersonListResponse, "data"> & {
	data: Array<WithPublishedAt<PersonListResponse["data"][number]>>;
};

export type Project = WithPublishedAt<WithDuration<ProjectResponse>>;
export type ProjectList = Omit<ProjectListResponse, "data"> & {
	data: Array<WithPublishedAt<WithDuration<ProjectListResponse["data"][number]>>>;
};

export type SpotlightArticle = WithPublishedAt<SpotlightArticleResponse>;
export type SpotlightArticleList = Omit<SpotlightArticleListResponse, "data"> & {
	data: Array<WithPublishedAt<SpotlightArticleListResponse["data"][number]>>;
};

export type Statistics =
	paths["/api/v1/statistics"]["get"]["responses"][200]["content"]["application/json"];

export type WorkingGroup = WithPublishedAt<WorkingGroupResponse>;
export type WorkingGroupList = Omit<WorkingGroupListResponse, "data"> & {
	data: Array<WithPublishedAt<WorkingGroupListResponse["data"][number]>>;
};

export const client = {
	documentsPolicies: {
		bySlug: cache(async function bySlug({
			slug,
		}: paths["/api/v1/documents-policies/slugs/{slug}"]["get"]["parameters"]["path"]) {
			const url = createUrl({
				baseUrl,
				pathname: `/api/v1/documents-policies/slugs/${slug}`,
			});

			const result = await request<DocumentOrPolicyResponse>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			if (result.isErr() && HttpError.is(result.error) && result.error.response.status === 404) {
				notFound();
			}

			const response = result.unwrap();
			return {
				...response,
				data: { ...response.data, publishedAt: new Date(response.data.publishedAt) },
			};
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

			const result = await request<DocumentOrPolicyListResponse>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			const response = result.unwrap();
			return {
				...response,
				data: {
					...response.data,
					data: response.data.data.map((item) => {
						return {
							...item,
							publishedAt: new Date(item.publishedAt),
						};
					}),
				},
			};
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

			const result = await request<EventResponse>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			if (result.isErr() && HttpError.is(result.error) && result.error.response.status === 404) {
				notFound();
			}

			const response = result.unwrap();
			return {
				...response,
				data: {
					...response.data,
					publishedAt: new Date(response.data.publishedAt),
					duration: {
						start: new Date(response.data.duration.start),
						end:
							response.data.duration.end !== undefined
								? new Date(response.data.duration.end)
								: undefined,
					},
					links: {
						prev: response.data.links.prev
							? {
									...response.data.links.prev,
									duration: {
										start: new Date(response.data.links.prev.duration.start),
										end:
											response.data.links.prev.duration.end !== undefined
												? new Date(response.data.links.prev.duration.end)
												: undefined,
									},
								}
							: null,
						next: response.data.links.next
							? {
									...response.data.links.next,
									duration: {
										start: new Date(response.data.links.next.duration.start),
										end:
											response.data.links.next.duration.end !== undefined
												? new Date(response.data.links.next.duration.end)
												: undefined,
									},
								}
							: null,
					},
				},
			};
		}),
		list: cache(async function list({
			from,
			until,
			limit = 10,
			offset = 0,
		}: paths["/api/v1/events"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/events",
				searchParams: createUrlSearchParams({
					from,
					until,
					limit,
					offset,
				}),
			});

			const result = await request<EventListResponse>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			const response = result.unwrap();
			return {
				...response,
				data: {
					...response.data,
					data: response.data.data.map((item) => {
						return {
							...item,
							publishedAt: new Date(item.publishedAt),
							duration: {
								start: new Date(item.duration.start),
								end: item.duration.end !== undefined ? new Date(item.duration.end) : undefined,
							},
						};
					}),
				},
			};
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
	homePage: {
		get: cache(async function get() {
			const now = new Date();

			const eventsUrl = createUrl({
				baseUrl,
				pathname: "/api/v1/events",
				searchParams: createUrlSearchParams({
					from: [
						now.getUTCFullYear(),
						String(now.getUTCMonth() + 1).padStart(2, "0"),
						String(now.getUTCDate()).padStart(2, "0"),
					].join("-"),
					limit: 3,
				}),
			});

			const newsUrl = createUrl({
				baseUrl,
				pathname: "/api/v1/news",
				searchParams: createUrlSearchParams({
					limit: 3,
				}),
			});

			const statsUrl = createUrl({
				baseUrl,
				pathname: "/api/v1/statistics",
			});

			const [eventsResult, newsResult, statsResult] = await Promise.all([
				request<EventListResponse>(eventsUrl, {
					responseType: "json",
					retry: { backoff: "exponential", delayMs: 200, times: 2 },
				}),
				request<NewsItemListResponse>(newsUrl, {
					responseType: "json",
					retry: { backoff: "exponential", delayMs: 200, times: 2 },
				}),
				request<Statistics>(statsUrl, {
					responseType: "json",
					retry: { backoff: "exponential", delayMs: 200, times: 2 },
				}),
			]);

			const eventsResponse = eventsResult.unwrap();
			const newsResponse = newsResult.unwrap();
			const stats = statsResult.unwrap();

			return {
				events: {
					...eventsResponse,
					data: {
						...eventsResponse.data,
						data: eventsResponse.data.data.map((item) => {
							return {
								...item,
								publishedAt: new Date(item.publishedAt),
								duration: {
									start: new Date(item.duration.start),
									end: item.duration.end !== undefined ? new Date(item.duration.end) : undefined,
								},
							};
						}),
					},
				},
				news: {
					...newsResponse,
					data: {
						...newsResponse.data,
						data: newsResponse.data.data.map((item) => {
							return {
								...item,
								publishedAt: new Date(item.publishedAt),
							};
						}),
					},
				},
				stats,
			};
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

			const result = await request<ImpactCaseStudyResponse>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			if (result.isErr() && HttpError.is(result.error) && result.error.response.status === 404) {
				notFound();
			}

			const response = result.unwrap();
			return {
				...response,
				data: { ...response.data, publishedAt: new Date(response.data.publishedAt) },
			};
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

			const result = await request<ImpactCaseStudyListResponse>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			const response = result.unwrap();
			return {
				...response,
				data: {
					...response.data,
					data: response.data.data.map((item) => {
						return {
							...item,
							publishedAt: new Date(item.publishedAt),
						};
					}),
				},
			};
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

			const result = await request<MemberOrPartnerResponse>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			if (result.isErr() && HttpError.is(result.error) && result.error.response.status === 404) {
				notFound();
			}

			const response = result.unwrap();
			return {
				...response,
				data: { ...response.data, publishedAt: new Date(response.data.publishedAt) },
			};
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

			const result = await request<MemberOrPartnerListResponse>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			const response = result.unwrap();
			return {
				...response,
				data: {
					...response.data,
					data: response.data.data.map((item) => {
						return {
							...item,
							publishedAt: new Date(item.publishedAt),
						};
					}),
				},
			};
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
	navigation: {
		get: cache(
			nextCache(
				async function get({
					menu,
				}: paths["/api/v1/navigation"]["get"]["parameters"]["query"] = {}) {
					const url = createUrl({
						baseUrl,
						pathname: "/api/v1/navigation",
						searchParams: createUrlSearchParams({
							menu,
						}),
					});

					const result = await request<NavigationResponse>(url, {
						responseType: "json",
						retry: { backoff: "exponential", delayMs: 200, times: 2 },
					});

					return result.unwrap();
				},
				["navigation"],
				{ revalidate: 3600, tags: ["navigation"] },
			),
		),
	},
	news: {
		bySlug: cache(async function bySlug({
			slug,
		}: paths["/api/v1/news/slugs/{slug}"]["get"]["parameters"]["path"]) {
			const url = createUrl({
				baseUrl,
				pathname: `/api/v1/news/slugs/${slug}`,
			});

			const result = await request<NewsItemResponse>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			if (result.isErr() && HttpError.is(result.error) && result.error.response.status === 404) {
				notFound();
			}

			const response = result.unwrap();
			return {
				...response,
				data: { ...response.data, publishedAt: new Date(response.data.publishedAt) },
			};
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

			const result = await request<NewsItemListResponse>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			const response = result.unwrap();
			return {
				...response,
				data: {
					...response.data,
					data: response.data.data.map((item) => {
						return {
							...item,
							publishedAt: new Date(item.publishedAt),
						};
					}),
				},
			};
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

			const result = await request<NewsletterListResponse>(url, {
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

			const result = await request<PageResponse>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			if (result.isErr() && HttpError.is(result.error) && result.error.response.status === 404) {
				notFound();
			}

			const response = result.unwrap();
			return {
				...response,
				data: { ...response.data, publishedAt: new Date(response.data.publishedAt) },
			};
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

			const result = await request<PageListResponse>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			const response = result.unwrap();
			return {
				...response,
				data: {
					...response.data,
					data: response.data.data.map((item) => {
						return {
							...item,
							publishedAt: new Date(item.publishedAt),
						};
					}),
				},
			};
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

			const result = await request<PersonResponse>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			if (result.isErr() && HttpError.is(result.error) && result.error.response.status === 404) {
				notFound();
			}

			const response = result.unwrap();
			return {
				...response,
				data: { ...response.data, publishedAt: new Date(response.data.publishedAt) },
			};
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

			const result = await request<PersonListResponse>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			const response = result.unwrap();
			return {
				...response,
				data: {
					...response.data,
					data: response.data.data.map((item) => {
						return {
							...item,
							publishedAt: new Date(item.publishedAt),
						};
					}),
				},
			};
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

			const result = await request<ProjectResponse>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			if (result.isErr() && HttpError.is(result.error) && result.error.response.status === 404) {
				notFound();
			}

			const response = result.unwrap();
			return {
				...response,
				data: {
					...response.data,
					publishedAt: new Date(response.data.publishedAt),
					duration: {
						start: new Date(response.data.duration.start),
						end:
							response.data.duration.end !== undefined
								? new Date(response.data.duration.end)
								: undefined,
					},
				},
			};
		}),
		list: cache(async function list({
			status,
			limit = 10,
			offset = 0,
		}: paths["/api/v1/dariah-projects"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/dariah-projects",
				searchParams: createUrlSearchParams({
					status,
					limit,
					offset,
				}),
			});

			const result = await request<ProjectListResponse>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			const response = result.unwrap();
			return {
				...response,
				data: {
					...response.data,
					data: response.data.data.map((item) => {
						return {
							...item,
							publishedAt: new Date(item.publishedAt),
							duration: {
								start: new Date(item.duration.start),
								end: item.duration.end !== undefined ? new Date(item.duration.end) : undefined,
							},
						};
					}),
				},
			};
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
	siteMetadata: {
		get: cache(async function get() {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/site-metadata",
			});

			const result = await request<SiteMetadataResponse>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

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

			const result = await request<SpotlightArticleResponse>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			if (result.isErr() && HttpError.is(result.error) && result.error.response.status === 404) {
				notFound();
			}

			const response = result.unwrap();
			return {
				...response,
				data: { ...response.data, publishedAt: new Date(response.data.publishedAt) },
			};
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

			const result = await request<SpotlightArticleListResponse>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			const response = result.unwrap();
			return {
				...response,
				data: {
					...response.data,
					data: response.data.data.map((item) => {
						return {
							...item,
							publishedAt: new Date(item.publishedAt),
						};
					}),
				},
			};
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

			const result = await request<WorkingGroupResponse>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			if (result.isErr() && HttpError.is(result.error) && result.error.response.status === 404) {
				notFound();
			}

			const response = result.unwrap();
			return {
				...response,
				data: { ...response.data, publishedAt: new Date(response.data.publishedAt) },
			};
		}),
		list: cache(async function list({
			status,
			limit = 10,
			offset = 0,
		}: paths["/api/v1/working-groups"]["get"]["parameters"]["query"] = {}) {
			const url = createUrl({
				baseUrl,
				pathname: "/api/v1/working-groups",
				searchParams: createUrlSearchParams({
					status,
					limit,
					offset,
				}),
			});

			const result = await request<WorkingGroupListResponse>(url, {
				responseType: "json",
				retry: { backoff: "exponential", delayMs: 200, times: 2 },
			});

			const response = result.unwrap();
			return {
				...response,
				data: {
					...response.data,
					data: response.data.data.map((item) => {
						return {
							...item,
							publishedAt: new Date(item.publishedAt),
						};
					}),
				},
			};
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
