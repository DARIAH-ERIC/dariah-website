import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Image } from "@/components/image";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";
import { navigation } from "@/lib/data/client";
import logoDariah from "@/public/assets/images/logo-dariah-eu.svg";

export function NotFound(): ReactNode {
	const t = useTranslations("GlobalNotFoundPage");
	const breadcrumbs = navigation().breadcrumbs.notFound;

	return (
		<div className="flex flex-1 flex-col gap-8 px-4 pt-8 lg:px-8 lg:pb-12 xl:px-40">
			{breadcrumbs.length > 0 && (
				<Breadcrumbs>
					{breadcrumbs.map(({ label, href }) => {
						return (
							<Breadcrumb key={label} href={href}>
								{label}
							</Breadcrumb>
						);
					})}
				</Breadcrumbs>
			)}
			<div className="flex min-h-[30vw] flex-wrap flex-1 gap-6 px-4 items-center justify-center lg:px-8 lg:gap-15">
				<Image alt={t("title")} className={"h-22 w-72.5 lg:h-38.5 lg:w-107"} src={logoDariah} />
				<div className="flex flex-col gap-8 h-fit">
					<Typography className="font-bold" variant="h2">
						{t("title")}
					</Typography>
					<Typography variant="regular">{t("description")}</Typography>
					<Link href="/" variant="primary" withDefaultLeftIcon={true}>
						{t("button")}
					</Link>
				</div>
			</div>
		</div>
	);
}
