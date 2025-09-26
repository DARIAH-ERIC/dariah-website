import type { Metadata, ResolvingMetadata } from "next";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { defaultLocale } from "@/lib/i18n/locales";
import { createSingletonResource } from "@/lib/keystatic/resources";
import { getMembersAndPartners } from "@/lib/knowledge-base/get-data";
import type { Country } from "@/types/kb";

interface MembersAndPartnersOverviewPageProps {}

export async function generateMetadata(
	_props: Readonly<MembersAndPartnersOverviewPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const membersAndPartnersOverview = await createSingletonResource(
		"members-and-partners-overview",
		defaultLocale,
	).read();

	const metadata: Metadata = {
		title: membersAndPartnersOverview.data.title,
	};
	return metadata;
}

export default async function MembersAndPartnersOverviewPage(
	_props: Readonly<MembersAndPartnersOverviewPageProps>,
): Promise<ReactNode> {
	const membersAndPartnersOverview = await createSingletonResource(
		"members-and-partners-overview",
		defaultLocale,
	).read();
	const membersAndPartners: Array<Country> = await getMembersAndPartners();

	return (
		<MainContent className="layout-grid content-start">
			<section className="layout-subgrid prose relative gap-y-12 py-16 xs:py-24">
				<header>
					<h1 className="text-balance font-heading text-heading-1 font-strong text-text-strong">
						{membersAndPartnersOverview.data.title}
					</h1>
					<p className="mt-6 font-heading text-heading-4 text-text-weak">
						{membersAndPartnersOverview.data.lead}
					</p>
				</header>
				<ul className="flex flex-col gap-y-8" role="list">
					{membersAndPartners
						.sort((a, b) => {
							return a.name.localeCompare(b.name);
						})
						.map((membersandpartnersobj) => {
							const {
								code,
								consortiumName,
								description,
								name,
								nationalCoordinatingInstitution,
								nationalCoordinators,
								nationalCoordinatorDeputies,
								nationalRepresentativeInstitution,
								nationalRepresentatives,
								outreachUrl,
								partnerInstitutions,
								type,
							} = membersandpartnersobj;

							return (
								<div key={code}>
									<h2 className="text-heading-2">{name}</h2>
									<dl className="mt-2 flex flex-col gap-y-2">
										<h3>About</h3>
										<div dangerouslySetInnerHTML={{ __html: description }}></div>
										<div>
											<dt className="font-semibold">Consortium Name:</dt>
											<dd>{consortiumName}</dd>
										</div>
										<div>
											<dt className="font-semibold">National Website:</dt>
											<dd>{outreachUrl}</dd>
										</div>
										<div>
											<dt className="font-semibold">Type:</dt>
											<dd>{type}</dd>
										</div>
										{nationalRepresentativeInstitution ? (
											<div>
												<dt className="font-semibold">Representing entity:</dt>
												<dd>
													{nationalRepresentativeInstitution.name} <br />
													{nationalRepresentativeInstitution.urls?.join(", ")}
												</dd>
											</div>
										) : null}
										{nationalRepresentatives.length > 0 && (
											<div>
												<dt className="font-semibold">National Representatives:</dt>
												<dd>{nationalRepresentatives.join(", ")}</dd>
											</div>
										)}
										{nationalCoordinatingInstitution ? (
											<div>
												<dt className="font-semibold">National Coordinating Institution:</dt>
												<dd>
													{nationalCoordinatingInstitution.name} <br />
													{nationalCoordinatingInstitution.urls.join(", ")}
												</dd>
											</div>
										) : null}
										{nationalCoordinators.length > 0 && (
											<div>
												<dt className="font-semibold">National Coordinators:</dt>
												<dd>{nationalCoordinators.join(", ")}</dd>
											</div>
										)}
										{nationalCoordinatorDeputies.length > 0 && (
											<div>
												<dt className="font-semibold">National Coordinator Deputies:</dt>
												<dd>{nationalCoordinatorDeputies.join(", ")}</dd>
											</div>
										)}
										{partnerInstitutions.length > 0 && (
											<div>
												<dt className="font-semibold">Partner Institutions:</dt>
												<dd>
													{partnerInstitutions.map((partnerInstitution) => {
														const { name, website, startDate, endDate } = partnerInstitution;
														return (
															<dl key={`${name}_${startDate}_${endDate}`}>
																<dt>{name}</dt>
																<dd>
																	{website}
																	<br />
																	{startDate}
																	<br />
																	{endDate}
																</dd>
															</dl>
														);
													})}
												</dd>
											</div>
										)}
									</dl>
								</div>
							);
						})}
				</ul>
			</section>
		</MainContent>
	);
}
