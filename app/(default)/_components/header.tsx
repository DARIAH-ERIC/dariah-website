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
		<header {...rest} className={cn("border-b border-stroke-weak", className)}>
			<div className="container flex items-center justify-between gap-x-12 px-8 py-4 xs:px-16">
				<Navigation label={label} navigation={navigation} />
			</div>
		</header>
	);
}
