import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GalleryCarousel } from "@/components/ui/gallery/gallery-carousel";
import { GalleryGrid } from "@/components/ui/gallery/gallery-grid";

const meta = {
	title: "Components/UI/Gallery",
	component: GalleryGrid,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
	argTypes: {},
} satisfies Meta<typeof GalleryGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

const items = [
	{ alt: "First", caption: "A caption for the first image", url: "/assets/images/temp-news-1.jpg" },
	{ alt: "Second", url: "/assets/images/temp-news-1.jpg" },
	{ alt: "Third", caption: "A caption for the third image", url: "/assets/images/temp-news-1.jpg" },
	{ alt: "Fourth", url: "/assets/images/temp-news-1.jpg" },
];

export const Grid: Story = {
	args: { items },
	render(args) {
		return (
			<div className="@container">
				<GalleryGrid {...args} />
			</div>
		);
	},
};

export const CarouselLayout: Story = {
	args: { items },
	render(args) {
		return (
			<div className="@container max-w-200">
				<GalleryCarousel {...args} />
			</div>
		);
	},
};
