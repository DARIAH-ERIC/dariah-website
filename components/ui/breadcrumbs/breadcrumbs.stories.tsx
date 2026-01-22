import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";

const meta = {
	title: "Components/UI/Breadcrumbs",
	component: Breadcrumbs,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {},
	render() {
		return (
			<Breadcrumbs>
				<Breadcrumb href="#">Home</Breadcrumb>
				<Breadcrumb href="#">Page</Breadcrumb>
				<Breadcrumb>Current page</Breadcrumb>
			</Breadcrumbs>
		);
	},
};
