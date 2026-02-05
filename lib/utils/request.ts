import { Result, TaggedError, UnhandledException } from "better-result";
import isNetworkError from "is-network-error";

export type HttpMethod = "delete" | "get" | "head" | "options" | "patch" | "post" | "put" | "trace";

export type RequestBody = BodyInit | JsonValue | null;

export type ResponseType =
	| "arrayBuffer"
	| "blob"
	| "bytes"
	| "formData"
	| "json"
	| "response"
	| "stream"
	| "text"
	| "void";

export interface RequestOptions<TResponseType extends ResponseType = ResponseType> extends Omit<
	RequestInit,
	"body" | "method"
> {
	body?: RequestBody;
	fetch?: typeof globalThis.fetch;
	/** @default "get" */
	method?: HttpMethod;
	responseType: TResponseType;
	retry?: {
		backoff: "linear" | "constant" | "exponential";
		delayMs: number;
		shouldRetry?: (error: RequestError | UnhandledException) => boolean;
		times: number;
	};
	/** @default 10_000 */
	timeout?: number | false;
}

export class AbortError extends TaggedError("AbortError")<{
	cause?: unknown;
	request: Request;
}>() {}

export class ParseError extends TaggedError("ParseError")<{
	cause?: unknown;
	request: Request;
	response: Response;
}>() {}

export class HttpError extends TaggedError("HttpError")<{
	cause?: unknown;
	request: Request;
	response: Response;
}>() {}

export class NetworkError extends TaggedError("NetworkError")<{
	cause?: unknown;
	request: Request;
}>() {}

export class TimeoutError extends TaggedError("TimeoutError")<{
	cause?: unknown;
	request: Request;
}>() {}

export type RequestError = AbortError | ParseError | HttpError | NetworkError | TimeoutError;

export type RequestResult<TData = unknown> = Result<
	{ data: TData; headers: Headers },
	RequestError | UnhandledException
>;

export async function request(
	url: URL | string,
	options: RequestOptions<"arrayBuffer">,
): Promise<RequestResult<ArrayBuffer>>;

export async function request(
	url: URL | string,
	options: RequestOptions<"blob">,
): Promise<RequestResult<Blob>>;

export async function request(
	url: URL | string,
	options: RequestOptions<"bytes">,
): Promise<RequestResult<Uint8Array<ArrayBuffer>>>;

/** @deprecated */
export async function request(
	url: URL | string,
	options: RequestOptions<"formData">,
): Promise<RequestResult<FormData>>;

export async function request<TData = unknown>(
	url: URL | string,
	options: RequestOptions<"json">,
): Promise<RequestResult<TData>>;

export async function request(
	url: URL | string,
	options: RequestOptions<"response">,
): Promise<RequestResult<Response>>;

export async function request(
	url: URL | string,
	options: RequestOptions<"stream">,
): Promise<RequestResult<ReadableStream<Uint8Array<ArrayBuffer>> | null>>;

export async function request(
	url: URL | string,
	options: RequestOptions<"text">,
): Promise<RequestResult<string>>;

export async function request(
	url: URL | string,
	options: RequestOptions<"void">,
): Promise<RequestResult<null>>;

export async function request(url: URL | string, options: RequestOptions): Promise<RequestResult> {
	const {
		body: _body,
		headers: _headers,
		method: _method,
		responseType,
		retry,
		signal: _signal,
		timeout = 10_000,
		...rest
	} = options;

	const method = _method?.toUpperCase();

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

	let body: BodyInit | null = null;

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

	const timeoutSignal = timeout !== false ? AbortSignal.timeout(timeout) : null;
	const signal =
		_signal && timeoutSignal
			? AbortSignal.any([_signal, timeoutSignal])
			: (_signal ?? timeoutSignal);

	const request = new Request(String(url), { ...rest, body, headers, method, signal });

	return Result.tryPromise(
		{
			async try() {
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
						const data = await response.arrayBuffer();
						return { data, headers: response.headers };
					}

					case "blob": {
						const data = await response.blob();
						return { data, headers: response.headers };
					}

					case "bytes": {
						const data = await response.bytes();
						return { data, headers: response.headers };
					}

					case "formData": {
						// oxlint-disable-next-line typescript/no-deprecated
						const data = await response.formData();
						return { data, headers: response.headers };
					}

					case "json": {
						if (response.status === 204 || response.headers.get("content-length") === "0") {
							await response.body?.cancel();
							const data = null;
							return { data, headers: response.headers };
						}

						try {
							const data = await response.json();
							return { data, headers: response.headers };
						} catch (error) {
							throw new ParseError({ cause: error, request, response });
						}
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
						const data = await response.text();
						return { data, headers: response.headers };
					}

					case "void": {
						await response.body?.cancel();
						const data = null;
						return { data, headers: response.headers };
					}
				}
			},
			catch(error) {
				if (error instanceof Error) {
					if (HttpError.is(error)) {
						return error;
					}

					if (ParseError.is(error)) {
						return error;
					}

					if (error.name === "AbortError") {
						return new AbortError({ cause: error, request });
					}

					if (error.name === "TimeoutError") {
						return new TimeoutError({ cause: error, request });
					}

					if (isNetworkError(error)) {
						return new NetworkError({ cause: error, request });
					}
				}

				return new UnhandledException({ cause: error });
			},
		},
		{
			retry,
		},
	);
}

type JsonPrimitive = string | number | boolean | null | undefined;
type JsonValue = JsonPrimitive | Array<JsonValue> | { [key: string]: JsonValue };

function isJsonBody(body: unknown): body is JsonValue {
	if (body === null) {
		return true;
	}

	if (typeof body !== "object") {
		return false;
	}

	if (
		// oxlint-disable-next-line unicorn/no-instanceof-builtins
		body instanceof ArrayBuffer ||
		body instanceof Blob ||
		body instanceof FormData ||
		body instanceof ReadableStream ||
		body instanceof URLSearchParams
	) {
		return false;
	}

	return true;
}
