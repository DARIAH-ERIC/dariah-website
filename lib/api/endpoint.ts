import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";

import { env } from "#/configs/env.config.ts";
import type { CacheTag } from "#/lib/api/schemas.ts";
import { type HttpMethod, type RequestOptions, type RequestResult, request } from "#/lib/request/index.ts";

/**
 * The shape of an operation, as declared by the generated endpoints in `#/lib/api/endpoints.ts`: path parameters,
 * search parameters and request body are only present when the operation declares them.
 */
export interface EndpointShape {
	body?: unknown;
	params?: object;
	response: unknown;
	searchParams?: object;
}

export interface EndpointDefinition {
	cacheTags: ReadonlyArray<CacheTag>;
	method: HttpMethod;
	/** Path template with `{name}` placeholders for path parameters. */
	pathname: string;
	/** `json` parses the success response body; `response` returns the raw response for non-json operations. */
	responseType: "json" | "response";
}

type RequiredKeys<T> = {
	[K in keyof T]-?: Partial<Pick<T, K>> extends Pick<T, K> ? never : K;
}[keyof T];

type ParamsInput<T extends EndpointShape> = T extends { params: infer P } ? { params: P } : { params?: never };

type SearchParamsInput<T extends EndpointShape> = T extends { searchParams: infer S }
	? [RequiredKeys<S>] extends [never]
		? { searchParams?: S }
		: { searchParams: S }
	: { searchParams?: never };

type BodyInput<T extends EndpointShape> = T extends { body: infer B } ? { body: B } : { body?: never };

export type UrlInput<T extends EndpointShape> = ParamsInput<T> & SearchParamsInput<T>;

export type RequestInput<T extends EndpointShape> = UrlInput<T> &
	BodyInput<T> &
	Omit<RequestOptions, "body" | "method" | "responseType">;

/** The argument can be omitted entirely when every property of the input is optional. */
type Args<TInput> = Partial<TInput> extends TInput ? [input?: TInput] : [input: TInput];

export interface Endpoint<T extends EndpointShape> {
	/** The data slices this operation reads. Pass them to next.js' `cacheTag()` when caching a response. */
	cacheTags: () => ReadonlyArray<CacheTag>;
	/**
	 * Calls the operation. Errors are returned, not thrown, and the result is not serializable, so unwrap it inside a
	 * `"use cache"` boundary rather than returning it across one.
	 */
	request: (...args: Args<RequestInput<T>>) => Promise<RequestResult<T["response"]>>;
	/** The absolute url of the operation, e.g. for an image `src` attribute, or a download link. */
	url: (...args: Args<UrlInput<T>>) => URL;
}

type SearchParamsRecord = Parameters<typeof createUrlSearchParams>[0];

function serializePathname(template: string, params: Record<string, unknown> | undefined): string {
	return template.replaceAll(/\{(?<name>[^}]+)\}/g, (_match, name: string) => {
		const value = params?.[name];

		if (typeof value !== "string" && typeof value !== "number") {
			throw new TypeError(`Missing path parameter "${name}".`);
		}

		return encodeURIComponent(value);
	});
}

/**
 * The validated environment only carries server values on the server; in the browser the token is absent, and requests
 * count against the api's rate limit.
 */
function getAccessToken(): string | undefined {
	const token: string | undefined = env.API_ACCESS_TOKEN;
	return token;
}

export function defineEndpoint<T extends EndpointShape>(definition: EndpointDefinition): Endpoint<T> {
	const { cacheTags, method, pathname, responseType } = definition;

	function url(...args: Args<UrlInput<T>>): URL {
		const input = (args[0] ?? {}) as { params?: Record<string, unknown>; searchParams?: SearchParamsRecord };

		return createUrl({
			baseUrl: env.NEXT_PUBLIC_API_BASE_URL,
			pathname: serializePathname(pathname, input.params),
			searchParams: input.searchParams != null ? createUrlSearchParams(input.searchParams) : undefined,
		});
	}

	async function _request(...args: Args<RequestInput<T>>): Promise<RequestResult<T["response"]>> {
		const {
			body,
			params,
			searchParams,
			headers: _headers,
			...options
		} = (args[0] ?? {}) as RequestInput<T> & {
			params?: Record<string, unknown>;
			searchParams?: SearchParamsRecord;
		};

		const headers = new Headers(_headers);
		const token = getAccessToken();

		if (token != null) {
			headers.set("x-api-access-token", token);
		}

		const target = url(...([{ params, searchParams }] as Args<UrlInput<T>>));

		const result = await request(target, {
			...options,
			body: body as RequestOptions["body"],
			headers,
			method,
			responseType,
		});

		return result;
	}

	return {
		cacheTags: () => cacheTags,
		request: _request,
		url,
	};
}
