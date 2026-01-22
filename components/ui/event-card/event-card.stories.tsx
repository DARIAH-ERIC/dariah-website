import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { EventCard } from "@/components/ui/event-card/event-card";

const meta = {
	title: "Components/UI/EventCard",
	component: EventCard,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["homepage", "list"],
		},
	},
} satisfies Meta<typeof EventCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Homepage: Story = {
	args: {
		variant: "homepage",
		endDate: "2025-08-2",
		localization: "Besançon, France",
		startDate: "2025-07-21",
		status: "upcoming",
		title: "European Summer University in Digital Humanities “Culture and Technology” 2025",
		type: "training",
	},
};

export const ListWithoutImage: Story = {
	args: {
		variant: "list",
		endDate: "2025-08-2",
		localization: "Besançon, France",
		startDate: "2025-07-21",
		status: "upcoming",
		title: "European Summer University in Digital Humanities “Culture and Technology” 2025",
		type: "training",
	},
};

export const ListWithImage: Story = {
	args: {
		variant: "list",
		endDate: "2025-08-2",
		localization: "Besançon, France",
		startDate: "2025-07-21",
		status: "upcoming",
		title: "European Summer University in Digital Humanities “Culture and Technology” 2025",
		type: "training",
		imageUrl: "/assets/images/temp-news-2.svg",
	},
};
