import { test as base } from "next/experimental/testmode/playwright.js";

/**
 * Mirrors the `inert` attribute to `aria-hidden`, on every element it is set on, removed from or inserted with. Runs in
 * the page, before any of its scripts.
 *
 * Only marked elements are un-hidden again, so an `aria-hidden` the page sets itself is left alone. Not covered: the
 * rest of the page going inert because of a modal `<dialog>`, which does not set the attribute.
 */
function mirrorInertToAriaHidden(): void {
	const marker = "data-e2e-inert";

	function sync(element: Element): void {
		if (element.hasAttribute("inert")) {
			if (element.getAttribute("aria-hidden") !== "true") {
				element.setAttribute("aria-hidden", "true");
				element.setAttribute(marker, "");
			}
		} else if (element.hasAttribute(marker)) {
			element.removeAttribute("aria-hidden");
			element.removeAttribute(marker);
		}
	}

	const observer = new MutationObserver((records) => {
		for (const record of records) {
			if (record.type === "attributes") {
				sync(record.target as Element);
			} else {
				for (const node of record.addedNodes) {
					if (node instanceof Element) {
						sync(node);
						for (const element of node.querySelectorAll("[inert]")) {
							sync(element);
						}
					}
				}
			}
		}
	});

	observer.observe(document, { attributeFilter: ["inert"], childList: true, subtree: true });
}

/**
 * Playwright's `test`, with `inert` elements hidden from its role queries and aria snapshots, as they are from
 * assistive technology. Playwright only takes `aria-hidden` into account, but react-aria hides content with `inert` -
 * e.g. everything outside an open modal.
 *
 * Extends next's experimental test mode, whose `next` fixture answers the server's own fetches with `next.onFetch`.
 * Only a test which uses that fixture is affected, and only against a server started with `E2E_TEST_PROXY=1`. Such a
 * test is skipped unless playwright runs with `E2E_TEST_PROXY=1` too: whether the server has the proxy cannot be told
 * from here, and without it a mocked request reaches the real api - e.g. a newsletter subscription.
 *
 * The proxy turns off the server's incremental cache, so `instant()` tests need a server without it - see
 * `tasks/05-e2e-known-issues.md`.
 *
 * @see https://github.com/microsoft/playwright/issues/36938
 */
export const test = base.extend({
	async context({ context }, use) {
		await context.addInitScript(mirrorInertToAriaHidden);
		await use(context);
	},
	async next({ next }, use, testInfo) {
		// oxlint-disable-next-line node/no-process-env
		const hasTestProxy = process.env.E2E_TEST_PROXY === "1";
		testInfo.skip(!hasTestProxy, "Needs next's test proxy: set `E2E_TEST_PROXY=1` for the server and for playwright.");
		await use(next);
	},
});

export { expect } from "@playwright/test";
