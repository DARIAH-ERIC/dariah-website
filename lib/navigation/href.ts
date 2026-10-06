import type { Pathname, PathnameParams, SearchParamsCodecFor } from "next";

declare const hrefBrand: unique symbol;

type RequiredKeys<Value> = {
	[Key in keyof Value]-?: Partial<Pick<Value, Key>> extends Pick<Value, Key> ? never : Key;
}[keyof Value];

type EncodedSearchParamsFor<Path extends Pathname> =
	SearchParamsCodecFor<Path> extends {
		encode: (...args: never) => infer Encoded;
	}
		? Encoded
		: never;

type SearchParamsInputFor<Path extends Pathname> = [SearchParamsCodecFor<Path>] extends [never]
	? { searchParams?: never }
	: { searchParams?: EncodedSearchParamsFor<Path> };

type InternalHrefInputFor<Path extends Pathname> = (keyof PathnameParams<Path> extends never
	? { pathname: Path; params?: never }
	: RequiredKeys<PathnameParams<Path>> extends never
		? { pathname: Path; params?: PathnameParams<Path> }
		: { pathname: Path; params: PathnameParams<Path> }) &
	SearchParamsInputFor<Path> & { hash?: string };

export type InternalHrefInput = {
	[Path in Pathname]: InternalHrefInputFor<Path>;
}[Pathname];

export type ExternalUrl = URL | `http://${string}` | `https://${string}` | `mailto:${string}` | `tel:${string}`;

export interface ExternalHrefInput {
	pathname?: never;
	url: ExternalUrl;
}

export type InternalHref = InternalHrefInput & {
	readonly [hrefBrand]: "internal";
};

export interface ExternalHref {
	pathname?: never;
	url: string;
	readonly [hrefBrand]: "external";
}

export type Href = InternalHref | ExternalHref;

const externalProtocols = new Set(["http:", "https:", "mailto:", "tel:"]);

export function href(options: InternalHrefInput): InternalHref;
export function href(options: ExternalHrefInput): ExternalHref;
export function href(options: InternalHrefInput | ExternalHrefInput): Href {
	if ("url" in options) {
		const url = typeof options.url === "string" ? new URL(options.url) : options.url;

		if (!externalProtocols.has(url.protocol)) {
			throw new TypeError(`Unsupported URL protocol: ${url.protocol}`);
		}

		return { url: url.href } as ExternalHref;
	}

	if (options.hash != null && (options.hash.length === 0 || options.hash.startsWith("#"))) {
		throw new TypeError("Internal href hashes must be non-empty and omit the leading #");
	}

	return options as InternalHref;
}

function encodeSegment(value: string): string {
	return encodeURIComponent(value);
}

function isStringArray(value: ReadonlyArray<string> | string | undefined): value is ReadonlyArray<string> {
	return Array.isArray(value);
}

function serializeInternalHref(value: InternalHref): string {
	const descriptor = value as {
		params?: Record<string, ReadonlyArray<string> | string | undefined>;
		pathname: string;
	};
	const params = descriptor.params ?? {};
	let result = descriptor.pathname;

	result = result.replaceAll(/\/\[\[\.\.\.[^\]]+\]\]/g, (match) => {
		const name = match.slice(6, -2);
		const param = params[name];

		if (param == null || (isStringArray(param) && param.length === 0)) {
			return "";
		}

		if (!isStringArray(param)) {
			throw new TypeError(`Expected optional catch-all parameter "${name}" to be an array`);
		}

		return `/${param.map((segment) => encodeSegment(segment)).join("/")}`;
	});

	result = result.replaceAll(/\[\.\.\.[^\]]+\]/g, (match) => {
		const name = match.slice(4, -1);
		const param = params[name];

		if (!isStringArray(param) || param.length === 0) {
			throw new TypeError(`Expected catch-all parameter "${name}" to be a non-empty array`);
		}

		return param.map((segment) => encodeSegment(segment)).join("/");
	});

	result = result.replaceAll(/\[[^\]]+\]/g, (match) => {
		const name = match.slice(1, -1);
		const param = params[name];

		if (typeof param !== "string" || param.length === 0) {
			throw new TypeError(`Expected route parameter "${name}" to be a non-empty string`);
		}

		return encodeSegment(param);
	});

	return result;
}

/**
 * Casts an arbitrary path or url into a `Href`, skipping `href()`'s compile-time check against the generated `Pathname`
 * union. For hrefs that aren't statically known app routes - e.g. content the knowledge base dashboard manages - and
 * are trusted to be valid paths/urls instead.
 */
export function unsafeHref(path: string, isExternal: boolean): Href {
	if (isExternal) {
		return { url: path } as ExternalHref;
	}

	return { pathname: path } as InternalHref;
}

export function serializeHref(value: Href): string {
	if ("url" in value) {
		return value.url;
	}

	let result = serializeInternalHref(value);
	const descriptor = value as unknown as {
		searchParams?: { query: string };
	};
	const searchParams = descriptor.searchParams;

	if (searchParams != null && typeof searchParams === "object" && "query" in searchParams) {
		const query = searchParams.query;

		if (typeof query === "string" && query.length > 0) {
			result += `?${query}`;
		}
	}

	if (value.hash != null) {
		const hashUrl = new URL("http://navigation.local");
		hashUrl.hash = value.hash;
		result += hashUrl.hash;
	}

	return result;
}

/**
 * Whether `value` points at `pathname`, ignoring search params and hash. External urls never match, since they leave
 * the app.
 */
export function isCurrentHref(value: Href, pathname: string): boolean {
	if ("url" in value) {
		return false;
	}

	return serializeHref(value).split(/[#?]/, 1)[0] === pathname;
}
