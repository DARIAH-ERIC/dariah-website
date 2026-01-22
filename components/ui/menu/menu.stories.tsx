import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
	Menu,
	MenuSection,
	MenuSeparator,
	MenuTrigger,
	SubmenuTrigger,
} from "@/components/ui/menu/menu";
import { NavButton } from "@/components/ui/navigation/nav-button";
import { NavMenuItem } from "@/components/ui/navigation/nav-menu-item";

const meta = {
	title: "Components/UI/Menu",
	component: MenuTrigger,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof MenuTrigger>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Simple: Story = {
	args: { children: null },
	render() {
		return (
			<MenuTrigger>
				<NavButton>Open Menu</NavButton>
				<Menu>
					<NavMenuItem>Home</NavMenuItem>
					<NavMenuItem>About</NavMenuItem>
					<NavMenuItem>Contact</NavMenuItem>
					<MenuSeparator />
					<NavMenuItem>Settings</NavMenuItem>
				</Menu>
			</MenuTrigger>
		);
	},
};

export const WithSubmenu: Story = {
	args: { children: null },
	render() {
		return (
			<MenuTrigger>
				<NavButton>Open Menu</NavButton>
				<Menu>
					<NavMenuItem>Home</NavMenuItem>
					<NavMenuItem>About</NavMenuItem>
					<MenuSection title="Projects">
						<NavMenuItem>Project 1</NavMenuItem>
						<NavMenuItem>Project 2</NavMenuItem>
					</MenuSection>
					<MenuSeparator />
					<SubmenuTrigger>
						<NavMenuItem>More Options</NavMenuItem>
						<Menu>
							<NavMenuItem>Option A</NavMenuItem>
							<NavMenuItem>Option B</NavMenuItem>
							<NavMenuItem>Option C</NavMenuItem>
						</Menu>
					</SubmenuTrigger>
				</Menu>
			</MenuTrigger>
		);
	},
};
