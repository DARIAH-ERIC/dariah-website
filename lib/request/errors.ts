import { TaggedError } from "better-result";

export class AbortError extends TaggedError("AbortError")<{
	readonly cause?: unknown;
	readonly message?: unknown;
	readonly request: Request;
}> {}

export class ParseError extends TaggedError("ParseError")<{
	readonly cause?: unknown;
	readonly message?: unknown;
	readonly request: Request;
	readonly response: Response;
}> {}

/**
 * `status` and `message` are derived from the response so they show up in logs, which only print own properties -
 * `Response` exposes its status through prototype getters.
 */
export class HttpError extends TaggedError("HttpError")<{
	readonly cause?: unknown;
	readonly message: string;
	readonly request: Request;
	readonly response: Response;
	readonly status: number;
}> {
	constructor(args: { cause?: unknown; request: Request; response: Response }) {
		const { request, response } = args;

		super({
			...args,
			message: `${String(response.status)} ${response.statusText} - ${request.method} ${request.url}`,
			status: response.status,
		});
	}
}

export class NetworkError extends TaggedError("NetworkError")<{
	readonly cause?: unknown;
	readonly message?: unknown;
	readonly request: Request;
}> {}

export class TimeoutError extends TaggedError("TimeoutError")<{
	readonly cause?: unknown;
	readonly message?: unknown;
	readonly request: Request;
}> {}

/**
 * A failure that maps to none of the errors above. The set is open-ended by nature - an invalid url or method,
 * malformed headers or body, whatever a caller-supplied `fetch` decides to throw, or a `TypeError` from `fetch` whose
 * message and code the network error checks do not recognise.
 *
 * It exists so the `catch` handler stays total: a handler that throws is a `Panic` in `better-result`, which escapes
 * the `Result` entirely and surfaces as an unhandled rejection.
 */
export class UnknownError extends TaggedError("UnknownError")<{
	readonly cause?: unknown;
	readonly message?: unknown;
	/** Absent when request construction failed. */
	readonly request?: Request;
}> {}

export type RequestError = AbortError | ParseError | HttpError | NetworkError | TimeoutError | UnknownError;
