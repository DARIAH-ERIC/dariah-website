import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Checkbox, CheckboxGroup } from "@/components/checkbox";

const meta = {
	title: "Components/Checkbox",
	component: Checkbox,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	argTypes: {
		isDisabled: {
			control: { type: "boolean" },
		},
		isSelected: {
			control: { type: "boolean" },
		},
		isIndeterminate: {
			control: { type: "boolean" },
		},
	},
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {
	args: {
		children: "Unchecked Checkbox",
	},
};

export const Checked: Story = {
	args: {
		isSelected: true,
		children: "Checked Checkbox",
	},
};

export const Indeterminate: Story = {
	args: {
		isIndeterminate: true,
		children: "Indeterminate Checkbox",
	},
};

export const Disabled: Story = {
	args: {
		isDisabled: true,
		children: "Disabled Checkbox",
	},
};

export const Group: Story = {
	render() {
		return (
			<CheckboxGroup label="Select options">
				<Checkbox value="option1">Option 1</Checkbox>
				<Checkbox isSelected={true} value="option2">
					Option 2
				</Checkbox>
				<Checkbox value="option3">Option 3</Checkbox>
			</CheckboxGroup>
		);
	},
};

export const GroupWithDescription: Story = {
	render() {
		return (
			<CheckboxGroup
				description="Choose one or more options that apply to you."
				label="Select your preferences"
			>
				<Checkbox value="email">Email notifications</Checkbox>
				<Checkbox value="sms">SMS notifications</Checkbox>
				<Checkbox value="push">Push notifications</Checkbox>
			</CheckboxGroup>
		);
	},
};

export const GroupWithError: Story = {
	render() {
		return (
			<CheckboxGroup
				errorMessage="Please select at least one option."
				isInvalid={true}
				label="Select at least one"
			>
				<Checkbox value="option1">Option 1</Checkbox>
				<Checkbox value="option2">Option 2</Checkbox>
			</CheckboxGroup>
		);
	},
};
