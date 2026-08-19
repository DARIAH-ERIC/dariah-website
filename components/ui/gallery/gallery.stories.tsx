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

const image = {
	srcUrl: "/assets/images/temp-news-1.jpg",
	width: 1350,
	height: 900,
	alt: null,
};

const items = [
	{ caption: "A caption for the first image", image: { ...image, alt: "First" } },
	{ image: { ...image, alt: "Second" } },
	{ caption: "A caption for the third image", image: { ...image, alt: "Third" } },
	{ image: { ...image, alt: "Fourth" } },
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
