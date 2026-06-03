"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";

interface QuickLink {
	link: string | undefined;
	label: string;
}

interface QuickLinksProps {
	links?: Array<QuickLink>;
	className?: string;
}

export function QuickLinks(props: Readonly<QuickLinksProps>): ReactNode {
	const { links, className } = props;
	const t = useTranslations("(default).StaticPage");

	return (
		<div className={cn("flex-col gap-4 w-full h-fit lg:top-0 lg:sticky lg:w-51.5", className)}>
			<Typography className="text-[45px] font-light" variant="h4">
				{t("quickLinks.title")}
			</Typography>
			{links === undefined || links.length === 0 ? (
				<Typography variant="regular">{t("quickLinks.emptyState")}</Typography>
			) : (
				links.map((linkItem) => {
					const { link, label } = linkItem;
					const key = `${label}-${link ?? "no-link"}`;

					return (
						<Link key={key} href={link} variant="primary" withDefaultRightIcon={true}>
							{label}
						</Link>
					);
				})
			)}
		</div>
	);
}
