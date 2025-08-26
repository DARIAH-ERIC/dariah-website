import type { ValueForReading } from "@keystatic/core";

import type { createLinkSchema } from "@/lib/keystatic/create-link-schema";

export type LinkSchema = ValueForReading<ReturnType<typeof createLinkSchema>>;

export function getLinkProps(params: LinkSchema) {
	switch (params.discriminant) {
		case "download": {
			return { download: true, href: params.value };
		}

		case "external": {
			return { href: params.value };
		}

		case "index-page": {
			return { href: "/" };
		}

		case "documents-and-policies": {
			return { href: `/documents-and-policies/${params.value}/` };
		}

		case "documents-and-policies-overview": {
			return { href: `/documents-and-policies` };
		}

		case "events": {
			return { href: `/events/${params.value}/` };
		}

		case "events-overview": {
			return { href: "/events" };
		}

		case "impact-case-studies": {
			return { href: `/impact-case-studies/${params.value}/` };
		}

		case "impact-case-studies-overview": {
			return { href: `/impact-case-studies` };
		}

		case "news": {
			return { href: `/news/${params.value}/` };
		}

		case "news-overview": {
			return { href: "/news" };
		}

		case "projects": {
			return { href: `/projects/${params.value}/` };
		}

		case "projects-overview": {
			return { href: `/projects` };
		}

		case "strategies": {
			return { href: `/strategies/${params.value}/` };
		}

		case "strategies-overview": {
			return { href: `/strategies` };
		}

		case "pages": {
			return { href: `/${params.value}` };
		}

		case "resources": {
			return { href: `/resources` };
		}

		case "search": {
			return { href: `/search` };
		}
	}
}
