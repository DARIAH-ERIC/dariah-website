import { describe, expect, test } from "bun:test";

import { request } from "#/lib/request/index.ts";

describe("request network errors", () => {
	test.each(["ConnectionRefused", "FailedToOpenSocket", "ECONNRESET", "ENOTFOUND", "ETIMEOUT", "EPIPE"])(
		"classifies Bun's %s error as NetworkError",
		async (code) => {
			const cause = Object.assign(new TypeError("Connection failed"), { code });
			const result = await request("https://example.com", {
				fetch: () => Promise.reject(cause),
				responseType: "void",
			});

			expect(result.isErr()).toBe(true);
			if (result.isErr()) {
				expect(result.error._tag).toBe("NetworkError");
				expect(result.error.cause).toBe(cause);
			}
		},
	);

	test("classifies Bun's idle Timeout error as TimeoutError", async () => {
		const cause = Object.assign(new TypeError("The operation timed out."), { code: "Timeout" });
		const result = await request("https://example.com", {
			fetch: () => Promise.reject(cause),
			responseType: "void",
		});

		expect(result.isErr()).toBe(true);
		if (result.isErr()) {
			expect(result.error._tag).toBe("TimeoutError");
			expect(result.error.cause).toBe(cause);
		}
	});

	test.each(["Failed to fetch", "NetworkError when attempting to fetch resource.", "fetch failed"])(
		"recognizes the %s Fetch message",
		async (message) => {
			const result = await request("https://example.com", {
				fetch: () => Promise.reject(new TypeError(message)),
				responseType: "void",
			});

			expect(result.isErr()).toBe(true);
			if (result.isErr()) {
				expect(result.error._tag).toBe("NetworkError");
			}
		},
	);

	test("keeps Safari's generic message restricted to errors without a stack", async () => {
		const networkCause = new TypeError("Load failed");
		networkCause.stack = undefined;
		const networkResult = await request("https://example.com", {
			fetch: () => Promise.reject(networkCause),
			responseType: "void",
		});
		const unknownResult = await request("https://example.com", {
			fetch: () => Promise.reject(new TypeError("Load failed")),
			responseType: "void",
		});

		expect(networkResult.isErr() && networkResult.error._tag).toBe("NetworkError");
		expect(unknownResult.isErr() && unknownResult.error._tag).toBe("UnknownError");
	});

	test("does not classify an unrelated TypeError code as a network failure", async () => {
		const result = await request("https://example.com", {
			fetch: () => Promise.reject(Object.assign(new TypeError("Invalid request"), { code: "ERR_INVALID_ARG_VALUE" })),
			responseType: "void",
		});

		expect(result.isErr()).toBe(true);
		if (result.isErr()) {
			expect(result.error._tag).toBe("UnknownError");
		}
	});

	test("returns an UnknownError when a rejected TypeError has a non-string message", async () => {
		const cause = Object.assign(new TypeError(), { message: null });
		const result = await request("https://example.com", {
			fetch: () => Promise.reject(cause),
			responseType: "void",
		});

		expect(result.isErr()).toBe(true);
		if (result.isErr()) {
			expect(result.error._tag).toBe("UnknownError");
			expect(result.error.cause).toBe(cause);
		}
	});
});

describe("request setup errors", () => {
	test("returns an UnknownError for an invalid URL before fetch is called", async () => {
		let calls = 0;
		const result = await request("not a url", {
			fetch: () => {
				calls++;
				return Promise.resolve(new Response());
			},
			responseType: "void",
		});

		expect(calls).toBe(0);
		expect(result.isErr()).toBe(true);
		if (result.isErr()) {
			expect(result.error._tag).toBe("UnknownError");
			expect(result.error.request).toBeUndefined();
		}
	});

	test("returns an UnknownError for invalid headers", async () => {
		const result = await request("https://example.com", {
			headers: { "bad header": "value" },
			responseType: "void",
		});

		expect(result.isErr()).toBe(true);
		if (result.isErr()) {
			expect(result.error._tag).toBe("UnknownError");
		}
	});
});

describe("default retry policy", () => {
	const retry = { backoff: "constant" as const, delayMs: 0, times: 2 };

	test.each([
		{ status: 400, expectedCalls: 1 },
		{ status: 404, expectedCalls: 1 },
		{ status: 408, expectedCalls: 3 },
		{ status: 429, expectedCalls: 3 },
		{ status: 503, expectedCalls: 3 },
	])("retries HTTP $status $expectedCalls time(s)", async ({ status, expectedCalls }) => {
		let calls = 0;
		const result = await request("https://example.com", {
			fetch: () => {
				calls++;
				return Promise.resolve(new Response(null, { status }));
			},
			responseType: "void",
			retry,
		});

		expect(result.isErr()).toBe(true);
		expect(calls).toBe(expectedCalls);
	});

	test("does not retry a caller abort", async () => {
		let calls = 0;
		const result = await request("https://example.com", {
			fetch: () => {
				calls++;
				return Promise.reject(new DOMException("Aborted", "AbortError"));
			},
			responseType: "void",
			retry,
		});

		expect(result.isErr()).toBe(true);
		expect(calls).toBe(1);
	});

	test("allows callers to override the retry policy", async () => {
		let calls = 0;
		await request("https://example.com", {
			fetch: () => {
				calls++;
				return Promise.resolve(new Response(null, { status: 400 }));
			},
			responseType: "void",
			retry: { ...retry, shouldRetry: () => true },
		});

		expect(calls).toBe(3);
	});
});
