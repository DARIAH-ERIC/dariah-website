import cn from "clsx/lite";
import { getTranslations } from "next-intl/server";
import type { ComponentProps, ReactNode } from "react";

import { Navigation } from "@/app/(default)/_components/navigation";
import { navigation } from "@/lib/data/client";

interface HeaderProps extends ComponentProps<"header"> {}

export async function Header(props: Readonly<HeaderProps>): Promise<ReactNode> {
	const { className, ...rest } = props;

	const t = await getTranslations("(default).Header");

	const label = t("navigation.label");

	const { primary } = navigation();

	return (
		<header {...rest} className={cn("bg-white shadow-header", className)}>
			<div className="p-4 max-w-480 mx-auto xl:py-8 xl:pl-34.5 xl:pr-36.75">
				<Navigation label={label} navigation={primary} />
			</div>
		</header>
	);
}
