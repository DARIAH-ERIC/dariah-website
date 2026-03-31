/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { faker as f } from "@faker-js/faker";

import type { NavigationConfig } from "@/lib/navigation/navigation";
import type { ResourceCatalogueFilter } from "@/types/global";

f.seed(42);
f.setDefaultRefDate(new Date(Date.UTC(2025, 0, 1)));

export function navigation() {
	const primary = {
		home: {
			type: "link",
			label: "Home",
			href: "/",
		},
		about: {
			type: "menu",
			label: "About",
			children: {
				"dariah-in-a-nutshell": {
					type: "link",
					label: "DARIAH in a nutshell",
					href: "/about/dariah-in-a-nutshell",
				},
				// strategy: {
				// 	type: "link",
				// 	label: "Strategy",
				// 	href: "/about/strategy",
				// },
				// "organisation-and-governance": {
				// 	type: "link",
				// 	label: "Organisation and governance",
				// 	href: "/about/organisation-and-governance",
				// },
				"impact-case-studies": {
					type: "link",
					label: "Impact case studies",
					href: "/about/impact-case-studies",
				},
				"documents-and-policies": {
					type: "link",
					label: "Documents and policies",
					href: "/about/documents",
				},
			},
		},
		network: {
			type: "menu",
			label: "Network",
			children: {
				"members-and-partners": {
					type: "link",
					label: "Members and partners",
					href: "/network/members-and-partners",
				},
				// 		"regional-hubs": {
				// 			type: "link",
				// 			label: "Regional hubs",
				// 			href: "/network/regional-hubs",
				// 		},
				"working-groups": {
					type: "link",
					label: "Working groups",
					href: "/network/working-groups",
				},
				// 		"partnerships-and-collaborations": {
				// 			type: "link",
				// 			label: "Partnerships and collaborations",
				// 			href: "/network/partnerships-and-collaborations",
				// 		},
			},
		},
		resources: {
			type: "menu",
			label: "Resources",
			children: {
				"dariah-resource-catalogue": {
					type: "link",
					label: "DARIAH resource catalogue",
					href: "/resources/dariah-resource-catalogue",
				},
				// "dariah-campus": {
				// 	type: "link",
				// 	label: "DARIAH-Campus",
				// 	href: "/resources/dariah-campus",
				// },
				// transformations: {
				// 	type: "link",
				// 	label: "Transformations",
				// 	href: "/resources/transformations",
				// },
				// "ssh-open-marketplace": {
				// 	type: "link",
				// 	label: "SSH Open Marketplace",
				// 	href: "/resources/ssh-open-marketplace",
				// },
			},
		},
		projects: {
			type: "link",
			label: "Projects",
			href: "/projects",
		},
		"news-and-events": {
			type: "menu",
			label: "News and events",
			children: {
				news: {
					type: "link",
					label: "News",
					href: "/news",
				},
				events: {
					type: "link",
					label: "Events",
					href: "/events",
				},
				spotlights: {
					type: "link",
					label: "Spotlights",
					href: "/spotlights",
				},
				"annual-events": {
					type: "link",
					label: "Annual events",
					href: "https://annualevent.dariah.eu",
				},
				newsletters: {
					type: "link",
					label: "Newsletters",
					href: "/newsletters",
				},
			},
		},
		// "get-involved": {
		// 	type: "menu",
		// 	label: "Get involved",
		// 	children: {
		// 		"join-dariah": {
		// 			type: "link",
		// 			label: "Join DARIAH",
		// 			href: "/get-involved/join-dariah",
		// 		},
		// 		"dariah-funding-call": {
		// 			type: "link",
		// 			label: "DARIAH funding call",
		// 			href: "/get-involved/dariah-funding-call",
		// 		},
		// 		"working-groups-funding-call": {
		// 			type: "link",
		// 			label: "Working groups funding call",
		// 			href: "/get-involved/working-groups-funding-call",
		// 		},
		// 		opportunities: {
		// 			type: "link",
		// 			label: "Opportunities",
		// 			href: "/get-involved/opportunities",
		// 		},
		// 	},
		// },
	} satisfies NavigationConfig;

	const secondary = {
		home: {
			type: "link",
			label: "Home",
			href: "/",
		},
		contact: {
			type: "menu",
			label: "Contact Dariah",
			children: {
				helpdesk: {
					type: "link",
					label: "Helpdesk",
					href: "/contact",
				},
			},
		},
		privacy: {
			type: "menu",
			label: "Privacy and Legal",
			children: {
				"legal-notice": {
					type: "link",
					label: "Legal notice",
					href: "/",
				},
				practice: {
					type: "link",
					label: "Practice",
					href: "/",
				},
				"accesibility-declaration": {
					type: "link",
					label: "Accessibility declaration",
					href: "/",
				},
			},
		},
		"quick-menu": {
			type: "menu",
			label: "Quick menu",
			children: {
				"dariah-nutshell": {
					type: "link",
					label: "DARIAH in Nutshell",
					href: "/",
				},
				"members-and-partners": {
					type: "link",
					label: "Members and Partners",
					href: "/",
				},
				projects: {
					type: "link",
					label: "Projects",
					href: "/",
				},
				"events-calendar": {
					type: "link",
					label: "Events Calendar",
					href: "/",
				},
				"website-user-survey": {
					type: "link",
					label: "Website User Survey",
					href: "/",
				},
			},
		},
	} satisfies NavigationConfig;

	const breadcrumbs = {
		events: [
			{
				href: "/",
				label: "home",
			},
			{
				href: "/",
				label: "news and events",
			},
			{
				label: "events",
			},
		],
		membersAndPartners: [
			{
				href: "/",
				label: "home",
			},
			{
				href: "/",
				label: "network",
			},
			{
				label: "members and partners",
			},
		],
		news: [
			{
				href: "/",
				label: "home",
			},
			{
				href: "/",
				label: "news and events",
			},
			{
				label: "news",
			},
		],
		projects: [
			{
				href: "/",
				label: "home",
			},
			{
				label: "projects",
			},
		],
		spotlightArticles: [
			{
				href: "/",
				label: "home",
			},
			{
				href: "/",
				label: "news and events",
			},
			{
				label: "spotlight",
			},
		],
		workingGroups: [
			{
				href: "/",
				label: "home",
			},
			{
				href: "/",
				label: "network",
			},
			{
				label: "working groups",
			},
		],
		dariahResourceCatalogue: {
			breadcrumbs: [
				{
					href: "/",
					label: "home",
				},
				{
					href: "/",
					label: "resources",
				},
				{
					label: "resources catalogue",
				},
			],
			filters: [
				{
					name: "type",
					limit: 6,
					showMore: true,
					sortBy: ["name"],
				},
			] satisfies Array<ResourceCatalogueFilter>,
		},
		documentsAndPolicies: [
			{
				href: "/",
				label: "home",
			},
			{
				href: "/",
				label: "About",
			},
			{
				label: "documents and policies",
			},
		],
	};

	return {
		primary,
		secondary,
		breadcrumbs,
	};
}
