import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Document } from "@/components/ui/document/document";

const meta = {
	title: "Components/UI/Document",
	component: Document,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof Document>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		title: "DARIAH ERIC Statuetes July 2025",
		documentUrl: "/assets/images/temp-news-2.svg",
	},
};
