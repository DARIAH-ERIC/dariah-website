import { withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { config as createConfig } from "@keystatic/core";

import { env } from "@/config/env.config";
import { createDocumentation } from "@/lib/content/keystatic/collections/documentation";
import { createDocumentsAndPolicies } from "@/lib/content/keystatic/collections/documents-and-policies";
import { createEvents } from "@/lib/content/keystatic/collections/events";
import { createImpactCaseStudies } from "@/lib/content/keystatic/collections/impact-case-studies";
import { createKeywords } from "@/lib/content/keystatic/collections/keywords";
import { createNews } from "@/lib/content/keystatic/collections/news";
import { createOrganisation } from "@/lib/content/keystatic/collections/organisations";
import { createPages } from "@/lib/content/keystatic/collections/pages";
import { createPersons } from "@/lib/content/keystatic/collections/persons";
import { createProjects } from "@/lib/content/keystatic/collections/projects";
import { createStrategies } from "@/lib/content/keystatic/collections/strategies";
import { createWorkingGroups } from "@/lib/content/keystatic/collections/working-groups";
import { Logo } from "@/lib/content/keystatic/logo";
import { createDocumentsAndPoliciesOverview } from "@/lib/content/keystatic/singletons/documents-and-policies-overview";
import { createEventsOverview } from "@/lib/content/keystatic/singletons/events-overview";
import { createImpactCaseStudiesOverview } from "@/lib/content/keystatic/singletons/impact-case-studies-overview";
import { createIndexPage } from "@/lib/content/keystatic/singletons/index-page";
import { createMembersAndPartnersOverview } from "@/lib/content/keystatic/singletons/members-and-partners-overview";
import { createMetadata } from "@/lib/content/keystatic/singletons/metadata";
import { createNavigation } from "@/lib/content/keystatic/singletons/navigation";
import { createNewsOverview } from "@/lib/content/keystatic/singletons/news-overview";
import { createProjectsOverview } from "@/lib/content/keystatic/singletons/projects-overview";
import { createResources } from "@/lib/content/keystatic/singletons/resources";
import { createSearch } from "@/lib/content/keystatic/singletons/search";
import { createStrategiesOverview } from "@/lib/content/keystatic/singletons/strategies-overview";
import { createWorkingGroupsOverview } from "@/lib/content/keystatic/singletons/working-groups-overview";
import { defaultLocale, getIntlLanguage } from "@/lib/i18n/locales";

const locale = getIntlLanguage(defaultLocale);

export const config = createConfig({
	collections: {
		[withI18nPrefix("documents-and-policies", locale)]: createDocumentsAndPolicies(locale),
		[withI18nPrefix("events", locale)]: createEvents(locale),
		[withI18nPrefix("impact-case-studies", locale)]: createImpactCaseStudies(locale),
		[withI18nPrefix("keywords", locale)]: createKeywords(locale),
		[withI18nPrefix("news", locale)]: createNews(locale),
		[withI18nPrefix("organisations", locale)]: createOrganisation(locale),
		[withI18nPrefix("persons", locale)]: createPersons(locale),
		[withI18nPrefix("projects", locale)]: createProjects(locale),
		[withI18nPrefix("strategies", locale)]: createStrategies(locale),
		[withI18nPrefix("pages", locale)]: createPages(locale),
		[withI18nPrefix("working-groups", locale)]: createWorkingGroups(locale),
		[withI18nPrefix("documentation", locale)]: createDocumentation(locale),
	},
	singletons: {
		[withI18nPrefix("index-page", locale)]: createIndexPage(locale),
		[withI18nPrefix("metadata", locale)]: createMetadata(locale),
		[withI18nPrefix("navigation", locale)]: createNavigation(locale),
		[withI18nPrefix("documents-and-policies-overview", locale)]:
			createDocumentsAndPoliciesOverview(locale),
		[withI18nPrefix("events-overview", locale)]: createEventsOverview(locale),
		[withI18nPrefix("impact-case-studies-overview", locale)]:
			createImpactCaseStudiesOverview(locale),
		[withI18nPrefix("members-and-partners-overview", locale)]:
			createMembersAndPartnersOverview(locale),
		[withI18nPrefix("news-overview", locale)]: createNewsOverview(locale),
		[withI18nPrefix("projects-overview", locale)]: createProjectsOverview(locale),
		[withI18nPrefix("resources", locale)]: createResources(locale),
		[withI18nPrefix("strategies-overview", locale)]: createStrategiesOverview(locale),
		[withI18nPrefix("search", locale)]: createSearch(locale),
		[withI18nPrefix("working-groups-overview", locale)]: createWorkingGroupsOverview(locale),
	},
	storage:
		env.NEXT_PUBLIC_KEYSTATIC_MODE === "github" &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER != null &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME != null
			? {
					kind: "github",
					repo: {
						owner: env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
						name: env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
					},
					branchPrefix: "content/",
				}
			: {
					kind: "local",
				},
	ui: {
		brand: {
			mark: Logo,
			name: "DARIAH-EU",
		},
		navigation: {
			Pages: [
				withI18nPrefix("index-page", locale),
				withI18nPrefix("documents-and-policies-overview", locale),
				withI18nPrefix("events-overview", locale),
				withI18nPrefix("impact-case-studies-overview", locale),
				withI18nPrefix("members-and-partners-overview", locale),
				withI18nPrefix("news-overview", locale),
				withI18nPrefix("projects-overview", locale),
				withI18nPrefix("search", locale),
				withI18nPrefix("strategies-overview", locale),
				withI18nPrefix("working-groups-overview", locale),
				withI18nPrefix("pages", locale),
			],
			Data: [
				withI18nPrefix("documents-and-policies", locale),
				withI18nPrefix("events", locale),
				withI18nPrefix("impact-case-studies", locale),
				withI18nPrefix("keywords", locale),
				withI18nPrefix("news", locale),
				withI18nPrefix("organisations", locale),
				withI18nPrefix("persons", locale),
				withI18nPrefix("projects", locale),
				withI18nPrefix("resources", locale),
				withI18nPrefix("strategies", locale),
				withI18nPrefix("working-groups", locale),
			],
			Settings: [withI18nPrefix("navigation", locale), withI18nPrefix("metadata", locale)],
		},
	},
});
