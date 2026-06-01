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
			"icon-button": cn(
				"p-2.5 bg-gray-100 *:p-0! [&_svg]:fill-black",
				"hover:bg-button-bg hover:[&_svg]:fill-primary",
				"focus:bg-button-bg focus:outline-3 focus:outline-primary focus:[&_svg]:fill-primary",
				"pressed:bg-button-bg pressed:outline-none pressed:[&_svg]:fill-black",
				"disabled:text-gray-400",
			),
			paragraph: cn(
				"gap-2 text-regular text-[18px] w-fit underline text-primary",
				"hover:text-black hover:[&>svg]:fill-black",
				"focus-visible:text-section-text focus-visible:decoration-[3px] focus-visible:underline-offset-[24%] focus-visible:underline focus-visible:[&>svg]:fill-black focus-visible:[&>span]:bg-accent-100",
				"focus-visible:outline-none",
			),
			"breadcrumb-current": "text-regular text-black text-[14px] cursor-default!",
			"button-primary": cn(
				"cursor-pointer p-1.5 box-border *:flex *:justify-center *:items-center *:size-full *:gap-2",
				"transition-colors duration-200 ease-in-out",
				"bg-white outline-2 outline-primary text-in-text-link font-bold text-regular w-58.75 *:py-2.5 *:px-4.5",
				"hover:bg-primary hover:outline-white hover:text-white",
				"focus:bg-white focus:outline-primary focus:text-in-text-link focus:*:outline-2 focus:*:outline-primary",
			),
			"button-secondary-blue": cn(
				"cursor-pointer p-1.5 box-border *:flex *:justify-center *:items-center *:size-full *:gap-2",
				"transition-colors duration-200 ease-in-out",
				"bg-primary outline-2 outline-white text-white text-regular font-bold shadow-light *:py-2.5 *:px-4.5",
				"hover:bg-white hover:outline-primary hover:text-primary",
				"focus:bg-primary focus:text-white focus:outline-white focus:*:outline-2 focus:*:outline-white",
			),
			"button-secondary-black": cn(
				"cursor-pointer p-1.5 box-border *:flex *:justify-center *:items-center *:size-full *:gap-2",
				"transition-colors duration-200 ease-in-out",
				"bg-text-link-bg outline-2 outline-white text-white text-regular font-bold shadow-light *:py-2.5 *:px-4.5",
				"hover:bg-white hover:outline-text-link-bg hover:text-text-link-bg",
				"focus:bg-text-link-bg focus:text-white focus:outline-white focus:*:outline-2 focus:*:outline-white",
			),
			"button-tertiary": cn(
				"cursor-pointer p-1.5 box-border *:flex *:justify-center *:items-center *:size-full *:gap-2",
				"transition-colors duration-200 ease-in-out",
				"bg-primary outline-2 outline-white text-white text-regular w-62.75 *:py-0.5 *:px-4.5",
				"hover:bg-white hover:outline-primary hover:text-primary",
				"focus:bg-primary focus:outline-white focus:text-white focus:*:outline-2 focus:*:outline-white",
			),
			unstyled: "",
		},
	},
	defaults: {
		variant: "primary",
	},
});
