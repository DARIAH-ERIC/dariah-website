import cn from "clsx/lite";
import { useTranslations } from "next-intl";
import type { ComponentProps, ReactNode } from "react";

import { Navigation } from "@/app/(app)/(default)/_components/navigation";
import { Image } from "@/components/image";
import { Link } from "@/components/link";
import { createHref } from "@/lib/navigation/create-href";
import type { NavigationConfig } from "@/lib/navigation/navigation";
import logo from "@/public/assets/images/logo-dariah-eu.svg";

interface DefaultHeaderProps extends ComponentProps<"header"> {}

export function DefaultHeader(props: Readonly<DefaultHeaderProps>): ReactNode {
	const { className, ...rest } = props;

	const t = useTranslations("DefaultHeader");

	const label = t("navigation.label");

	const navigation = {
		home: {
			type: "link",
			href: createHref({ pathname: "/" }),
			label: t("navigation.items.home"),
		},
	} satisfies NavigationConfig;

	return (
		<header
			{...rest}
			className={cn(
				"mx-auto flex w-full max-w-(--breakpoint-2xl) items-center justify-between gap-x-8 px-6 py-3.5",
				className,
			)}
		>
			<Link href={navigation.home.href}>
				<span className="sr-only">{navigation.home.label}</span>
				<Image alt="" className="h-auto w-48" loading="eager" src={logo} />
			</Link>

			<Navigation label={label} navigation={navigation} />

			<div></div>
		</header>
	);
}
