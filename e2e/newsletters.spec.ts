import type { Locator, Page } from "@playwright/test";
import type { NextFixture } from "next/experimental/testmode/playwright.js";

import { expect, test } from "#/e2e/lib/test.ts";

/**
 * The subscribe form, on the newsletters page and in the footer of every page.
 *
 * The server action sends the subscription to the api from the server, so the api's answer is given with next's test
 * proxy (`next.onFetch`), not `page.route()`. Every other fetch of the server passes through to the api. Addresses are
 * on `example.com`, which no mailing list accepts, in case a server without the test proxy sends one for real.
 */
const forms = [
	{
		name: "on the newsletters page",
		pathname: "/newsletters",
		landmark: (page: Page): Locator => page.getByRole("main"),
	},
	{ name: "in the footer", pathname: "/", landmark: (page: Page): Locator => page.getByRole("contentinfo") },
];

/** Answers the api's subscribe endpoint with `respond`, and records the email address of each subscription it receives. */
function mockSubscribe(next: NextFixture, respond: () => Response | Promise<Response>): Array<string> {
	const subscriptions: Array<string> = [];

	next.onFetch(async (request) => {
		if (request.method !== "POST" || new URL(request.url).pathname !== "/api/v1/newsletters/subscribe") {
			return "continue";
		}

		const body = (await request.json()) as { email: string };
		subscriptions.push(body.email);

		return respond();
	});

	return subscriptions;
}

for (const { name, pathname, landmark } of forms) {
	test.describe(`newsletter subscription ${name}`, () => {
		test("subscribes a valid email address, replacing the form with a confirmation", async ({ page, next }) => {
			/** Held back until the pending state has been checked. */
			const { promise: answered, resolve: answer } = Promise.withResolvers<undefined>();
			const subscriptions = mockSubscribe(next, async () => {
				await answered;
				return Response.json({ email: "subscriber@example.com" }, { status: 201 });
			});

			await page.goto(pathname);

			const form = landmark(page);
			const email = form.getByRole("textbox", { name: "Email address" });

			/** Surrounding whitespace is trimmed before the address is sent. */
			await email.fill(" subscriber@example.com ");
			await form.getByRole("button", { name: "Subscribe" }).click();

			await expect(form.getByRole("button", { name: "Subscribing…" })).toBeDisabled();
			answer(undefined);

			await expect(form.getByRole("status")).toHaveText(
				"Thank you! Please check your inbox to confirm your subscription.",
			);
			await expect(email).toBeHidden();
			await expect(form.getByRole("alert")).toBeEmpty();
			expect(subscriptions).toStrictEqual(["subscriber@example.com"]);
		});

		test("tells an address which is already subscribed", async ({ page, next }) => {
			mockSubscribe(next, () => Response.json({ message: "Conflict" }, { status: 409 }));

			await page.goto(pathname);

			const form = landmark(page);
			const email = form.getByRole("textbox", { name: "Email address" });

			await email.fill("subscriber@example.com");
			await form.getByRole("button", { name: "Subscribe" }).click();

			await expect(form.getByRole("alert")).toHaveText("This email address is already subscribed.");
			await expect(email).toHaveValue("subscriber@example.com");
			await expect(email).toHaveAttribute("aria-invalid", "true");
		});

		test("asks to try again later when the api fails", async ({ page, next }) => {
			mockSubscribe(next, () => Response.json({ message: "Internal Server Error" }, { status: 500 }));

			await page.goto(pathname);

			const form = landmark(page);
			const email = form.getByRole("textbox", { name: "Email address" });

			await email.fill("subscriber@example.com");
			await form.getByRole("button", { name: "Subscribe" }).click();

			await expect(form.getByRole("alert")).toHaveText("Subscribing failed. Please try again later.");
			await expect(email).toHaveValue("subscriber@example.com");
			await expect(form.getByRole("button", { name: "Subscribe" })).toBeEnabled();
		});

		test("rejects an invalid email address without sending it to the api", async ({ page, next }) => {
			const subscriptions = mockSubscribe(next, () => Response.json({ email: "" }, { status: 201 }));

			await page.goto(pathname);

			const form = landmark(page);
			const email = form.getByRole("textbox", { name: "Email address" });

			/** Passes the browser's own `type="email"` check, which allows an address without a top-level domain. */
			await email.fill("subscriber@example");
			await form.getByRole("button", { name: "Subscribe" }).click();

			const message = "Please provide a valid email address.";

			await expect(form.getByRole("alert")).toHaveText(message);
			await expect(email).toHaveValue("subscriber@example");
			await expect(email).toHaveAttribute("aria-invalid", "true");
			await expect(email).toHaveAccessibleDescription(message);
			await expect(form.getByRole("status")).toBeEmpty();
			expect(subscriptions).toStrictEqual([]);
		});
	});
}
