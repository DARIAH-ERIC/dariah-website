import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { ContentBlocks } from "@/components/content-blocks";
import { OrganisationContainer } from "@/components/pages/organisation-and-governance/organisation-container";
import { SelectedBodyContainer } from "@/components/pages/organisation-and-governance/selected-body-container";
import { Breadcrumb, Breadcrumbs } from "@/components/ui/breadcrumbs/breadcrumbs";
import { InfoIcon } from "@/components/ui/icons/info";
import { Typography } from "@/components/ui/typography/typography";
import { client } from "@/lib/data/api-client";
import { navigation } from "@/lib/data/client";
import type { GovernanceBody } from "@/types/governance-body";
import {
	getColorsForGovernanceVariant,
	getGovernanceRelationships,
	getGovernanceVariant,
} from "@/utils/organisation-and-governance.utils";

interface ContactPageSearchParams {
	selectedBody?: GovernanceBody;
	selectedUser?: string;
}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("OrganisationAndGovernance");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function ContactPage({
	searchParams,
}: Readonly<{
	searchParams: Promise<ContactPageSearchParams>;
}>): Promise<ReactNode> {
	const params = await searchParams;
	const { selectedBody, selectedUser } = params;
	const t = await getTranslations("OrganisationAndGovernance");

	const response = await client.governanceBodies.list();
	const breadcrumbs = navigation().breadcrumbs.organisationAndGovernance;
	const staticContentResponse = await client.pages.bySlug({ slug: "organisation-and-governance" });
	const selectedBodyResponse = selectedBody
		? await client.governanceBodies.bySlug({ slug: selectedBody })
		: undefined;

	const { data: selectedPerson } =
		selectedUser !== undefined ? await client.persons.bySlug({ slug: selectedUser }) : {};

	const selectedBodyVariant =
		selectedBody !== undefined ? getGovernanceVariant(selectedBody) : undefined;

	const { bg: selectedBodyBgColor, border: selectedBodyBorderColor } =
		selectedBodyVariant !== undefined ? getColorsForGovernanceVariant(selectedBodyVariant) : {};

	const {
		data: { data: items },
	} = response;

	const { data: selectedBodyItem } = selectedBodyResponse ?? { data: undefined };

	const selectedBodyRelationships = selectedBodyItem
		? getGovernanceRelationships(selectedBodyItem.entity.slug as GovernanceBody)
		: [];

	const usersForSelectedBody = selectedBodyItem?.persons ?? [];

	const {
		data: { content, title },
	} = staticContentResponse;

	return (
		<Main className="container flex flex-col mb-16 relative lg:gap-0 lg:mb-0">
			<div className="flex flex-1 flex-col gap-8 px-4 pt-8 lg:px-8 lg:pb-12 xl:px-20 2xl:px-40">
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
				<Typography className="text-[45px] font-light" variant="h2">
					{title}
				</Typography>
			</div>
			<div className="py-12 px-4 lg:px-34 2xl:px-45 3xl:px-78">
				<ContentBlocks fields={content} />
			</div>
			<div className="flex flex-col gap-2">
				<div className="py-2 flex gap-2 bg-gray-100 shadow-light justify-center items-center w-full">
					<InfoIcon className="size-4" />
					<Typography className="text-[15px]" variant="small">
						{t("infoText")}
					</Typography>
				</div>
				<div>
					<OrganisationContainer governanceBodies={items} />
				</div>
			</div>
			{selectedBody && (
				<SelectedBodyContainer
					selectedBody={selectedBody}
					selectedBodyBgColor={selectedBodyBgColor}
					selectedBodyBorderColor={selectedBodyBorderColor}
					selectedBodyItem={selectedBodyItem}
					selectedBodyRelationships={selectedBodyRelationships}
					selectedBodyVariant={selectedBodyVariant}
					selectedPerson={selectedPerson}
					usersForSelectedBody={usersForSelectedBody}
				/>
			)}
		</Main>
	);
}
