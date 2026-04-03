import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { RelatedContent } from "@/components/ui/related-content/related-content";

const meta = {
	title: "Components/UI/RelatedContent",
	component: RelatedContent,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof RelatedContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		title:
			"DARIAH Welcomes Marmara University Center for Digital Humanities as New Cooperating Partner",
		category: "news",
	},
};
