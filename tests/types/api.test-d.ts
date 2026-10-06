import type { Endpoint } from "#/lib/api/endpoint.ts";
import * as api from "#/lib/api/endpoints.ts";
import type { CacheTag, Event, GetEventsResponse } from "#/lib/api/schemas.ts";
import type { RequestResult } from "#/lib/request/index.ts";

type Equal<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

type Assert<T extends true> = T;

/** Nested types are exposed on a namespace which shares the endpoint's name. */
export type ParamsAreTyped = Assert<Equal<api.getEventBySlug.Params, { slug: string }>>;
export type ResponseIsSchema = Assert<Equal<api.getEventBySlug.Response, Event>>;
export type ListResponseIsSchema = Assert<Equal<api.getEvents.Response, GetEventsResponse>>;
export type BodyIsTyped = Assert<Equal<api.subscribeToNewsletter.Body["email"], string>>;
export type EndpointIsGeneric = Assert<
	Equal<typeof api.getEvents, Endpoint<{ response: GetEventsResponse; searchParams: api.getEvents.SearchParams }>>
>;

/** `url()` requires path parameters, and accepts search parameters. */
const detailUrl: URL = api.getEventBySlug.url({ params: { slug: "x" } });
// @ts-expect-error -- path parameters are required
api.getEventBySlug.url();
// @ts-expect-error -- unknown search parameter
api.getEventBySlug.url({ params: { slug: "x" }, searchParams: { nope: 1 } });
const listUrl: URL = api.getEvents.url();
const filteredListUrl: URL = api.getEvents.url({ searchParams: { limit: 10, from: "2026-01-01" } });
const imageUrl: URL = api.getAssetImage.url({
	params: { prefix: "images", name: "a.jpg", version: "v1" },
	searchParams: { w: 640, ar: "16x9" },
});
// @ts-expect-error -- unsupported width
api.getAssetImage.url({ params: { prefix: "images", name: "a.jpg", version: "v1" }, searchParams: { w: 641 } });

/** `request()` adds the body, and the `lib/request` options. */
const detail: Promise<RequestResult<Event>> = api.getEventBySlug.request({
	params: { slug: "x" },
	signal: AbortSignal.timeout(1),
});
const list: Promise<RequestResult<GetEventsResponse>> = api.getEvents.request();
const download: Promise<RequestResult<globalThis.Response>> = api.getAssetDownload.request({
	params: { prefix: "documents", name: "a.pdf" },
});
// @ts-expect-error -- body is required
void api.subscribeToNewsletter.request();
const subscription: Promise<RequestResult<api.subscribeToNewsletter.Response>> = api.subscribeToNewsletter.request({
	body: { email: "a@b.c" },
});

/** Cache tags are typed against the api's `CacheTag` enum. */
const tags: ReadonlyArray<CacheTag> = api.getEventBySlug.cacheTags();

export const values = { detail, detailUrl, download, filteredListUrl, imageUrl, list, listUrl, subscription, tags };
