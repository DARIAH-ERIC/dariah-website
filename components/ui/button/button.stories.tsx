import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/components/ui/button/button";
import { SearchIcon } from "@/components/ui/icons/search";

const meta = {
	title: "Components/UI/Button",
	component: Button,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["primary", "secondary-blue", "secondary-black", "tertiary", "icon-button"],
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

export const SecondaryBlue: Story = {
	args: {
		variant: "secondary-blue",
		children: "Secondary blue",
	},
};

export const SecondaryBlack: Story = {
	args: {
		variant: "secondary-black",
		children: "Secondary black",
	},
};

export const Tertiary: Story = {
	args: {
		variant: "tertiary",
		children: "Tertiary",
	},
};

export const ColorBg: Story = {
	args: {
		variant: "color-bg",
		children: "Color background",
	},
	render(args) {
		return (
			<div className="py-10 px-20 bg-primary">
				<Button {...args} />
			</div>
		);
	},
};

export const IconOnly: Story = {
	args: {
		"aria-label": "Search",
		variant: "icon-button",
		children: <SearchIcon aria-hidden={true} />,
	},
};

export const AllVariants: Story = {
	render() {
		return (
			<div className="flex flex-wrap items-center gap-3">
				<Button variant="primary">Primary</Button>
				<Button variant="secondary-blue">Secondary blue</Button>
				<Button variant="secondary-black">Secondary black</Button>
				<Button variant="tertiary">Tertiary</Button>
				<div className="py-10 px-20 bg-primary">
					<Button variant="color-bg">Color background</Button>
				</div>
				<Button aria-label="Search" variant="icon-button">
					<SearchIcon aria-hidden={true} />
				</Button>
			</div>
		);
	},
};
