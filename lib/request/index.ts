import { Result } from "better-result";

import {
	AbortError,
	HttpError,
	NetworkError,
	ParseError,
	type RequestError,
	TimeoutError,
	UnknownError,
} from "#/lib/request/errors.ts";

export type HttpMethod = "delete" | "get" | "head" | "options" | "patch" | "post" | "put" | "trace";

/**
 * Deliberately not `Bun.BodyInit`, whose extra body types only exist server-side, while this util also runs in the
 * browser. Cast at the call site if a server-only request ever needs them.
 *
 * @see {@link https://github.com/oven-sh/bun/blob/main/packages/bun-types/fetch.d.ts}
 */
export type RequestBody = BodyInit | JsonValue | null;

export interface ResponseData<TJsonData = unknown> {
	arrayBuffer: ArrayBuffer;
	blob: Blob;
	bytes: Uint8Array<ArrayBuffer>;
	formData: FormData;
	json: TJsonData;
	response: Response;
	stream: ReadableStream<Uint8Array<ArrayBuffer>> | null;
	text: string;
	void: null;
}

export type ResponseType = keyof ResponseData;

/** @see {@link https://github.com/oven-sh/bun/issues/23741#issuecomment-3410060027} */
type OriginalFetch = typeof globalThis.fetch extends (...args: infer A) => infer R ? (...args: A) => R : never;

export interface RequestOptions<TResponseType extends ResponseType = ResponseType> extends Omit<
	RequestInit,
	"body" | "method"
> {
	body?: RequestBody;
	fetch?: OriginalFetch;
	/** @default "get" */
	method?: HttpMethod;
	responseType: TResponseType;
	retry?: {
		backoff: "linear" | "constant" | "exponential";
		delayMs: number;
		shouldRetry?: (error: RequestError) => boolean;
		times: number;
	};
	/** @default 10_000 */
	timeout?: number | false;
}

export interface ResponseInfo<TData = unknown> {
	data: TData;
	headers: Headers;
}

export type RequestResult<TData = unknown> = Result<ResponseInfo<TData>, RequestError>;

/** When `method` is "head", the response body is always `null` regardless of `responseType`. */
export async function request(
	url: URL | string,
	options: RequestOptions & { method: "head" },
): Promise<RequestResult<null>>;

export async function request<TJsonData, TResponseType extends "json" = "json">(
	url: URL | string,
	options: RequestOptions<TResponseType>,
): Promise<RequestResult<ResponseData<TJsonData>[TResponseType]>>;

export async function request<TResponseType extends ResponseType>(
	url: URL | string,
	options: RequestOptions<TResponseType>,
): Promise<RequestResult<ResponseData[TResponseType]>>;

export async function request<TResponseType extends ResponseType>(
	url: URL | string,
	options: RequestOptions<TResponseType>,
): Promise<RequestResult<ResponseData[TResponseType]>> {
	const {
		body: _body,
		headers: _headers,
		fetch = globalThis.fetch,
		method: _method,
		responseType,
		retry,
		signal: _signal,
		timeout = 10_000,
		...rest
	} = options;

	function prepareRequest() {
		const method = (_method ?? "get").toUpperCase();

		const headers = new Headers(_headers);

		if (!headers.has("accept")) {
			if (responseType === "json") {
				headers.set("accept", "application/json");
			} else if (responseType === "text") {
				headers.set("accept", "text/plain");
			} else {
				headers.set("accept", "*/*");
			}
		}

		let body: RequestInit["body"] = null;

		if (_body !== undefined) {
			if (isJsonBody(_body)) {
				body = JSON.stringify(_body);

				if (!headers.has("content-type")) {
					headers.set("content-type", "application/json");
				}
			} else {
				body = _body;
			}
		}

		function createRequest(): Request {
			const timeoutSignal = timeout !== false ? AbortSignal.timeout(timeout) : null;
			const signal = _signal && timeoutSignal ? AbortSignal.any([_signal, timeoutSignal]) : (_signal ?? timeoutSignal);

			return new Request(String(url), { ...rest, body, headers, method, signal });
		}

		return { body, createRequest, method, request: createRequest() };
	}

	/**
	 * A request body can only be read once, so retries need a new `Request`. The timeout is per attempt for the same
	 * reason - its `AbortSignal` is part of the request. Setup errors have no valid `Request` to attach to the result.
	 */
	const prepared = Result.try({
		try: prepareRequest,
		catch: (cause) => new UnknownError({ cause }),
	});

	if (prepared.isErr()) {
		return prepared;
	}

	const { body, createRequest, method } = prepared.value;
	let { request } = prepared.value;

	/**
	 * Reading a response body can fail for reasons unrelated to the request itself: the connection dropped mid-stream, a
	 * multipart body is malformed, the payload is too large to allocate. They all mean the same thing - the response
	 * arrived but could not be decoded - which is exactly what `ParseError` describes.
	 */
	async function readBody<TData>(response: Response, read: () => Promise<TData>): Promise<TData> {
		try {
			return await read();
		} catch (error) {
			throw new ParseError({ cause: error, request, response });
		}
	}

	/**
	 * Only a `ReadableStream` body cannot be sent twice - every other `BodyInit` is read afresh when the next `Request`
	 * is constructed from it. Retrying a streamed body therefore throws while building the retry, which would replace the
	 * real failure (the 500, the timeout) with a confusing one about a disturbed body, so such a request is not retried
	 * at all.
	 */
	const isReplayable = !(body instanceof ReadableStream);

	const retryConfig =
		retry != null && isReplayable ? { ...retry, shouldRetry: retry.shouldRetry ?? isRetryableByDefault } : undefined;

	return Result.tryPromise(
		{
			try: async ({ attempt }) => {
				if (attempt > 1) {
					request = createRequest();
				}

				const response = await fetch(request);

				if (!response.ok) {
					throw new HttpError({ request, response });
				}

				if (method === "HEAD") {
					const data = null;
					return { data, headers: response.headers };
				}

				switch (responseType) {
					case "arrayBuffer": {
						const data = await readBody(response, () => response.arrayBuffer());
						return { data, headers: response.headers };
					}

					case "blob": {
						const data = await readBody(response, () => response.blob());
						return { data, headers: response.headers };
					}

					case "bytes": {
						const data = await readBody(response, () => response.bytes());
						return { data, headers: response.headers };
					}

					case "formData": {
						const data = await readBody(response, () => response.formData());
						return { data, headers: response.headers };
					}

					case "json": {
						if (response.status === 204 || response.headers.get("content-length") === "0") {
							await discardBody(response);
							const data = null;
							return { data, headers: response.headers };
						}

						// oxlint-disable-next-line typescript/no-unsafe-assignment
						const data = await readBody(response, () => response.json());
						// oxlint-disable-next-line typescript/no-unsafe-assignment
						return { data, headers: response.headers };
					}

					case "response": {
						const data = response;
						return { data, headers: response.headers };
					}

					case "stream": {
						const data = response.body;
						return { data, headers: response.headers };
					}

					case "text": {
						const data = await readBody(response, () => response.text());
						return { data, headers: response.headers };
					}

					case "void": {
						await discardBody(response);
						const data = null;
						return { data, headers: response.headers };
					}
				}
			},
			catch: (cause) => {
				/**
				 * `Error.isError` returns false for `DOMException` in Bun (e.g. the `TimeoutError` thrown by
				 * `AbortSignal.timeout()`), so we use `instanceof` instead.
				 *
				 * @see {@link https://github.com/oven-sh/bun/issues/15821}
				 */
				// oxlint-disable-next-line unicorn/no-instanceof-builtins
				if (cause instanceof Error) {
					if (HttpError.is(cause)) {
						return cause;
					}

					if (ParseError.is(cause)) {
						return cause;
					}

					if (cause.name === "AbortError") {
						return new AbortError({ cause, request });
					}

					/** Bun rejects with a `TypeError` with code `Timeout` when its socket idle timeout fires. */
					if (
						cause.name === "TimeoutError" ||
						(cause.name === "TypeError" && "code" in cause && cause.code === "Timeout")
					) {
						return new TimeoutError({ cause, request });
					}

					if (isNetworkError(cause)) {
						return new NetworkError({ cause, request });
					}
				}

				return new UnknownError({ cause, request });
			},
		},
		{
			retry: retryConfig,
			signal: _signal ?? undefined,
		},
	);
}

/**
 * Fetch network errors vary by runtime. Message cases adapted from `is-network-error` (MIT); Bun also exposes socket
 * and DNS codes. Keep this check narrow to avoid treating invalid requests as network failures.
 *
 * @see {@link https://github.com/sindresorhus/is-network-error}
 */
function isNetworkError(error: Error): boolean {
	if (error.name !== "TypeError") {
		return false;
	}

	const code = "code" in error ? error.code : undefined;

	/**
	 * Only Bun sets `code` on the rejected `TypeError`; Node puts it on `cause` and is matched by message below.
	 *
	 * - `ConnectionRefused`: connect failed (refused, unreachable).
	 * - `FailedToOpenSocket`: socket could not be opened.
	 * - `ECONNRESET`: connection closed unexpectedly.
	 * - `ENOTFOUND`, `ETIMEOUT`: DNS lookup failed (unknown host, temporary resolver failure).
	 * - `EPIPE`: sendfile upload of a `Bun.file()` request body failed.
	 */
	switch (code) {
		case "ConnectionRefused":
		case "FailedToOpenSocket":
		case "ECONNRESET":
		case "ENOTFOUND":
		case "ETIMEOUT":
		case "EPIPE": {
			return true;
		}
	}

	const { message, stack } = error;
	if (typeof message !== "string") {
		return false;
	}

	if (message === "Load failed" || (message.startsWith("Load failed (") && message.endsWith(")"))) {
		return stack === undefined || "__sentry_captured__" in error;
	}

	if (message.startsWith("error sending request for url")) {
		return true;
	}

	if (message === "Failed to fetch" || (message.startsWith("Failed to fetch (") && message.endsWith(")"))) {
		return true;
	}

	switch (message) {
		case "network error":
		case "NetworkError when attempting to fetch resource.":
		case "The Internet connection appears to be offline.":
		case "Network request failed":
		case "fetch failed":
		case "terminated":
		case " A network error occurred.":
		case "Network connection lost": {
			return true;
		}
		default: {
			return false;
		}
	}
}

/**
 * Release the body of a response whose content we discard, so its connection can go back to the pool instead of being
 * held open by an unread body. This is cleanup, not part of the result: a body that is already disturbed or locked has
 * nothing left to release, so a failure here says nothing about whether the request succeeded and must not be reported
 * as if it did.
 */
async function discardBody(response: Response): Promise<void> {
	try {
		await response.body?.cancel();
	} catch {
		/** Already released - which is the outcome we wanted anyway. */
	}
}

/**
 * Retry connection failures, timeouts, parse failures, server errors, and HTTP 408/429. Caller aborts, malformed
 * requests, and ordinary client errors cannot be resolved by repeating the same request.
 */
function isRetryableByDefault(error: RequestError): boolean {
	if (AbortError.is(error) || UnknownError.is(error)) {
		return false;
	}

	if (HttpError.is(error)) {
		const { status } = error.response;
		return status === 408 || status === 429 || status >= 500;
	}

	return true;
}

type JsonPrimitive = string | number | boolean | null | undefined;
type JsonValue = JsonPrimitive | Array<JsonValue> | { [key: string]: JsonValue };

function isJsonBody(body: unknown): body is JsonValue {
	if (typeof body === "number" || typeof body === "boolean") {
		return true;
	}

	/** `null` means "no body", not the json literal `null`. */
	if (typeof body !== "object" || body === null) {
		return false;
	}

	if (Array.isArray(body)) {
		return true;
	}

	const prototype = Object.getPrototypeOf(body) as object | null;

	return prototype === Object.prototype || prototype === null;
}
