import { fileURLToPath } from "node:url";

import nextEnv from "@next/env";
import { defineConfig, devices } from "@playwright/test";
import isInCi from "is-in-ci";
import * as v from "valibot";

import { client } from "#/configs/env.schema.ts";

const projectDir = fileURLToPath(new URL("..", import.meta.url));

const { combinedEnv } = nextEnv.loadEnvConfig(projectDir);
const env = v.parse(v.object({ NEXT_PUBLIC_APP_BASE_URL: client.entries.NEXT_PUBLIC_APP_BASE_URL }), combinedEnv);

export default defineConfig({
	expect: {
		toMatchAriaSnapshot: {
			pathTemplate: "{testDir}/snapshots/{testFilePath}-snapshots/{arg}{ext}",
		},
	},
	forbidOnly: isInCi,
	fullyParallel: true,
	maxFailures: isInCi ? 10 : 0,
	reporter: isInCi ? "github" : "html",
	retries: isInCi ? 2 : 0,
	snapshotPathTemplate: "{testDir}/snapshots/{testFilePath}-snapshots/{arg}{-projectName}{-platform}{ext}",
	testDir: ".",
	timeout: 30_000,
	use: {
		baseURL: env.NEXT_PUBLIC_APP_BASE_URL,
		screenshot: "on-first-failure",
		trace: "on-first-retry",
	},
	webServer: isInCi
		? undefined
		: {
				command: "bun run dev",
				cwd: projectDir,
				/**
				 * Enables `instant()` and next's test proxy, which `next.onFetch` needs. The tests which use the proxy only run
				 * with `E2E_TEST_PROXY=1` set for playwright as well, see `#/e2e/lib/test.ts`. An already running server must
				 * have both set itself.
				 */
				env: { EXPOSE_TESTING_API: "1", E2E_TEST_PROXY: "1" },
				reuseExistingServer: true,
				url: env.NEXT_PUBLIC_APP_BASE_URL,
			},
	workers: isInCi ? 1 : undefined,
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"], channel: "chrome" },
		},
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
	],
});
