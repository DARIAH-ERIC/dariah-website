import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Tag } from "@/components/ui/tag/tag";

const meta = {
	title: "Components/UI/Tag",
	component: Tag,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["past", "pending", "upcoming"],
		},
	},
} satisfies Meta<typeof Tag>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Past: Story = {
	args: {
		variant: "past",
		text: "Past",
	},
};

export const Pending: Story = {
	args: {
		variant: "pending",
		text: "Pending",
	},
};

export const Upcoming: Story = {
	args: {
		variant: "upcoming",
		text: "Upcoming",
	},
};

export const AllVariants: Story = {
	render() {
		return (
			<div className="flex flex-wrap items-center gap-3">
				<Tag text="Past" variant="past" />
				<Tag text="Pending" variant="pending" />
				<Tag text="Upcoming" variant="upcoming" />
			</div>
		);
	},
};
