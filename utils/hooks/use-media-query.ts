import { useEffect, useState } from "react";

const BREAKPOINTS = {
	xs: 480,
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	"2xl": 1536,
	"3xl": 1920,
};

export const useMediaQuery = (breakpoint: keyof typeof BREAKPOINTS): boolean => {
	const [isMatching, setIsMatching] = useState(false);

	useEffect(() => {
		const updateBreakpoint = () => {
			const width = window.innerWidth;
			setIsMatching(width >= BREAKPOINTS[breakpoint]);
		};
		updateBreakpoint();

		window.addEventListener("resize", updateBreakpoint);
		return () => {
			window.removeEventListener("resize", updateBreakpoint);
		};
	}, [breakpoint]);

	return isMatching;
};
