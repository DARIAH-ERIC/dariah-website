/* eslint-disable jsx-a11y/anchor-is-valid */
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Link } from "@/components/ui/link/link";

const meta = {
	title: "Components/UI/Link",
	component: Link,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["primary", "secondary", "tertiary", "color-bg"],
		},
		href: {
			control: { type: "select" },
			options: ["#"],
		},
	},
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		variant: "primary",
		href: "#",
		children: "Primary",
		withDefaultLeftIcon: true,
		withDefaultRightIcon: true,
	},
};

export const Secondary: Story = {
	args: {
		variant: "secondary",
		href: "#",
		children: "Secondary",
		withDefaultLeftIcon: true,
		withDefaultRightIcon: true,
	},
};

export const Tertiary: Story = {
	args: {
		variant: "tertiary",
		href: "#",
		children: "Tertiary",
		withDefaultLeftIcon: true,
		withDefaultRightIcon: true,
	},
};

export const Paragraph: Story = {
	args: {
		variant: "paragraph",
		href: "#",
		children: "Paragraph",
		withDefaultLeftIcon: true,
		withDefaultRightIcon: true,
	},
};

export const ColorBg: Story = {
	render() {
		return (
			<div className="bg-primary p-4">
				<Link href="#" variant="color-bg" withDefaultLeftIcon={true} withDefaultRightIcon={true}>
					Color Bg
				</Link>
			</div>
		);
	},
};

export const AllVariants: Story = {
	render() {
		return (
			<div className="flex flex-wrap items-center gap-3">
				<Link href="#" variant="primary" withDefaultLeftIcon={true} withDefaultRightIcon={true}>
					Primary
				</Link>
				<Link href="#" variant="secondary" withDefaultLeftIcon={true} withDefaultRightIcon={true}>
					Secondary
				</Link>
				<Link href="#" variant="tertiary" withDefaultLeftIcon={true} withDefaultRightIcon={true}>
					Tertiary
				</Link>
				<div className="bg-primary p-4">
					<Link href="#" variant="color-bg" withDefaultLeftIcon={true} withDefaultRightIcon={true}>
						Color Bg
					</Link>
				</div>
			</div>
		);
	},
};
