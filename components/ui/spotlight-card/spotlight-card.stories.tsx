import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SpotlightCard } from "@/components/ui/spotlight-card/spotlight-card";

const meta = {
	title: "Components/UI/SpotlightCard",
	component: SpotlightCard,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof SpotlightCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		imageUrl: "/assets/images/temp-news-1.jpg",
		title: "The DARIAH Working Group on Research Data Management is five years old!",
		publishedAt: new Date("2025-05-01"),
		summary: "By Francesco Gelati and Françoise Gouzi",
		href: "/",
	},
};
