import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import { collectAll } from "#/lib/api/paginate.ts";
import type { ImpactCaseStudy, ImpactCaseStudyBase } from "#/lib/api/schemas.ts";

/**
 * Case studies per page of the list, a website decision, unrelated to the api's page size cap: four years' worth, at
 * the three a year DARIAH publishes, which is also four full rows of the list's three columns.
 */
export const impactCaseStudiesPageSize = 12;

export interface ImpactCaseStudiesPage {
	items: Array<ImpactCaseStudyBase>;
	/** 1-based. */
	page: number;
	pages: number;
	total: number;
}

function pageCount(total: number): number {
	return Math.max(1, Math.ceil(total / impactCaseStudiesPageSize));
}

/**
 * One page of the case study list, or `null` when `page` is out of range. Each page is its own cache entry, keyed by
 * the argument; the tags invalidate all of them at once, which is what a new case study at the top requires anyway,
 * since it shifts every page.
 */
export async function getImpactCaseStudiesPage(page: number): Promise<ImpactCaseStudiesPage | null> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getImpactCaseStudies.cacheTags());

	if (!Number.isInteger(page) || page < 1) {
		return null;
	}

	const result = await api.getImpactCaseStudies.request({
		searchParams: { limit: impactCaseStudiesPageSize, offset: (page - 1) * impactCaseStudiesPageSize },
	});

	const { data, total } = result.unwrap().data;
	const pages = pageCount(total);

	if (page > pages) {
		return null;
	}

	return { items: data, page, pages, total };
}

/** An impact case study by slug, or `null` when there is none. */
export async function getImpactCaseStudyBySlug(slug: string): Promise<ImpactCaseStudy | null> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getImpactCaseStudyBySlug.cacheTags());

	const result = await api.getImpactCaseStudyBySlug.request({ params: { slug } });

	if (result.isErr() && result.error._tag === "HttpError" && result.error.response.status === 404) {
		return null;
	}

	return result.unwrap().data;
}

/** Every published impact case study slug, for `generateStaticParams`. */
export async function getImpactCaseStudySlugs(): Promise<Array<string>> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getImpactCaseStudySlugs.cacheTags());

	const result = await collectAll((cursor) => api.getImpactCaseStudySlugs.request({ searchParams: cursor }));

	return result.unwrap().map((item) => item.entity.slug);
}
