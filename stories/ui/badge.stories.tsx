import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Badge } from "#/components/ui/badge.tsx";

const meta = {
	component: Badge,
	args: {
		children: "Upcoming",
		tone: "highlight",
	},
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Highlight: Story = {};

export const Muted: Story = {
	args: {
		children: "Past",
		tone: "muted",
	},
};

export const Accent: Story = {
	args: {
		children: "DARIAH",
		tone: "accent",
	},
};
