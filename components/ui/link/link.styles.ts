import { cn, styles } from "@acdh-oeaw/style-variants";

export const linkStyles = styles({
	base: ["cursor-pointer flex items-center [&>svg]:size-5 [&>svg]:fill-primary [&>span]:text-wrap"],
	variants: {
		variant: {
			primary: cn(
				"py-2 gap-2 font-semibold text-regular text-section-text",
				"w-fit hover:underline hover:decoration-[10%] hover:text-primary hover:underline-offset-[24%]",
				"focus-visible:text-section-text focus-visible:decoration-[3px] focus-visible:underline-offset-[24%] focus-visible:underline focus-visible:[&>span]:bg-accent-100 focus-visible:[&>svg]:fill-black",
				"focus-visible:outline-none",
			),
			secondary: cn(
				"gap-4 text-regular w-fit text-section-text",
				"hover:text-primary",
				"focus-visible:text-section-text focus-visible:decoration-[3px] focus-visible:underline-offset-[24%] focus-visible:underline focus-visible:[&>span]:bg-accent-100 focus-visible:[&>span]:text-section-text focus-visible:[&>span]:font-medium",
				"focus-visible:outline-none",
			),
			tertiary: cn(
				"gap-2 text-regular text-[14px] w-fit [&>span]:text-primary",
				"hover:text-primary hover:underline hover:decoration-2 hover:underline-offset-[24%]",
				"focus-visible:text-section-text focus-visible:decoration-[3px] focus-visible:underline-offset-[24%] focus-visible:underline focus-visible:[&>span]:bg-accent-100",
				"focus-visible:outline-none",
				"disabled:[&>span]:text-black",
			),
			"color-bg": cn(
				"bg-transparent text-white gap-2 h-11 [&>svg]:fill-white",
				"hover:underline",
				"focus-visible:underline focus-visible:decoration-[3px]",
				"focus-visible:outline-none",
			),
			paragraph: cn(
				"gap-2 text-regular text-[18px] w-fit underline text-primary",
				"hover:text-black hover:[&>svg]:fill-black",
				"focus-visible:text-section-text focus-visible:decoration-[3px] focus-visible:underline-offset-[24%] focus-visible:underline focus-visible:[&>svg]:fill-black focus-visible:[&>span]:bg-accent-100",
				"focus-visible:outline-none",
			),
			"breadcrumb-current": "text-regular text-black text-[14px] cursor-default!",
			unstyled: "",
		},
	},
	defaults: {
		variant: "primary",
	},
});
