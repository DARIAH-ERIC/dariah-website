import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Checkbox } from "@/components/ui/checkbox/checkbox";

const meta = {
	title: "Components/UI/Checkbox",
	component: Checkbox,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	argTypes: {},
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {},
};

export const Labelled: Story = {
	args: {
		label: "labelled checkbox",
	},
};
