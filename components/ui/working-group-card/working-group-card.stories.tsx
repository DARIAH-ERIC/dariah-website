import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { WorkingGroupCard } from "@/components/ui/working-group-card/working-group-card";

const meta = {
	title: "Components/UI/WorkingGroupCard",
	component: WorkingGroupCard,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof WorkingGroupCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		image: { srcUrl: "/assets/images/temp-news-1.jpg", width: 385, height: 385, alt: null },
		title: "ARTEMIS",
		href: "/",
	},
};
