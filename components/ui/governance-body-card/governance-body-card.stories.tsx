import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { GovernanceBodyCard } from "@/components/ui/governance-body-card/governance-body-card";

const meta = {
	title: "Components/UI/GovernanceBodyCard",
	component: GovernanceBodyCard,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: { type: "select" },
			options: [
				"governing-body",
				"executive-body",
				"advisory-body",
				"operational-body",
				"working-group",
			],
		},
		relationships: {
			control: { type: "select", multiple: true },
			options: [
				"appoints-bod",
				"appoints-sab",
				"appoints-dco-and-jrc",
				"advises-bod",
				"represented-in-smt",
				"oversees-wg",
				"supports-wg",
				"supports-ncc-and-jrc",
			],
		},
	},
} satisfies Meta<typeof GovernanceBodyCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const GoverningBody: Story = {
	args: {
		variant: "governing-body",
		name: "General Assembly",
		description:
			"The governing body of DARIAH ERIC with full decision-making powers. Represents the Members.",
		usersCount: 25,
		// eslint-disable-next-line object-shorthand
		onClick: () => {
			return null;
		},
		relationships: ["appoints-bod", "appoints-sab"],
	},
};

export const ExecutiveBody: Story = {
	args: {
		variant: "executive-body",
		name: "General Assembly",
		description:
			"The governing body of DARIAH ERIC with full decision-making powers. Represents the Members.",
		usersCount: 25,
		// eslint-disable-next-line object-shorthand
		onClick: () => {
			return null;
		},
		relationships: ["appoints-bod", "advises-bod"],
	},
};

export const AdvisoryBody: Story = {
	args: {
		variant: "advisory-body",
		name: "General Assembly",
		description:
			"The governing body of DARIAH ERIC with full decision-making powers. Represents the Members.",
		usersCount: 25,
		// eslint-disable-next-line object-shorthand
		onClick: () => {
			return null;
		},
		relationships: ["appoints-bod", "advises-bod"],
	},
};

export const OperationalBody: Story = {
	args: {
		variant: "operational-body",
		name: "General Assembly",
		description:
			"The governing body of DARIAH ERIC with full decision-making powers. Represents the Members.",
		usersCount: 25,
		// eslint-disable-next-line object-shorthand
		onClick: () => {
			return null;
		},
		relationships: ["appoints-bod", "advises-bod"],
	},
};

export const WorkingGroup: Story = {
	args: {
		variant: "working-group",
		name: "General Assembly",
		description:
			"The governing body of DARIAH ERIC with full decision-making powers. Represents the Members.",
		usersCount: 25,
		// eslint-disable-next-line object-shorthand
		onClick: () => {
			return null;
		},
		relationships: ["appoints-bod", "advises-bod"],
	},
};
