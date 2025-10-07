import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import { env } from "@/config/env.config";
import { defaultLocale } from "@/lib/i18n/locales";
import { getRelatedEntities } from "@/lib/keystatic/resolve-relations";
import { createCollectionResource } from "@/lib/keystatic/resources";
import type { Keyword, Organisation, Person } from "@/types/keystatic";

interface ProjectPageProps {
	params: {
		id: string;
	};
}

export const dynamicParams = false;

export async function generateStaticParams(): Promise<
	Awaited<Array<Pick<ProjectPageProps["params"], "id">>>
> {
	const ids = await createCollectionResource("projects", defaultLocale).list();

	return ids.map((id) => {
		/** @see https://github.com/vercel/next.js/issues/63002 */
		return { id: env.NODE_ENV === "production" ? id : encodeURIComponent(id) };
	});
}

export async function generateMetadata(
	props: Readonly<ProjectPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const id = decodeURIComponent(params.id);

	const project = await createCollectionResource("projects", defaultLocale).read(id);

	const metadata: Metadata = {
		title: project.data.title,
	};

	return metadata;
}

export default async function ProjectPage(props: Readonly<ProjectPageProps>): Promise<ReactNode> {
	const { params } = props;

	const id = decodeURIComponent(params.id);

	const t = await getTranslations("ProjectPage");

	const project = await createCollectionResource("projects", defaultLocale).read(id);

	const { default: Content } = await project.compile(project.data.content);

	const list = new Intl.ListFormat([defaultLocale]);

	const {
		startDate,
		endDate,
		projectPartners: projectPartnersSlugs,
		responsiblePersons: responsiblePersonsSlugs,
		title,
		keywords: keywordsSlugs,
	} = project.data;

	const responsiblePersons = (await getRelatedEntities(
		responsiblePersonsSlugs as Array<string>,
		"persons",
		defaultLocale,
	)) as unknown as Array<Person>;

	const projectPartners = (await getRelatedEntities(
		projectPartnersSlugs as Array<string>,
		"organisations",
		defaultLocale,
	)) as unknown as Array<Organisation>;

	const keywords = (await getRelatedEntities(
		keywordsSlugs as Array<string>,
		"keywords",
		defaultLocale,
	)) as unknown as Array<Keyword>;

	return (
		<MainContent className="layout-grid content-start">
			<section className="layout-subgrid relative bg-fill-weaker py-16">
				<div className="max-w-text grid gap-y-8">
					<h1 className="text-balance font-heading text-heading-1 font-strong text-neutral-900">
						{title}
					</h1>
					<dl className="grid  gap-y-2 pt-8">
						{projectPartners.length > 0 && (
							<div className="grid gap-y-1 text-sm">
								<dt className="font-strong uppercase">{t("partners")}</dt>
								<dd>
									{projectPartners.map((partner) => {
										const { name } = partner;
										return name;
									})}
								</dd>
							</div>
						)}
						{responsiblePersons.length > 0 && (
							<div className="grid gap-y-1 text-sm">
								<dt className="font-strong uppercase">{t("responsible-persons")}</dt>
								<dd>
									{responsiblePersons.map((person) => {
										return person.name;
									})}
								</dd>
							</div>
						)}
						<div className="grid gap-y-1 text-sm">
							<dt className="font-strong uppercase">{t("project-start")}</dt>
							<dd>{startDate}</dd>
						</div>
						<div className="grid gap-y-1 text-sm">
							<dt className="font-strong uppercase">{t("project-end")}</dt>
							<dd>{endDate}</dd>
						</div>
						<div className="grid gap-y-1 text-sm">
							<dt className="font-strong uppercase">{t("keywords")}</dt>
							<dd>
								{list.format(
									keywords.map((keyword) => {
										return keyword.label;
									}),
								)}
							</dd>
						</div>
					</dl>
				</div>
			</section>
			<section className="layout-subgrid typography content-max-w-text relative border-t border-neutral-200 py-16 xs:py-20">
				<Content />
			</section>
		</MainContent>
	);
}
