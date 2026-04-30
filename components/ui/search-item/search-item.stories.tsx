import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SearchItem } from "@/components/ui/search-item/search-item";

const meta = {
	title: "Components/UI/SearchItem",
	component: SearchItem,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof SearchItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		href: "#",
		description:
			"ARCHETIPO spans a highly interdisciplinary domain, involving expertise from professionals in Digital Humanities, Architecture (including conservators and architectural historians), and information sciences. It also engages with public administration (responsible for historic buildings) and professionals active in the cultural heritage sector.",
		title:
			"ARChitectural HEritage Thesaurus through Integrated digital Procedures and Open data (ARCHETIPO)",
		date: new Date("1 Jan 2025"),
		type: "opportunity",
	},
};
