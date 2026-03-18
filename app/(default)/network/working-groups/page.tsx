import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { WorkingGroupsTabs } from "@/components/pages/working-groups/working-groups-tabs";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/client";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("WorkingGroupsPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function WorkingGroupsPage(): Promise<ReactNode> {
	const t = await getTranslations("WorkingGroupsPage");
	const breadcrumbs = await client.workingGroups.breadcrumbs();
	const data = await client.workingGroups.list();

	return (
		<Main className="container flex flex-1 flex-col gap-8 xl:gap-0">
			<div className="flex flex-col gap-12 px-4 py-8 lg:px-31">
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
				<Typography variant="h2">{t("title")}</Typography>
				<div className="flex flex-col items-center gap-y-12 gap-x-14 xl:items-start xl:flex-row">
					<Typography
						className="max-w-full w-196 text-[22px] whitespace-pre-line"
						variant="regular"
					>
						{t("description")}
					</Typography>
					<div className="flex flex-col max-w-full w-196 gap-2.5 p-8 bg-primary-100 h-fit md:gap-4 md:p-10">
						<Typography className="text-[20px]" variant="h4">
							{t("contact-information.title")}
						</Typography>
						<div className="flex flex-wrap">
							<Typography as={"span"} variant="regular">
								{t("contact-information.description.part1")}
								<Link className="inline" href="/" variant="paragraph">
									{t("contact-information.description.link1")}
								</Link>
								{t("contact-information.description.part2")}
								<Link className="inline" href="/" variant="paragraph">
									{t("contact-information.description.link2")}
								</Link>
							</Typography>
						</div>
					</div>
				</div>
			</div>
			<WorkingGroupsTabs items={data.items} />
		</Main>
	);
}
