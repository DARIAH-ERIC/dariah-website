import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/button";

const meta = {
	title: "Components/Button",
	component: Button,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["primary", "secondary", "quiet"],
		},
	},
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		variant: "primary",
		children: "Primary",
	},
};

export const Secondary: Story = {
	args: {
		variant: "secondary",
		children: "Secondary",
	},
};

export const Quiet: Story = {
	args: {
		variant: "quiet",
		children: "Quiet",
	},
};

export const Disabled: Story = {
	args: {
		isDisabled: true,
		children: "Disabled",
	},
};

export const Pending: Story = {
	args: {
		isPending: true,
		variant: "primary",
		children: "Pending",
	},
};

export const IconOnly: Story = {
	args: {
		"aria-label": "Search",
		variant: "primary",
		children: <SearchIcon aria-hidden={true} />,
	},
};

export const AllVariants: Story = {
	render() {
		return (
			<div className="flex flex-wrap items-center gap-3">
				<Button variant="primary">Primary</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="quiet">Quiet</Button>
				<Button isDisabled={true}>Disabled</Button>
				<Button isPending={true}>Pending</Button>
				<Button aria-label="Search">
					<SearchIcon aria-hidden={true} />
				</Button>
			</div>
		);
	},
};
