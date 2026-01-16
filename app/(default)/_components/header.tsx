import cn from "clsx/lite";
import { getTranslations } from "next-intl/server";
import type { ComponentProps, ReactNode } from "react";

import { Navigation } from "@/app/(default)/_components/navigation";
import { client } from "@/lib/data/client";

interface HeaderProps extends ComponentProps<"header"> {}

export async function Header(props: Readonly<HeaderProps>): Promise<ReactNode> {
	const { className, ...rest } = props;

	const t = await getTranslations("(default).Header");

	const label = t("navigation.label");

	const { primary: navigation } = await client.navigation();

	return (
		<header {...rest} className={cn("bg-white shadow-header", className)}>
			<div className="py-8 pl-34.5 pr-36.75 max-w-480 mx-auto">
				<Navigation label={label} navigation={navigation} />
			</div>
		</header>
	);
}
