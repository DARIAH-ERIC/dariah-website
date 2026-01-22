import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Typography } from "@/components/ui/typography/typography";

const meta = {
	title: "Components/UI/Typography",
	component: Typography,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["h1", "h2", "h3", "h4", "regular", "small", "caption"],
		},
	},
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Heading1: Story = {
	args: {
		variant: "h1",
		children: "Sixty zippers were quickly picked from woven...",
	},
};

export const Heading2: Story = {
	args: {
		variant: "h2",
		children: "Sixty zippers were quickly picked from woven...",
	},
};

export const Heading3: Story = {
	args: {
		variant: "h3",
		children: "Sixty zippers were quickly picked from woven...",
	},
};

export const Heading4: Story = {
	args: {
		variant: "h4",
		children: "Sixty zippers were quickly picked from woven...",
	},
};

export const Regular: Story = {
	args: {
		variant: "regular",
		children: "Sixty zippers were quickly picked from woven...",
	},
};

export const Small: Story = {
	args: {
		variant: "small",
		children: "Sixty zippers were quickly picked from woven...",
	},
};

export const Caption: Story = {
	args: {
		variant: "caption",
		children: "Sixty zippers were quickly picked from woven...",
	},
};

export const AllVariants: Story = {
	render() {
		return (
			<div className="flex flex-col flex-wrap items-start gap-3">
				<Typography variant="h1">H1: Sixty zippers were quickly picked from woven...</Typography>
				<Typography variant="h2">H2: Sixty zippers were quickly picked from woven...</Typography>
				<Typography variant="h3">H3: Sixty zippers were quickly picked from woven...</Typography>
				<Typography variant="h4">H4: Sixty zippers were quickly picked from woven...</Typography>
				<Typography variant="regular">
					Regular: Sixty zippers were quickly picked from woven...
				</Typography>
				<Typography variant="small">
					Small: Sixty zippers were quickly picked from woven...
				</Typography>
				<Typography variant="caption">
					Caption: Sixty zippers were quickly picked from woven...
				</Typography>
			</div>
		);
	},
};
