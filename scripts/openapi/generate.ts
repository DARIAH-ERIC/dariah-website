import * as fs from "node:fs/promises";
import * as path from "node:path";

import { createUrl, log } from "@acdh-oeaw/lib";
import openapi, { astToString } from "openapi-typescript";

import { env } from "@/config/env.config";

const baseUrl = env.NEXT_PUBLIC_API_BASE_URL;
const pathname = env.NEXT_PUBLIC_API_OPENAPI_PATHNAME;

async function generate() {
	const url = createUrl({ baseUrl, pathname });

	const ast = await openapi(url);
	const contents = astToString(ast);

	const filePath = "./lib/api/types.ts";
	await fs.mkdir(path.dirname(filePath), { recursive: true });
	await fs.writeFile(filePath, contents);
}

generate().catch((error: unknown) => {
	log.error("Failed to generate api types from openapi schema.\n", error);
});
