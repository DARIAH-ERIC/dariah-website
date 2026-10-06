import { describe, expect, test } from "bun:test";

import { type Document, emit, toType } from "#/scripts/openapi/emit.ts";

const options = { endpointModule: "#/lib/api/endpoint.ts", schemasModule: "#/lib/api/schemas.ts" };

function document(overrides: Partial<Document> = {}): Document {
	return {
		components: {
			parameters: {
				Slug: { in: "path", name: "slug", required: true, schema: { type: "string" } },
			},
			schemas: {
				CacheTag: { type: "string", enum: ["events", "assets"] },
				Event: {
					type: "object",
					description: "An event",
					properties: {
						id: { type: "string", format: "uuid" },
						title: { type: "string", description: "The title" },
						tags: { type: "array", items: { type: "string" }, default: [] },
					},
					required: ["id", "title"],
				},
			},
		},
		paths: {
			"/api/v1/events/{slug}": {
				get: {
					operationId: "getEventBySlug",
					summary: "Get event",
					parameters: [
						{ $ref: "#/components/parameters/Slug" },
						{ in: "query", name: "limit", schema: { type: "integer", minimum: 1, maximum: 100 } },
					],
					responses: {
						200: { content: { "application/json": { schema: { $ref: "#/components/schemas/Event" } } } },
						404: { content: { "application/json": { schema: { type: "object" } } } },
					},
					"x-cache-tags": ["events", "assets"],
				},
			},
			"/api/v1/events/{slug}/file": {
				get: {
					operationId: "getEventFile",
					parameters: [{ $ref: "#/components/parameters/Slug" }],
					responses: { 200: { content: { "application/pdf": {} } } },
					"x-cache-tags": [],
				},
			},
		},
		...overrides,
	};
}

describe("toType", () => {
	test("renders scalars, literals and references", () => {
		expect(toType({ type: "string" })).toBe("string");
		expect(toType({ type: "integer" })).toBe("number");
		expect(toType({ type: ["string", "null"] })).toBe("string | null");
		expect(toType({ const: "news" })).toBe('"news"');
		expect(toType({ enum: [320, 480] })).toBe("320 | 480");
		expect(toType({ $ref: "#/components/schemas/Event" }, "schemas.")).toBe("schemas.Event");
	});

	test("renders arrays, tuples and objects", () => {
		expect(toType({ type: "array", items: { type: "string" } })).toBe("Array<string>");
		expect(toType({ type: "array" })).toBe("Array<unknown>");
		expect(toType({ type: "array", prefixItems: [{ type: "string" }, { type: "number" }] })).toBe("[string, number]");
		expect(toType({ type: "object", properties: { a: { type: "string" } }, required: ["a"] })).toBe(
			"{\n\ta: string;\n}",
		);
		expect(toType({ type: "object", properties: { "a-b": { type: "string" } } })).toBe('{\n\t"a-b"?: string;\n}');
		expect(toType({ type: "object", additionalProperties: {} })).toBe("Record<string, unknown>");
		expect(toType({ type: "object", additionalProperties: { type: "number" } })).toBe("Record<string, number>");
		expect(toType({ type: "object" })).toBe("Record<string, never>");
	});

	test("flattens nested unions and drops duplicates", () => {
		expect(toType({ anyOf: [{ anyOf: [{ type: "string" }, { type: "null" }] }, { type: "null" }] })).toBe(
			"string | null",
		);
		expect(toType({ anyOf: [{ enum: ["a|b"] }, { enum: ["a|b"] }] })).toBe('"a|b"');
		expect(toType({ anyOf: [{ type: "array", items: { anyOf: [{ type: "string" }, { type: "null" }] } }] })).toBe(
			"Array<string | null>",
		);
	});

	test("collapses empty schemas to unknown", () => {
		expect(toType({})).toBe("unknown");
		expect(toType({ description: "Anything" })).toBe("unknown");
		expect(toType({ anyOf: [{}, { type: "null" }] })).toBe("unknown");
	});

	test("intersects allOf", () => {
		expect(toType({ allOf: [{ $ref: "#/components/schemas/A" }, { $ref: "#/components/schemas/B" }] })).toBe("A & B");
	});

	test("rejects references outside of components.schemas", () => {
		expect(() => toType({ $ref: "#/components/responses/Error" })).toThrow();
	});
});

describe("emit", () => {
	const output = emit(document(), options);

	test("emits a named type per schema", () => {
		expect(output.schemas).toContain('export type CacheTag = "events" | "assets";');
		expect(output.schemas).toContain('export const cacheTags: ReadonlyArray<CacheTag> = ["events", "assets"];');
		expect(output.schemas).toContain("/** An event */\nexport interface Event {");
		expect(output.schemas).toContain("/** The title */\n\ttitle: string;");
		expect(output.schemas).toContain("@default []");
		expect(output.schemas).toContain("tags?: Array<string>;");
	});

	test("emits the page size cap and range annotations", () => {
		expect(output.endpoints).toContain("export const maxPageSize = 100;");
		expect(output.endpoints).toContain("@minimum 1\n\t\t * @maximum 100");
	});

	test("emits a namespace and an endpoint per operation", () => {
		expect(output.endpoints).toContain('import { defineEndpoint } from "#/lib/api/endpoint.ts";');
		expect(output.endpoints).toContain('import type * as schemas from "#/lib/api/schemas.ts";');
		expect(output.endpoints).toContain("export declare namespace getEventBySlug {");
		expect(output.endpoints).toContain("export interface Params {\n\t\tslug: string;\n\t}");
		expect(output.endpoints).toContain("*/\n\t\tlimit?: number;\n\t}");
		expect(output.endpoints).toContain("export type Response = schemas.Event;");
		expect(output.endpoints).toContain(
			"export const getEventBySlug = defineEndpoint<{ params: getEventBySlug.Params; searchParams: getEventBySlug.SearchParams; response: getEventBySlug.Response }>({",
		);
		expect(output.endpoints).toContain('pathname: "/api/v1/events/{slug}"');
		expect(output.endpoints).toContain('cacheTags: ["events", "assets"]');
		expect(output.endpoints).toContain('responseType: "json"');
	});

	test("returns the raw response for operations without a json body", () => {
		expect(output.endpoints).toContain("export type Response = globalThis.Response;");
		expect(output.endpoints).toContain('responseType: "response"');
	});

	test("rejects unknown cache tags", () => {
		const invalid = document();
		invalid.paths["/api/v1/events/{slug}"]!.get!["x-cache-tags"] = ["nope"];
		expect(() => emit(invalid, options)).toThrow('unknown cache tag "nope"');
	});

	test("rejects undeclared path parameters", () => {
		const invalid = document();
		invalid.paths["/api/v1/events/{slug}"]!.get!.parameters = [];
		expect(() => emit(invalid, options)).toThrow('does not declare path parameter "slug"');
	});

	test("rejects duplicate operation ids", () => {
		const invalid = document();
		invalid.paths["/api/v1/events/{slug}/file"]!.get!.operationId = "getEventBySlug";
		expect(() => emit(invalid, options)).toThrow("Duplicate operation id");
	});
});
