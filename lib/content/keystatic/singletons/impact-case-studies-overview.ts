import { createSingleton } from "@acdh-oeaw/keystatic-lib";
import { fields, singleton } from "@keystatic/core";

export const createImpactCaseStudiesOverview = createSingleton(
	"/impact-case-studies-overview/",
	(paths, _locale) => {
		return singleton({
			label: "Impact Case Studies Overview",
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
