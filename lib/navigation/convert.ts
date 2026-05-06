import { isNonEmptyString, unreachable } from "@acdh-oeaw/lib";

import type { client } from "@/lib/data/api-client";
import type { NavigationConfig, NavigationLink } from "@/lib/navigation/navigation";

export function convertNavigationMenu(
	items: Awaited<ReturnType<typeof client.navigation.get>>["data"][number]["items"],
): NavigationConfig {
	const config: NavigationConfig = {};

	for (const item of items) {
		if (item.label === "Home") continue;

		if (item.children.length > 0) {
			const children: Record<string, NavigationLink> = {};

			for (const child of item.children) {
				children[child.id] = {
					type: "link",
					label: child.label,
					href: getHref(child),
					target: child.isExternal ? "_blank" : undefined,
				};
			}

			config[item.id] = {
				type: "menu",
				label: item.label,
				children,
			};
		} else {
			config[item.id] = {
				type: "link",
				label: item.label,
				href: getHref(item),
				target: item.isExternal ? "_blank" : undefined,
			};
		}
	}

	return config;
}

const getHref = function getHref(item: {
	href?: string | null;
	entity: {
		type:
			| "documents_policies"
			| "events"
			| "external_links"
			| "impact_case_studies"
			| "news"
			| "organisational_units"
			| "pages"
			| "persons"
			| "projects"
			| "spotlight_articles";
		slug: string;
	} | null;
}) {
	if (isNonEmptyString(item.href)) {
		return item.href;
	}

	if (item.entity != null) {
		// eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
		switch (item.entity.type) {
			case "events": {
				return `/events/${item.entity.slug}`;
			}

			case "news": {
				return `/news/${item.entity.slug}`;
			}

			default:
		}
	}

	unreachable();
};
