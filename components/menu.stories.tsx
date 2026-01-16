import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
	Menu,
	MenuItem,
	MenuSection,
	MenuSeparator,
	MenuTrigger,
	SubmenuTrigger,
} from "@/components/menu";
import { Button } from "@/components/ui/button/button";

const meta = {
	title: "Components/Menu",
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
				<Button variant="secondary-black">Open Menu</Button>
				<Menu>
					<MenuItem>Home</MenuItem>
					<MenuItem>About</MenuItem>
					<MenuItem>Contact</MenuItem>
					<MenuSeparator />
					<MenuItem>Settings</MenuItem>
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
				<Button variant="secondary-black">Open Menu</Button>
				<Menu>
					<MenuItem>Home</MenuItem>
					<MenuItem>About</MenuItem>
					<MenuSection title="Projects">
						<MenuItem>Project 1</MenuItem>
						<MenuItem>Project 2</MenuItem>
					</MenuSection>
					<MenuSeparator />
					<SubmenuTrigger>
						<MenuItem>More Options</MenuItem>
						<Menu>
							<MenuItem>Option A</MenuItem>
							<MenuItem>Option B</MenuItem>
							<MenuItem>Option C</MenuItem>
						</Menu>
					</SubmenuTrigger>
				</Menu>
			</MenuTrigger>
		);
	},
};
