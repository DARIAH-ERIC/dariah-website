import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { DatePicker } from "@/components/ui/date-picker/date-picker";

const meta = {
	title: "Components/UI/DatePicker",
	component: DatePicker,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof DatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
	args: {
		label: "Pickdate",
	},
};
