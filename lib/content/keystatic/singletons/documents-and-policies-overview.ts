import { createSingleton } from "@acdh-oeaw/keystatic-lib";
import { fields, singleton } from "@keystatic/core";

export const createDocumentsAndPoliciesOverview = createSingleton(
	"/documents-and-policies-overview/",
	(paths, _locale) => {
		return singleton({
			label: "Documents and Policies Overview",
			path: paths.contentPath,
			format: { data: "json" },
			entryLayout: "form",
			schema: {
				title: fields.text({
					label: "Title",
					validation: { isRequired: true },
				}),
				lead: fields.text({
					label: "Lead",
					validation: { isRequired: true },
					multiline: true,
				}),
			},
		});
	},
);
