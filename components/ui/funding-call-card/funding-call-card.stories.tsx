import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FundingCallCard } from "@/components/ui/funding-call-card/funding-call-card";

const meta = {
	title: "Components/UI/FundingCallCard",
	component: FundingCallCard,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	argTypes: {},
} satisfies Meta<typeof FundingCallCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Open: Story = {
	args: {
		slug: "aaa",
		index: 0,
		title: "Kitchen Sink Opportunity",
		startDate: new Date("2025-07-21"),
		endDate: new Date("2030-08-2"),
	},
};

export const Upcoming: Story = {
	args: {
		slug: "aaa",
		index: 0,
		title: "Kitchen Sink Opportunity",
		startDate: new Date("2030-07-21"),
		endDate: new Date("2030-08-2"),
	},
};

export const Closed: Story = {
	args: {
		slug: "aaa",
		index: 0,
		title: "Kitchen Sink Opportunity",
		startDate: new Date("2010-07-21"),
		endDate: new Date("2010-08-2"),
	},
};
