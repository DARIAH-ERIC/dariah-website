import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Image } from "@/components/image";
import { Carousel } from "@/components/ui/carousel/carousel";

const meta = {
	title: "Components/UI/Carousel",
	component: Carousel,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	argTypes: {},
} satisfies Meta<typeof Carousel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: null,
	},
	render() {
		return (
			<div className="bg-primary size-fit">
				<Carousel className="w-200">
					<Image alt={"1"} height={244} src={"/assets/images/temp-news-1.jpg"} width={361} />
					<Image alt={"1"} height={244} src={"/assets/images/temp-news-1.jpg"} width={361} />
					<Image alt={"1"} height={244} src={"/assets/images/temp-news-1.jpg"} width={361} />
					<Image alt={"1"} height={244} src={"/assets/images/temp-news-1.jpg"} width={361} />
					<Image alt={"1"} height={244} src={"/assets/images/temp-news-1.jpg"} width={361} />
					<Image alt={"1"} height={244} src={"/assets/images/temp-news-1.jpg"} width={361} />
				</Carousel>
			</div>
		);
	},
};
