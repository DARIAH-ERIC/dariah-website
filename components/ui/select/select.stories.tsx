import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Select, SelectItem } from "@/components/ui/select/select";

const meta = {
	title: "Components/UI/Select",
	component: Select,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BasicSelect: Story = {
	args: {},
	render() {
		return (
			<Select label="Basic Select" placeholder="Select an item">
				<SelectItem>Aerospace</SelectItem>
				<SelectItem>Mechanical</SelectItem>
				<SelectItem>Civil</SelectItem>
				<SelectItem>Biomedical</SelectItem>
			</Select>
		);
	},
};
