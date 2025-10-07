import { createSingleton } from "@acdh-oeaw/keystatic-lib";
import { fields, singleton } from "@keystatic/core";

export const createMembersAndPartnersOverview = createSingleton(
	"/members-and-partners-overview/",
	(paths, _locale) => {
		return singleton({
			label: "Members and Partners Overview",
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
