import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Project } from "@/components/ui/project/project";

const meta = {
	title: "Components/UI/Project",
	component: Project,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof Project>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		imageUrl: "/assets/images/temp-news-1.jpg",
		href: "#",
		title: "ARTEMIS",
		type: "Beneficiary",
		startDate: new Date("1 Jan 2025"),
		endDate: new Date("31 Dec 2027"),
	},
};
