import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
	addons: [],
	core: {
		disableTelemetry: true,
		disableWhatsNewNotifications: true,
	},
	framework: "@storybook/nextjs-vite",
	staticDirs: ["../public"],
	stories: ["../stories/**/*.stories.tsx"],
	/**
	 * The default `react-docgen`, not `react-docgen-typescript`: that one runs on typescript's javascript api, which
	 * typescript 7 no longer ships.
	 */
	typescript: {
		reactDocgen: "react-docgen",
	},
};

export default config;
