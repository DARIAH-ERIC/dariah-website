import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
	NavLink,
	NavMenu,
	NavMenuButton,
	NavMenuItem,
	NavMenuSeparator,
	NavMenuTrigger,
} from "@/components/navigation";

const meta = {
	title: "Blocks/Navigation",
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Navigation: Story = {
	render() {
		return (
			<nav>
				<ul className="flex gap-x-2 items-center flex-wrap" role="list">
					<li>
						<NavLink href="#">Home</NavLink>
					</li>
					<li>
						<NavMenuTrigger>
							<NavMenuButton>About</NavMenuButton>
							<NavMenu>
								<NavMenuItem href="#">About me</NavMenuItem>
								<NavMenuItem href="#">About you</NavMenuItem>
								<NavMenuItem href="#">About us</NavMenuItem>
								<NavMenuSeparator />
								<NavMenuItem href="#">About everything</NavMenuItem>
							</NavMenu>
						</NavMenuTrigger>
					</li>
					<li>
						<NavLink href="#">News</NavLink>
					</li>
					<li>
						<NavLink href="#">Events</NavLink>
					</li>
				</ul>
			</nav>
		);
	},
};
