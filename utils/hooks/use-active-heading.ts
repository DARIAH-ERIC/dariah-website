import { useEffect, useState } from "react";

export const useActiveHeading = (ids: Array<string>): string => {
	const [activeId, setActiveId] = useState<string>(ids[0] ?? "");

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
					}
				}
			},
			{
				rootMargin: "0px 0px -80% 0px",
			},
		);

		for (const id of ids) {
			const element = document.getElementById(id);
			if (element) observer.observe(element);
		}

		return () => {
			observer.disconnect();
		};
	}, [ids]);

	return activeId;
};
