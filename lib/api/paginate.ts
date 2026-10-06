import { Result } from "better-result";

import { maxPageSize } from "#/lib/api/endpoints.ts";
import type { RequestError } from "#/lib/request/errors.ts";
import type { RequestResult } from "#/lib/request/index.ts";

/** The shape every paginated list operation of the api responds with. */
export interface Paginated<T> {
	data: Array<T>;
	limit: number;
	offset: number;
	total: number;
}

export interface PageCursor {
	limit: number;
	offset: number;
}

/** The number of pages a list of `total` items has, at least one so an empty list still has a first page. */
export function pageCount(total: number, pageSize: number): number {
	return Math.max(1, Math.ceil(total / pageSize));
}

/** The cursor for a 1-based page number. */
export function pageCursor(page: number, pageSize: number): PageCursor {
	return { limit: pageSize, offset: (page - 1) * pageSize };
}

/**
 * Walks every page of a paginated list operation, and collects the items. The api caps `limit`, so a list which may
 * grow beyond one page must be fetched like this, instead of with a single oversized request.
 */
export async function collectAll<T>(
	fetchPage: (cursor: PageCursor) => Promise<RequestResult<Paginated<T>>>,
	options: { pageSize?: number } = {},
): Promise<Result<Array<T>, RequestError>> {
	const limit = options.pageSize ?? maxPageSize;
	const items: Array<T> = [];

	/** Each page's `total` decides whether another one is needed, so the requests are inherently sequential. */
	async function walk(offset: number): Promise<Result<Array<T>, RequestError>> {
		const result = await fetchPage({ limit, offset });

		if (result.isErr()) {
			return Result.err(result.error);
		}

		const { data, total } = result.value.data;

		items.push(...data);

		/** The second condition guards against an api which reports a `total` it never delivers. */
		if (offset + data.length >= total || data.length === 0) {
			return Result.ok(items);
		}

		return walk(offset + data.length);
	}

	return walk(0);
}
