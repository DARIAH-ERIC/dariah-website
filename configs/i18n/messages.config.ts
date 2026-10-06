/**
 * Configuration for the message catalogs and their extraction from source code.
 *
 * This must stay free of runtime dependencies - type-only imports are fine, because they are erased - since it is
 * shared between `next.config.ts`, where the `next-intl` plugin extracts and precompiles messages, and
 * `.eloqnt/config.ts`, where the `eloqnt` cli lints and translates them.
 *
 * For the locales supported by the app itself, see `configs/i18n/locales.config.ts`.
 */

import type { defineConfig } from "@eloqnt/cli";
import type createNextIntlPlugin from "next-intl/plugin";

/**
 * Neither package exports the type of its own config, so both are derived from the function that accepts them. The
 * values below are declared as the intersection of the two, which is what keeps them usable by both tools.
 */
type EloqntConfig = Parameters<typeof defineConfig>[0];

type NextIntlConfig = NonNullable<Extract<Parameters<typeof createNextIntlPlugin>[0], object>["experimental"]>;

type SharedConfig = EloqntConfig & NextIntlConfig;

export const messages = {
	format: "po",
	locales: "infer",
	path: "./messages",
	sourceLocale: "en",
} satisfies SharedConfig["messages"];

export const srcPath = ["./app", "./components", "./lib"] satisfies NonNullable<SharedConfig["srcPath"]>;
