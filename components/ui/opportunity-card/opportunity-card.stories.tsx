import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { OpportunityCard } from "@/components/ui/opportunity-card/opportunity-card";

const meta = {
	title: "Components/UI/OpportunityCard",
	component: OpportunityCard,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["featured", "standard"],
		},
	},
} satisfies Meta<typeof OpportunityCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Internal: Story = {
	args: {
		variant: "dariah",
		title: "Launch of the DARIAH South-East European Regional Hub",
		summary:
			"On October 22nd, 2025 the DARIAH South-East European (SEE) Regional Hub officially launched, during an event at the Vučedol Culture Museum in Osijek, Croatia. The launch was organised on the side of the Digital Humanities and Heritage conference, an annual international conference run by DARIAH-HR. The SEE Hub is the first DARIAH",
		website: "https://www.dariah.eu/",
		startDate: new Date("2025-11-05"),
		endDate: new Date("2026-11-05"),
	},
};

export const External: Story = {
	args: {
		variant: "external",
		title: "DARIAH publishes the CoARA Progress Report and Action Plan for the years 2025-2027",
		summary:
			"On October 22nd, 2025 the DARIAH South-East European (SEE) Regional Hub officially launched, during an event at the Vučedol Culture Museum in Osijek, Croatia. The launch was organised on the side of the Digital Humanities and Heritage conference, an annual international conference run by DARIAH-HR. The SEE Hub is the first DARIAH",
		website: "https://www.dariah.eu/",
		startDate: new Date("2025-11-05"),
		endDate: new Date("2026-11-05"),
	},
};
