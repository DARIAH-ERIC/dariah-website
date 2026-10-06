import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import * as api from "#/lib/api/endpoints.ts";
import type { NavigationMenu } from "#/lib/api/schemas.ts";

/** The menus the knowledge base dashboard manages; the api filters by name. */
export type NavigationMenuName = "primary" | "secondary";

/**
 * A navigation menu, or `null` when the api has none by that name. Rendered in the root layout, so this entry is part
 * of every route's app shell; the `navigation` tag - and the tags of every entity a menu item can link to - expire it.
 */
export async function getNavigationMenu(name: NavigationMenuName): Promise<NavigationMenu | null> {
	"use cache";
	cacheLife("content");
	cacheTag(...api.getNavigation.cacheTags());

	const result = await api.getNavigation.request({ searchParams: { menu: name } });

	return result.unwrap().data.find((menu) => menu.name === name) ?? null;
}
