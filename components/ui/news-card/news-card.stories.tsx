import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { NewsCard } from "@/components/ui/news-card/news-card";

const meta = {
	title: "Components/UI/NewsCard",
	component: NewsCard,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["featured", "standard"],
		},
	},
} satisfies Meta<typeof NewsCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Featured: Story = {
	args: {
		variant: "featured",
		title: "Launch of the DARIAH South-East European Regional Hub",
		description:
			"On October 22nd, 2025 the DARIAH South-East European (SEE) Regional Hub officially launched, during an event at the Vučedol Culture Museum in Osijek, Croatia. The launch was organised on the side of the Digital Humanities and Heritage conference, an annual international conference run by DARIAH-HR. The SEE Hub is the first DARIAH",
		imageUrl: "/assets/images/temp-news-1.jpg",
		linkUrl: "#",
		date: "November 5, 2025",
	},
};

export const Standard: Story = {
	args: {
		variant: "standard",
		title: "DARIAH publishes the CoARA Progress Report and Action Plan for the years 2025-2027",
		imageUrl: "/assets/images/temp-news-2.png",
		linkUrl: "#",
		date: "November 5, 2025",
	},
};
