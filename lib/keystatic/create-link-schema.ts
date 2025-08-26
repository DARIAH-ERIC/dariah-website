import { createAssetOptions, type Paths, withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";

import type { Locale } from "@/config/i18n.config";
import { linkKinds } from "@/lib/keystatic/component-options";

export function createLinkSchema<TPath extends `/${string}/`>(
	downloadPath: Paths<TPath>["downloadPath"],
	locale: Locale,
) {
	return fields.conditional(
		fields.select({
			label: "Kind",
			options: linkKinds,
			defaultValue: "external",
		}),
		{
			"documents-and-policies": fields.relationship({
				label: "Document or Policy",
				validation: { isRequired: true },
				collection: withI18nPrefix("documents-and-policies", locale),
			}),
			events: fields.relationship({
				label: "Event",
				validation: { isRequired: true },
				collection: withI18nPrefix("events", locale),
			}),
			"impact-case-studies": fields.relationship({
				label: "Impact Case Study",
				validation: { isRequired: true },
				collection: withI18nPrefix("impact-case-studies", locale),
			}),
			news: fields.relationship({
				label: "News",
				validation: { isRequired: true },
				collection: withI18nPrefix("news", locale),
			}),
			projects: fields.relationship({
				label: "Project",
				validation: { isRequired: true },
				collection: withI18nPrefix("projects", locale),
			}),
			strategies: fields.relationship({
				label: "Strategy",
				validation: { isRequired: true },
				collection: withI18nPrefix("strategies", locale),
			}),
			pages: fields.relationship({
				label: "Pages",
				validation: { isRequired: true },
				collection: withI18nPrefix("pages", locale),
			}),
			download: fields.file({
				label: "Download",
				validation: { isRequired: true },
				...createAssetOptions(downloadPath),
			}),
			external: fields.url({
				label: "URL",
				validation: { isRequired: true },
			}),
			"index-page": fields.empty(),
			"documents-and-policies-overview": fields.empty(),
			"events-overview": fields.empty(),
			"impact-case-studies-overview": fields.empty(),
			"news-overview": fields.empty(),
			"projects-overview": fields.empty(),
			"strategies-overview": fields.empty(),
			resources: fields.empty(),
			search: fields.empty(),
		},
	);
}
