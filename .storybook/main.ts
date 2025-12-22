/* eslint-disable check-file/folder-naming-convention */
/* eslint-disable import-x/no-default-export */

import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
	addons: [],
	core: {
		disableWhatsNewNotifications: true,
	},
	framework: "@storybook/nextjs-vite",
	staticDirs: ["../public"],
	stories: ["../components/**/*.stories.@(ts|tsx)"],
	typescript: {
		reactDocgen: "react-docgen-typescript",
		reactDocgenTypescriptOptions: {
			propFilter(prop) {
				return !prop.name.startsWith("aria-");
			},
			shouldExtractLiteralValuesFromEnum: true,
			shouldRemoveUndefinedFromOptional: true,
		},
	},
};

export default config;
