import { mkdirSync, writeFile } from "node:fs";

import slugify from "@sindresorhus/slugify";
import jsyaml from "js-yaml";

import { getWorkingGroups } from "@/lib/knowledge-base/get-data";

const contentPath = "./content/en-GB/working-groups";

export async function createCMSContentForWorkingGroups() {
	const workingGroups = await getWorkingGroups();
	workingGroups.forEach((workingGroup) => {
		const { name } = workingGroup;
		const folderName = slugify(name);

		const content = jsyaml.dump(workingGroup);

		mkdirSync(`${contentPath}/${folderName}`, { recursive: true });

		writeFile(
			`${contentPath}/${folderName}/index.yaml`,
			content,
			{ flag: "wx", encoding: "utf-8" },
			(err) => {
				if (err) {
					if (err.code === "EEXIST") {
						console.log("File already exists");
					} else {
						console.error("Error creating file:", err);
					}
				} else {
					console.log("File created successfully");
				}
			},
		);
	});
}

await createCMSContentForWorkingGroups();
