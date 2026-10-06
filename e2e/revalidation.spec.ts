import { fileURLToPath } from "node:url";

import nextEnv from "@next/env";

import { expect, test } from "#/e2e/lib/test.ts";

const projectDir = fileURLToPath(new URL("..", import.meta.url));

/** The secret the server was started with, read from the same environment files. */
const { combinedEnv } = nextEnv.loadEnvConfig(projectDir);
const secret = combinedEnv.REVALIDATION_WEBHOOK_SECRET;

const pathname = "/api/revalidate";

/**
 * Without a secret the webhook answers `404`, which would take a server started without one; the tests below need a
 * secret, so they are skipped when there is none.
 */
test.describe("revalidation webhook", () => {
	// oxlint-disable-next-line playwright/no-skipped-test -- Depends on the server's environment, which a test cannot set.
	test.skip(secret == null || secret === "", "`REVALIDATION_WEBHOOK_SECRET` is not set.");

	test("rejects a request without the secret", async ({ request }) => {
		const response = await request.post(pathname, { data: { tags: ["news"] } });

		expect(response.status()).toBe(401);
	});

	test("rejects a request with a wrong secret", async ({ request }) => {
		const response = await request.post(pathname, {
			data: { tags: ["news"] },
			headers: { authorization: `Bearer ${"x".repeat(secret?.length ?? 0)}` },
		});

		expect(response.status()).toBe(401);
	});

	test("rejects a payload without known tags", async ({ request }) => {
		const headers = { authorization: `Bearer ${secret!}` };

		const payloads = [{}, { tags: [] }, { tags: ["news", "unknown"] }, "news"];
		const responses = await Promise.all(payloads.map((data) => request.post(pathname, { data, headers })));

		expect(responses.map((response) => response.status())).toStrictEqual([400, 400, 400, 400]);
	});

	/**
	 * The news list is read from the api's announcements, which are tagged `news`, and cached across requests. Under
	 * `next dev` cached functions run on every request anyway, so there is nothing to expire, and the test is skipped.
	 */
	test("expires the tagged api data, so the next request refetches it", async ({ page, next, request }) => {
		const fetched: Array<string> = [];
		next.onFetch((fetchRequest) => {
			fetched.push(new URL(fetchRequest.url).pathname);
			return "continue";
		});

		const endpoint = "/api/v1/announcements";

		async function visit(): Promise<void> {
			fetched.length = 0;
			await page.goto("/news");
			await expect(page.getByRole("main").getByRole("article").first()).toBeVisible();
		}

		/** The first visit fills the cache, if it is empty. */
		await visit();
		await visit();
		// oxlint-disable-next-line playwright/no-skipped-test -- Depends on how the server was started, which a test cannot set.
		test.skip(fetched.includes(endpoint), "The server does not cache across requests, e.g. under `next dev`.");

		const response = await request.post(pathname, {
			data: { tags: ["news", "news"] },
			headers: { authorization: `Bearer ${secret!}` },
		});

		expect(response.status()).toBe(200);
		expect(await response.json()).toStrictEqual({ revalidated: true, tags: ["news"] });

		await visit();
		expect(fetched).toContain(endpoint);
	});
});
