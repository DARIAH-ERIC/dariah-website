import { expect, test } from "#/e2e/lib/test.ts";

/**
 * Route handlers outside the pages: feeds, calendar files, health checks and open graph images. Their content comes
 * from the api, so these tests check its shape, not its entries.
 */

test.describe("feeds", () => {
	/**
	 * A page which sets `alternates` of its own, e.g. its canonical, replaces the root layout's as a whole, so the feeds
	 * have to be added back - see `createAlternates`. The home page sets its metadata itself, `/news` through
	 * `createMetadata`, and `/search` is `noindex`, without a canonical.
	 */
	for (const { pathname, canonical } of [
		{ pathname: "/", canonical: "/" },
		{ pathname: "/news", canonical: "/news" },
		{ pathname: "/search", canonical: null },
	]) {
		test(`are advertised on ${pathname}, next to its canonical url`, async ({ page }) => {
			await page.goto(pathname);

			const head = await page.evaluate(() => {
				// oxlint-disable-next-line unicorn/consistent-function-scoping -- Runs in the browser, where only this scope exists.
				function getPathname(link: Element): string {
					return new URL(link.getAttribute("href")!, document.baseURI).pathname;
				}

				const canonicalLink = document.head.querySelector('link[rel="canonical"]');

				return {
					feeds: Array.from(
						document.head.querySelectorAll('link[rel="alternate"][type="application/rss+xml"]'),
						getPathname,
					),
					canonical: canonicalLink != null ? getPathname(canonicalLink) : null,
				};
			});

			expect(head.feeds.toSorted()).toStrictEqual(["/feeds/events.xml", "/feeds/news.xml"]);
			expect(head.canonical).toBe(canonical);
		});
	}

	for (const { pathname, title } of [
		{ pathname: "/feeds/news.xml", title: /: News$/ },
		{ pathname: "/feeds/events.xml", title: /: Events$/ },
	]) {
		test(`${pathname} is an rss feed whose items link to pages of the site`, async ({ page, request, baseURL }) => {
			const response = await request.get(pathname);

			expect(response.status()).toBe(200);
			expect(response.headers()["content-type"]).toBe("application/rss+xml; charset=utf-8");

			/** Parsed in the browser, which has an xml parser. */
			await page.goto("/");
			const feed = await page.evaluate(
				(xml) => {
					const document = new DOMParser().parseFromString(xml, "application/xml");

					return {
						isWellFormed: document.querySelector("parsererror") == null,
						root: document.documentElement.nodeName,
						title: document.querySelector("channel > title")?.textContent ?? null,
						links: Array.from(document.querySelectorAll("channel > item > link"), (link) => link.textContent),
					};
				},
				await response.text(),
			);

			expect(feed.isWellFormed).toBe(true);
			expect(feed.root).toBe("rss");
			expect(feed.title).toMatch(title);
			expect(feed.links.length).toBeGreaterThan(0);
			expect(feed.links.length).toBeLessThanOrEqual(20);
			for (const link of feed.links) {
				expect(link).toMatch(new RegExp(`^${baseURL!}/`));
			}

			const first = await request.get(feed.links[0]!);
			expect(first.status()).toBe(200);
		});
	}
});

test.describe("/events/[slug]/calendar.ics", () => {
	test("downloads an event as a calendar file from the event page", async ({ page, baseURL }) => {
		await page.goto("/events");
		const event = page.getByRole("main").getByRole("article").first().getByRole("link").first();
		await event.click();
		await expect(page).toHaveURL(/\/events\/[^/?]+$/);

		const slug = new URL(page.url()).pathname.split("/").at(-1)!;

		const download = page.waitForEvent("download");
		await page.getByRole("link", { name: "Add to calendar" }).click();
		expect((await download).suggestedFilename()).toBe(`${slug}.ics`);

		const response = await page.request.get(`/events/${slug}/calendar.ics`);

		expect(response.status()).toBe(200);
		expect(response.headers()["content-type"]).toBe("text/calendar; charset=utf-8");
		expect(response.headers()["content-disposition"]).toBe(`attachment; filename="${slug}.ics"`);

		/** Lines are folded at 75 octets, so the url is matched on the unfolded text. */
		const text = (await response.text()).replaceAll(/\r\n[ \t]/g, "");
		expect(text).toMatch(/^BEGIN:VCALENDAR\r\n/);
		expect(text).toMatch(/\r\nEND:VCALENDAR(?:\r\n)?$/);
		expect(text.match(/\r\nBEGIN:VEVENT\r\n/g)).toHaveLength(1);
		expect(text).toContain(`\r\nURL:${baseURL!}/events/${slug}\r\n`);
	});

	test("answers an unknown event with a 404", async ({ request }) => {
		const response = await request.get("/events/e2e-this-slug-does-not-exist/calendar.ics");

		expect(response.status()).toBe(404);
	});
});

test.describe("/feeds/events.ics", () => {
	test("is a calendar feed whose events link to pages of the site", async ({ request, baseURL }) => {
		const response = await request.get("/feeds/events.ics");

		expect(response.status()).toBe(200);
		expect(response.headers()["content-type"]).toBe("text/calendar; charset=utf-8");

		/** Lines are folded at 75 octets, so the urls are matched on the unfolded text. */
		const text = (await response.text()).replaceAll(/\r\n[ \t]/g, "");
		expect(text).toMatch(/^BEGIN:VCALENDAR\r\n/);
		expect(text).toMatch(/\r\nEND:VCALENDAR(?:\r\n)?$/);
		expect(text).toMatch(/\r\nX-WR-CALNAME:.+: Events\r\n/);

		/** An event's url is its last property. */
		const events = text.match(/\r\nBEGIN:VEVENT\r\n/g) ?? [];
		const links = Array.from(text.matchAll(/\r\nURL:(?<url>\S+)\r\nEND:VEVENT\r\n/g), (match) => match.groups!.url!);
		expect(events.length).toBeGreaterThan(0);
		expect(links).toHaveLength(events.length);
		for (const link of links) {
			expect(link).toMatch(new RegExp(`^${baseURL!}/events/[^/]+$`));
		}

		const first = await request.get(links[0]!);
		expect(first.status()).toBe(200);
	});

	test("is where the legacy website's calendar feed redirects to", async ({ request }) => {
		const response = await request.get("/events/?ical=1");

		expect(response.status()).toBe(200);
		expect(new URL(response.url()).pathname).toBe("/feeds/events.ics");
		expect(response.headers()["content-type"]).toBe("text/calendar; charset=utf-8");
	});
});

test.describe("health checks", () => {
	for (const pathname of ["/health/live", "/health/ready"]) {
		test(`${pathname} reports the app as up`, async ({ request }) => {
			const response = await request.get(pathname);

			expect(response.status()).toBe(200);
			expect(await response.json()).toStrictEqual({ status: "ok" });
		});
	}
});

test.describe("/og-images/[prefix]/[name]/[version]", () => {
	/** Only svgs the api holds are rendered, so the route cannot be used to render arbitrary assets. */
	test("answers anything but an svg from the api with a 404", async ({ request }) => {
		const responses = await Promise.all(
			[
				"/og-images/unknown/e2e.svg/v1",
				"/og-images/logos/e2e.svg/v2",
				"/og-images/logos/e2e-this-asset-does-not-exist.svg/v1",
			].map((pathname) => request.get(pathname)),
		);

		expect(responses.map((response) => response.status())).toStrictEqual([404, 404, 404]);
	});
});
