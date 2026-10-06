import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { createUrl, log } from "@acdh-oeaw/lib";
import nextEnv from "@next/env";
import { createConfig, lintFromString } from "@redocly/openapi-core";
import * as v from "valibot";

import { client } from "#/configs/env.schema.ts";
import { type Document, emit } from "#/scripts/openapi/emit.ts";

const projectDir = fileURLToPath(new URL("../..", import.meta.url));

/**
 * This runs in the `prepare` lifecycle script, i.e. on a fresh clone, before a local `.env.local` exists. We therefore
 * only validate the two values this script actually needs, instead of the app's full environment.
 */
const { combinedEnv } = nextEnv.loadEnvConfig(projectDir);
const env = v.parse(
	v.object({
		NEXT_PUBLIC_API_BASE_URL: client.entries.NEXT_PUBLIC_API_BASE_URL,
		NEXT_PUBLIC_API_OPENAPI_PATHNAME: client.entries.NEXT_PUBLIC_API_OPENAPI_PATHNAME,
	}),
	combinedEnv,
);

const url = createUrl({ baseUrl: env.NEXT_PUBLIC_API_BASE_URL, pathname: env.NEXT_PUBLIC_API_OPENAPI_PATHNAME });

const outputDir = path.join(projectDir, "lib", "api");
const outputFiles = {
	endpoints: path.join(outputDir, "endpoints.ts"),
	schemas: path.join(outputDir, "schemas.ts"),
};

/**
 * The emitter assumes a structurally valid document, so everything it relies on - resolvable references, unique and
 * url-safe operation ids, declared path parameters - is an error here. Style rules stay at redocly's `minimal`
 * defaults, and are only reported.
 */
async function validate(source: string): Promise<void> {
	const config = await createConfig({
		extends: ["minimal"],
		rules: {
			"no-identical-paths": "error",
			"no-unresolved-refs": "error",
			"operation-operationId": "error",
			"operation-operationId-unique": "error",
			/** The image endpoint answers with a 302 to imgproxy, which redocly does not count as a success response. */
			"operation-2xx-response": "off",
			"operation-operationId-url-safe": "error",
			"operation-parameters-unique": "error",
			"path-parameters-defined": "error",
			/** The api only declares security on its protected operations; the emitter does not read it. */
			"security-defined": "off",
			struct: "error",
		},
	});

	const problems = await lintFromString({ source, absoluteRef: String(url), config });

	for (const problem of problems) {
		const location = problem.location.map((location) => location.pointer).join(", ");
		const message = `[${problem.ruleId}] ${problem.message} (${location})`;

		if (problem.severity === "error") {
			log.error(message);
		} else {
			log.warn(message);
		}
	}

	const errors = problems.filter((problem) => problem.severity === "error").length;

	if (errors > 0) {
		throw new Error(`OpenAPI document is invalid: ${String(errors)} error(s).`);
	}
}

async function generate(): Promise<void> {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch OpenAPI document from ${String(url)}: ${String(response.status)}.`);
	}

	const source = await response.text();

	await validate(source);

	const document = JSON.parse(source) as Document;

	const output = emit(document, {
		endpointModule: "#/lib/api/endpoint.ts",
		schemasModule: "#/lib/api/schemas.ts",
	});

	await Promise.all([
		Bun.write(outputFiles.schemas, output.schemas),
		Bun.write(outputFiles.endpoints, output.endpoints),
	]);

	const { exitCode, signalCode, success } = Bun.spawnSync(["oxfmt", "--write", ...Object.values(outputFiles)], {
		cwd: projectDir,
		stderr: "inherit",
		stdout: "inherit",
	});

	if (!success) {
		/** `exitCode` is `null` when the process was killed by a signal. */
		const reason = signalCode != null ? `signal ${signalCode}` : `status code ${String(exitCode)}`;

		throw new Error(`Formatter exited with ${reason}.`);
	}
}

generate()
	// oxlint-disable-next-line promise/always-return
	.then(() => {
		log.success("Successfully generated api client from OpenAPI document.");
	})
	.catch((error: unknown) => {
		log.error("Failed to generate api client from OpenAPI document.\n", error);
		process.exitCode = 1;
	});
