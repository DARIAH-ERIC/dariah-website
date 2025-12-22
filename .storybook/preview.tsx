/* eslint-disable check-file/folder-naming-convention */
/* eslint-disable import-x/no-default-export */

import "@/styles/index.css";

import type { Preview } from "@storybook/nextjs-vite";
import cn from "clsx/lite";

import * as fonts from "@/app/_lib/fonts";

const preview: Preview = {
	decorators(Story) {
		return (
			<div
				className={cn(
					fonts.body.variable,
					fonts.heading.variable,
					fonts.code.variable,
					"font-body antialiased",
				)}
			>
				<Story />
			</div>
		);
	},
	parameters: {
		backgrounds: {
			disable: true,
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		nextjs: {
			appDirectory: true,
		},
	},
};

export default preview;
