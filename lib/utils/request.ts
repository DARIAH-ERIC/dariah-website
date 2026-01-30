import { Result, TaggedError } from "better-result";
import isNetworkError from "is-network-error";

export class AbortError extends TaggedError("AbortError")<{
	cause?: Error;
	request: Request;
}>() {}

export class HttpError extends TaggedError("HttpError")<{
	cause?: Error;
	request: Request;
	response: Response;
}>() {}

export class NetworkError extends TaggedError("NetworkError")<{
	cause?: Error;
	request: Request;
}>() {}

export class TimeoutError extends TaggedError("TimeoutError")<{
	cause?: Error;
	request: Request;
}>() {}

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
	/** @default 10_000 */
	timeout?: number | false;
}

export type RequestError = AbortError | HttpError | NetworkError | TimeoutError;

export type RequestResult<TData = unknown> = Result<
	{ data: TData; headers: Headers },
	RequestError
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

	const request = new Request(url, { ...rest, body, headers, method, signal });

	try {
		const response = await fetch(request);

		if (!response.ok) {
			return Result.err(new HttpError({ request, response }));
		}

		if (method === "HEAD") {
			const data = null;
			return Result.ok({ data, headers: response.headers });
		}

		switch (responseType) {
			case "arrayBuffer": {
				const data = await response.arrayBuffer();
				const headers = response.headers;
				return Result.ok({ data, headers });
			}

			case "blob": {
				const data = await response.blob();
				const headers = response.headers;
				return Result.ok({ data, headers });
			}

			case "bytes": {
				const data = await response.bytes();
				const headers = response.headers;
				return Result.ok({ data, headers });
			}

			case "formData": {
				const data = await response.formData();
				const headers = response.headers;
				return Result.ok({ data, headers });
			}

			case "json": {
				if (response.status === 204 || response.headers.get("content-length") === "0") {
					await response.body?.cancel();
					const data = null;
					const headers = response.headers;
					return Result.ok({ data, headers });
				}

				const data = (await response.json()) as unknown;
				const headers = response.headers;
				return Result.ok({ data, headers });
			}

			case "response": {
				const data = response;
				const headers = response.headers;
				return Result.ok({ data, headers });
			}

			case "stream": {
				const data = response.body;
				const headers = response.headers;
				return Result.ok({ data, headers });
			}

			case "text": {
				const data = await response.text();
				const headers = response.headers;
				return Result.ok({ data, headers });
			}

			case "void": {
				await response.body?.cancel();
				const data = null;
				const headers = response.headers;
				return Result.ok({ data, headers });
			}
		}
	} catch (error) {
		if (!(error instanceof Error)) {
			throw error;
		}

		if (error.name === "AbortError") {
			return Result.err(new AbortError({ cause: error, request }));
		}

		if (error.name === "TimeoutError") {
			return Result.err(new TimeoutError({ cause: error, request }));
		}

		if (isNetworkError(error)) {
			return Result.err(new NetworkError({ cause: error, request }));
		}

		throw error;
	}
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
