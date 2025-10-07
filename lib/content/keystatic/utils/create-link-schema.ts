import { createAssetOptions, type Paths, withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { fields } from "@keystatic/core";

import * as validation from "@/lib/content/keystatic/validation";
import { linkKinds } from "@/lib/content/options";
import type { IntlLanguage } from "@/lib/i18n/locales";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createLinkSchema<TPath extends `/${string}/`>(
	downloadPath: Paths<TPath>["downloadPath"],
	locale: IntlLanguage,
) {
	return fields.conditional(
		fields.select({
			label: "Kind",
			options: linkKinds,
			defaultValue: "external",
		}),
		{
			external: fields.url({
				label: "URL",
				validation: { isRequired: true },
			}),
			hash: fields.text({
				label: "Heading identifier",
				description: "For example `#first-heading`.",
				validation: { isRequired: true, pattern: validation.urlFragment },
			}),
			download: fields.file({
				label: "Download",
				validation: { isRequired: true },
				...createAssetOptions(downloadPath),
			}),
			search: fields.object({
				search: fields.text({
					label: "Search params",
					description: "For example `?q=dariah`.",
					validation: { isRequired: false, pattern: validation.urlSearchParamsOptional },
				}),
				hash: fields.text({
					label: "URL fragment",
					description: "For example `#first-heading`.",
					validation: { isRequired: false, pattern: validation.urlFragmentOptional },
				}),
			}),
			documentation: fields.object({
				id: fields.relationship({
					label: "Documentation",
					validation: { isRequired: true },
					collection: withI18nPrefix("documentation", locale),
				}),
				hash: fields.text({
					label: "URL fragment",
					description: "For example `#first-heading`.",
					validation: { isRequired: false, pattern: validation.urlFragmentOptional },
				}),
			}),
		},
	);
}
