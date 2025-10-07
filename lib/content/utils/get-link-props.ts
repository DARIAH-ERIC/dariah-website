import type { ValueForReading } from "@keystatic/core";

import type { createLinkSchema } from "@/lib/content/keystatic/utils/create-link-schema";
import { createHref } from "@/lib/navigation/create-href";

export type LinkSchema = ValueForReading<ReturnType<typeof createLinkSchema>>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function getLinkProps(params: LinkSchema) {
	switch (params.discriminant) {
		case "documentation": {
			return {
				href: createHref({
					pathname: `/documentation/${params.value.id}`,
					hash: params.value.hash,
				}),
			};
		}

		case "download": {
			return {
				download: true,
				href: params.value,
			};
		}

		case "external": {
			return {
				href: params.value,
			};
		}

		case "hash": {
			return {
				href: createHref({
					hash: params.value,
				}),
			};
		}

		case "search": {
			return {
				href: createHref({
					pathname: "/search",
					searchParams: params.value.search,
				}),
			};
		}
	}
}
