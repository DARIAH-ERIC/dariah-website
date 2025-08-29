import { withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { config } from "@keystatic/core";

import { Logo } from "@/components/logo";
import { env } from "@/config/env.config";
import { defaultLocale, locales } from "@/lib/i18n/locales";
import {
	createDocumentation,
	createDocumentsAndPolicies,
	createEvents,
	createImpactCaseStudies,
	createKeywords,
	createNews,
	createOrganisation,
	createPages,
	createPersons,
	createProjects,
	createStrategies,
} from "@/lib/keystatic/collections";
import {
	createDocumentsAndPoliciesOverview,
	createEventsOverview,
	createImpactCaseStudiesOverview,
	createIndexPage,
	createMembersAndPartnersOverview,
	createMetadata,
	createNavigation,
	createNewsOverview,
	createProjectsOverview,
	createResources,
	createSearch,
	createStrategiesOverview,
} from "@/lib/keystatic/singletons";

export default config({
	collections: {
		[withI18nPrefix("documents-and-policies", defaultLocale)]:
			createDocumentsAndPolicies(defaultLocale),

		[withI18nPrefix("events", defaultLocale)]: createEvents(defaultLocale),

		[withI18nPrefix("impact-case-studies", defaultLocale)]: createImpactCaseStudies(defaultLocale),

		[withI18nPrefix("keywords", defaultLocale)]: createKeywords(defaultLocale),

		[withI18nPrefix("news", defaultLocale)]: createNews(defaultLocale),

		[withI18nPrefix("organisations", defaultLocale)]: createOrganisation(defaultLocale),

		[withI18nPrefix("persons", defaultLocale)]: createPersons(defaultLocale),

		[withI18nPrefix("projects", defaultLocale)]: createProjects(defaultLocale),

		[withI18nPrefix("strategies", defaultLocale)]: createStrategies(defaultLocale),

		[withI18nPrefix("pages", defaultLocale)]: createPages(defaultLocale),

		[withI18nPrefix("documentation", defaultLocale)]: createDocumentation(defaultLocale),
	},
	singletons: {
		[withI18nPrefix("index-page", defaultLocale)]: createIndexPage(defaultLocale),

		[withI18nPrefix("metadata", defaultLocale)]: createMetadata(defaultLocale),

		[withI18nPrefix("navigation", defaultLocale)]: createNavigation(defaultLocale),

		[withI18nPrefix("documents-and-policies-overview", defaultLocale)]:
			createDocumentsAndPoliciesOverview(defaultLocale),

		[withI18nPrefix("events-overview", defaultLocale)]: createEventsOverview(defaultLocale),

		[withI18nPrefix("impact-case-studies-overview", defaultLocale)]:
			createImpactCaseStudiesOverview(defaultLocale),

		[withI18nPrefix("members-and-partners-overview", defaultLocale)]:
			createMembersAndPartnersOverview(defaultLocale),

		[withI18nPrefix("news-overview", defaultLocale)]: createNewsOverview(defaultLocale),

		[withI18nPrefix("projects-overview", defaultLocale)]: createProjectsOverview(defaultLocale),

		[withI18nPrefix("resources", defaultLocale)]: createResources(defaultLocale),

		[withI18nPrefix("strategies-overview", defaultLocale)]: createStrategiesOverview(defaultLocale),

		[withI18nPrefix("search", defaultLocale)]: createSearch(defaultLocale),
	},
	storage:
		env.NEXT_PUBLIC_KEYSTATIC_MODE === "github" &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER &&
		env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME
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
			mark() {
				return <Logo />;
			},
			name: "ACDH-CH",
		},
		navigation: {
			HomePage: locales.map((locale) => {
				return withI18nPrefix("index-page", locale);
			}),
			"Documents and Policies": locales.map((locale) => {
				return withI18nPrefix("documents-and-policies", locale);
			}),
			"Documents and Policies Overview": locales.map((locale) => {
				return withI18nPrefix("documents-and-policies-overview", locale);
			}),
			Events: locales.map((locale) => {
				return withI18nPrefix("events", locale);
			}),
			"Events Overview": locales.map((locale) => {
				return withI18nPrefix("events-overview", locale);
			}),
			"Impact case studies": locales.map((locale) => {
				return withI18nPrefix("impact-case-studies", locale);
			}),
			"Impact case studies overview": locales.map((locale) => {
				return withI18nPrefix("impact-case-studies-overview", locale);
			}),
			Keywords: locales.map((locale) => {
				return withI18nPrefix("keywords", locale);
			}),
			"Members and Partners Overview": locales.map((locale) => {
				return withI18nPrefix("members-and-partners-overview", locale);
			}),
			News: locales.map((locale) => {
				return withI18nPrefix("news", locale);
			}),
			"News Overview": locales.map((locale) => {
				return withI18nPrefix("news-overview", locale);
			}),
			Organisations: locales.map((locale) => {
				return withI18nPrefix("organisations", locale);
			}),
			Persons: locales.map((locale) => {
				return withI18nPrefix("persons", locale);
			}),
			Projects: locales.map((locale) => {
				return withI18nPrefix("projects", locale);
			}),
			"Projects Overview": locales.map((locale) => {
				return withI18nPrefix("projects-overview", locale);
			}),
			Strategies: locales.map((locale) => {
				return withI18nPrefix("strategies", locale);
			}),
			"Strategies Overview": locales.map((locale) => {
				return withI18nPrefix("strategies-overview", locale);
			}),
			Pages: locales.map((locale) => {
				return withI18nPrefix("pages", locale);
			}),
			Navigation: locales.map((locale) => {
				return withI18nPrefix("navigation", locale);
			}),
			Metadata: locales.map((locale) => {
				return withI18nPrefix("metadata", locale);
			}),
			Resources: locales.map((locale) => {
				return withI18nPrefix("resources", locale);
			}),
			Search: locales.map((locale) => {
				return withI18nPrefix("search", locale);
			}),
		},
	},
});
