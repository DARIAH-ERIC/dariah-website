import { assert } from "@acdh-oeaw/lib";
import cn from "clsx/lite";
import { getTranslations } from "next-intl/server";
import type { ComponentProps, ReactNode } from "react";

import { Navigation } from "@/app/(default)/_components/navigation";
import { client } from "@/lib/data/api-client";
import { convertNavigationMenu } from "@/lib/navigation/convert";
import type { NavigationConfig, NavigationLink } from "@/lib/navigation/navigation";

interface HeaderProps extends ComponentProps<"header"> {}

export async function Header(props: Readonly<HeaderProps>): Promise<ReactNode> {
	const { className, ...rest } = props;

	const t = await getTranslations("(default).Header");

	const label = t("navigation.label");

	const response = await client.navigation.get();
	const navigation = response.data.find((menu) => {
		return menu.name === "primary";
	});
	assert(navigation != null, "Missing primary navigation.");

	const items: NavigationConfig & { home: NavigationLink } = {
		home: {
			type: "link",
			label: t("navigation.items.home"),
			href: "/",
		},
		...convertNavigationMenu(navigation.items),
	};

	return (
		<header {...rest} className={cn("bg-white shadow-header z-10", className)}>
			<div className="p-4 max-w-480 mx-auto xl:py-6 xl:px-8 2xl:py-8 2xl:pl-34.5 2xl:pr-36.75">
				<Navigation label={label} navigation={items} />
			</div>
		</header>
	);
}
