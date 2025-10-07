import { promise } from "@acdh-oeaw/lib";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
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
	Array<Pick<ProjectPageProps["params"], "id">>
> {
	const ids = await createCollectionResource("projects", defaultLocale).list();

	return ids.map((id) => {
		/** @see https://github.com/vercel/next.js/issues/63002 */
		return { id: env.NODE_ENV === "production" ? id : encodeURIComponent(id) };
	});
}

export async function generateMetadata(props: Readonly<ProjectPageProps>): Promise<Metadata> {
	const { params } = props;

	const id = decodeURIComponent(params.id);

	const { data: entry, error } = await promise(() => {
		return createCollectionResource("projects", defaultLocale).read(id);
	});

	if (error != null) {
		notFound();
	}

	const { title } = entry.data;

	const metadata: Metadata = {
		title,
	};

	return metadata;
}

export default async function ProjectPage(props: Readonly<ProjectPageProps>): Promise<ReactNode> {
	const { params } = props;

	const id = decodeURIComponent(params.id);

	const t = await getTranslations("ProjectPage");
	const format = await getFormatter();

	const { data: entry, error } = await promise(() => {
		return createCollectionResource("projects", defaultLocale).read(id);
	});

	if (error != null) {
		notFound();
	}

	const {
		startDate,
		endDate,
		projectPartners: projectPartnersSlugs,
		responsiblePersons: responsiblePersonsSlugs,
		title,
		keywords: keywordsSlugs,
	} = entry.data;

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
		<MainContent>
			<div className="grid gap-y-8">
				<h1 className="text-h1 text-balance">{title}</h1>

				<dl className="grid  gap-y-2 pt-8">
					{projectPartners.length > 0 ? (
						<div className="grid gap-y-1 text-sm">
							<dt className="font-bold uppercase">{t("partners")}</dt>
							<dd>
								{projectPartners.map((partner) => {
									const { name } = partner;
									return name;
								})}
							</dd>
						</div>
					) : null}

					{responsiblePersons.length > 0 ? (
						<div className="grid gap-y-1 text-sm">
							<dt className="font-bold uppercase">{t("responsible-persons")}</dt>
							<dd>
								{responsiblePersons.map((person) => {
									return person.name;
								})}
							</dd>
						</div>
					) : null}

					<div className="grid gap-y-1 text-sm">
						<dt className="font-bold uppercase">{t("project-start")}</dt>
						<dd>{startDate}</dd>
					</div>

					<div className="grid gap-y-1 text-sm">
						<dt className="font-bold uppercase">{t("project-end")}</dt>
						<dd>{endDate}</dd>
					</div>

					<div className="grid gap-y-1 text-sm">
						<dt className="font-bold uppercase">{t("keywords")}</dt>
						<dd>
							{format.list(
								keywords.map((keyword) => {
									return keyword.label;
								}),
							)}
						</dd>
					</div>
				</dl>
			</div>
		</MainContent>
	);
}
