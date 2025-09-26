import { cn } from "@acdh-oeaw/style-variants";
import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva("flex items-center justify-center", {
	variants: {
		variant: {
			primary: cn(
				"rounded-8 bg-primary-500 text-white",
				"hover:bg-primary-600",
				"focus:outline-2 focus:outline-accent-600",
				"[&[data-pressed]]:bg-primary-700 [&[data-pressed]]:outline-none",
				"disabled:bg-gray-500 disabled:text-gray-200",
				"shadow-light-button active:shadow-medium-button hover:shadow-medium-button focus:shadow-large-button disabled:shadow-medium-button",
			),
			secondary: cn(
				"rounded-8 border-primary-500 bg-white text-primary-500",
				"hover:bg-primary-100",
				"focus:outline-2 focus:outline-accent-600",
				"[&[data-pressed]]:bg-primary-200 [&[data-pressed]]:outline-none",
				"disabled:border-gray-400 disabled:bg-gray-300 disabled:text-gray-500",
				"shadow-light-button active:shadow-medium-button hover:shadow-medium-button focus:shadow-large-button disabled:shadow-medium-button",
			),
			"text-primary": cn(
				"gap-2 bg-transparent p-0 text-medium text-primary-500",
				"[&>span]:mb-px [&>span]:border-b [&>span]:border-primary-500 [&>span]:py-1",
				"hover:text-primary-600 [&>span]:hover:mb-0 [&>span]:hover:border-b-2",
				"focus:text-black focus:outline-none [&>span]:focus:mb-0 [&>span]:focus:border-b-2 [&>span]:focus:border-black [&>span]:focus:bg-accent-300",
				"[&[data-pressed]]:text-primary-700 [&>span]:[&[data-pressed]]:mb-px [&>span]:[&[data-pressed]]:border-b [&>span]:[&[data-pressed]]:border-primary-700 [&>span]:[&[data-pressed]]:bg-transparent",
			),
			"text-standard": cn(
				"gap-4 bg-transparent px-0 py-2 text-medium text-black",
				"[&>span]:mb-px [&>span]:border-b [&>span]:py-1",
				"hover:text-primary-600 [&>span]:hover:mb-0 [&>span]:hover:border-b-2",
				"focus:text-black focus:outline-none [&>span]:focus:mb-0 [&>span]:focus:border-b-2 [&>span]:focus:border-black [&>span]:focus:bg-accent-300",
				"[&[data-pressed]]:text-primary-700 [&>span]:[&[data-pressed]]:mb-px [&>span]:[&[data-pressed]]:border-b [&>span]:[&[data-pressed]]:border-primary-700 [&>span]:[&[data-pressed]]:bg-transparent",
			),
			icon: cn(
				"m-[2px] rounded-1 bg-gray-100 p-2 text-primary-500",
				"hover:bg-primary-200",
				"focus:m-0 focus:border-2 focus:border-accent-600 focus:outline-none",
				"disabled:text-gray-400",
			),
		},
		size: {
			sm: "py-2 px-4 gap-4 text-medium",
			lg: "py-4 px-6 gap-4 text-h5",
		},
	},
	compoundVariants: [
		{
			variant: "secondary",
			size: "sm",
			class: "border",
		},
		{
			variant: "secondary",
			size: "lg",
			class: "border-2",
		},
	],
	defaultVariants: {
		variant: "primary",
	},
});

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
