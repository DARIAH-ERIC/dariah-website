import type { Metadata } from "next";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { defaultLocale } from "@/lib/i18n/locales";
import { createSingletonResource } from "@/lib/keystatic/resources";
import { getMembersAndPartners } from "@/lib/knowledge-base/get-data";
import type { Country } from "@/types/kb";

export async function generateMetadata(): Promise<Metadata> {
	const page = await createSingletonResource("members-and-partners-overview", defaultLocale).read();

	const { title } = page.data;

	const metadata: Metadata = {
		title,
	};

	return metadata;
}

export default async function MembersAndPartnersPage(): Promise<ReactNode> {
	const page = await createSingletonResource("members-and-partners-overview", defaultLocale).read();

	const { title, lead } = page.data;

	const membersAndPartners: Array<Country> = await getMembersAndPartners();

	return (
		<MainContent>
			<h1 className="text-h1 text-balance">{title}</h1>
			<p>{lead}</p>

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
								<h2 className="text-h2">{name}</h2>
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
		</MainContent>
	);
}
