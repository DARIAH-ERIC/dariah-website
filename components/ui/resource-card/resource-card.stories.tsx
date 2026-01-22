import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ResourceCard } from "@/components/ui/resource-card/resource-card";

const meta = {
	title: "Components/UI/ResourceCard",
	component: ResourceCard,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof ResourceCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ToolOrService: Story = {
	args: {
		title: "DARIAH Zotero library",
		description:
			"DARIAH Zotero library brings together collection of bibliographic items created within the DARIAH environment or citing DARIAH.",
		serviceType: "core",
		resourceCategory: "toolOrService",
	},
};

export const TrainingMaterial: Story = {
	args: {
		title: "DARIAH Zotero library",
		description:
			"DARIAH Zotero library brings together collection of bibliographic items created within the DARIAH environment or citing DARIAH.",
		resourceCategory: "trainingMaterial",
	},
};

export const Workflow: Story = {
	args: {
		title: "DARIAH Zotero library",
		description:
			"DARIAH Zotero library brings together collection of bibliographic items created within the DARIAH environment or citing DARIAH.",
		resourceCategory: "workflow",
	},
};

export const Publication: Story = {
	args: {
		title: "DARIAH Zotero library",
		description:
			"DARIAH Zotero library brings together collection of bibliographic items created within the DARIAH environment or citing DARIAH.",
		resourceCategory: "publication",
	},
};
