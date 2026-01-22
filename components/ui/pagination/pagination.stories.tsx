import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Pagination } from "@/components/ui/pagination/pagination";

const meta = {
	title: "Components/UI/Pagination",
	component: Pagination,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	argTypes: {
		pageCount: {
			control: { type: "number" },
		},
		defaultCurrentPage: {
			control: { type: "text" },
		},
	},
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: { pageCount: 12, defaultCurrentPage: "1" },
	render(args) {
		return (
			<div className="bg-black p-4 w-125">
				<Pagination {...args} />
			</div>
		);
	},
};
