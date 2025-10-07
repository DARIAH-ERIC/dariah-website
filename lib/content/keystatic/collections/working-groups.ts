import { createCollection } from "@acdh-oeaw/keystatic-lib";
import { readonly } from "@acdh-oeaw/keystatic-lib/fields/readonly";
import { readonlySlug } from "@acdh-oeaw/keystatic-lib/fields/readonly-slug";
import { collection } from "@keystatic/core";

export const createWorkingGroups = createCollection("/working-groups/", (paths, _locale) => {
	return collection({
		label: "Working groups",
		path: paths.contentPath,
		slugField: "name",
		columns: ["name"],
		entryLayout: "form",
		schema: {
			name: readonlySlug({
				label: "Name",
				description: "Data Source: Dariah Knowledge Base",
			}),
			startDate: readonly({
				label: "Working group start date",
				description: "Data Source: Dariah Knowledge Base",
			}),
			endDate: readonly({
				label: "Working group end date",
				description: "Data Source: Dariah Knowledge Base",
			}),
		},
	});
});
