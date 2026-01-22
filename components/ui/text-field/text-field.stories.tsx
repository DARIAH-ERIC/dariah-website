import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/components/ui/button/button";
import { TextField } from "@/components/ui/text-field/text-field";

const meta = {
	title: "Components/UI/TextField",
	component: TextField,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof TextField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {
		label: "Basic TextField",
		placeholder: "Enter value",
	},
};

export const FieldWithButton: Story = {
	render() {
		return (
			<div className="flex gap-0.5">
				<TextField className="flex-1" placeholder="Email address" />
				<Button variant="secondary-blue">{"Subscribe"}</Button>
			</div>
		);
	},
};
