import { defineConfig } from "oxlint";

const config = defineConfig({
	overrides: [
		{
			files: ["*.stories.tsx"],
			/** @see https://github.com/oxc-project/oxc/issues/10394 */
			jsPlugins: [{ name: "storybook", specifier: "eslint-plugin-storybook" }],
			/** `env` is not inherited through `extends`, but it is a valid - and here correctly scoped - override key. */
			env: {
				builtin: true,
				browser: true,
			},
			rules: {
				"storybook/await-interactions": "error",
				"storybook/context-in-play-function": "error",
				"storybook/csf-component": "off",
				"storybook/default-exports": "error",
				"storybook/hierarchy-separator": "error",
				"storybook/meta-inline-properties": "off",
				"storybook/meta-satisfies-type": "error",
				"storybook/no-redundant-story-name": "error",
				"storybook/no-renderer-packages": "error",
				"storybook/no-stories-of": "off",
				"storybook/no-title-property-in-meta": "off",
				"storybook/no-uninstalled-addons": "error",
				"storybook/prefer-pascal-case": "error",
				"storybook/story-exports": "error",
				"storybook/use-storybook-expect": "error",
				"storybook/use-storybook-testing-library": "error",

				"import/no-default-export": "off",
			},
		},
	],
});

export default config;
