import type { Locator } from "@playwright/test";

import { expect } from "#/e2e/lib/test.ts";

/**
 * Waits until react has hydrated an element. Server-rendered content is visible and interactive before the client
 * bundle has run, and input until then can be lost: webkit, under load, then never fires the element's handlers. React
 * marks each node it has hydrated with a `__reactFiber$…` property. A cold webkit takes up to 10s to hydrate.
 */
export async function waitForHydration(locator: Locator): Promise<void> {
	await expect
		.poll(() => locator.evaluate((element) => Object.keys(element).some((key) => key.startsWith("__reactFiber"))), {
			timeout: 15_000,
		})
		.toBe(true);
}
