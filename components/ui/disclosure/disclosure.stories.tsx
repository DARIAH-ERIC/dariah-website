import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import {
	Disclosure,
	DisclosureGroup,
	DisclosureHeader,
	DisclosurePanel,
} from "@/components/ui/disclosure/disclosure";
import { NavMenuItem } from "@/components/ui/navigation/nav-menu";

const meta = {
	title: "Components/UI/Disclosure",
	component: Disclosure,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof Disclosure>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
	args: {},
	render() {
		return (
			<div className="bg-primary-700 w-90 min-h-50">
				<Disclosure>
					<DisclosureHeader>About</DisclosureHeader>
					<DisclosurePanel>
						<ul className="flex flex-col gap-2" role="list">
							<NavMenuItem href="/about">About DARIAH</NavMenuItem>
							<NavMenuItem href="/about/people">People</NavMenuItem>
							<NavMenuItem href="/about/partners">Partners</NavMenuItem>
						</ul>
					</DisclosurePanel>
				</Disclosure>
			</div>
		);
	},
};

export const Group: Story = {
	args: {},
	render() {
		return (
			<div className="bg-primary-700 w-90 min-h-50">
				<DisclosureGroup>
					<Disclosure>
						<DisclosureHeader>About</DisclosureHeader>
						<DisclosurePanel>
							<ul className="flex flex-col gap-2" role="list">
								<NavMenuItem href="/about">About DARIAH</NavMenuItem>
								<NavMenuItem href="/about/people">People</NavMenuItem>
								<NavMenuItem href="/about/partners">Partners</NavMenuItem>
							</ul>
						</DisclosurePanel>
					</Disclosure>
					<Disclosure>
						<DisclosureHeader>About</DisclosureHeader>
						<DisclosurePanel>
							<ul className="flex flex-col gap-2" role="list">
								<NavMenuItem href="/about">About DARIAH</NavMenuItem>
								<NavMenuItem href="/about/people">People</NavMenuItem>
								<NavMenuItem href="/about/partners">Partners</NavMenuItem>
							</ul>
						</DisclosurePanel>
					</Disclosure>
				</DisclosureGroup>
			</div>
		);
	},
};
