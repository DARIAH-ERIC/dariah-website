import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CaseStudy } from "@/components/ui/case-study/case-study";

const meta = {
	title: "Components/UI/CaseStudy",
	component: CaseStudy,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof CaseStudy>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		imageUrl: "/assets/images/temp-case-study.svg",
		title: "DARIAH-EU Cooperating Partnership creates opportunities for Digital Hellenic Studies",
	},
};
