/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/require-await */

import { faker as f } from "@faker-js/faker";

import type { NavigationConfig } from "@/lib/navigation/navigation";

f.seed(42);
f.setDefaultRefDate(new Date(Date.UTC(2025, 0, 1)));

const licenses = [
	{
		id: f.string.uuid(),
		name: "CC0-1.0",
		url: "https://choosealicense.com/licenses/cc0-1.0/",
	},
	{
		id: f.string.uuid(),
		name: "CC-BY-4.0",
		url: "https://choosealicense.com/licenses/cc-by-4.0/",
	},
	{
		id: f.string.uuid(),
		name: "CC-BY-SA-4.0",
		url: "https://choosealicense.com/licenses/cc-by-sa-4.0/",
	},
];

const assets = f.helpers.multiple(
	() => {
		return {
			id: f.string.uuid(),
			url: f.image.url(),
			license: f.helpers.arrayElement(licenses),
		};
	},
	{ count: 150 },
);

const persons = f.helpers.multiple(
	() => {
		return {
			id: f.string.uuid(),
			name: f.person.fullName(),
			image: f.helpers.arrayElement(assets),
		};
	},
	{ count: 100 },
);

const events = f.helpers.multiple(
	() => {
		const title = f.lorem.sentence();
		const startDate = f.date.past({ years: 5 });

		return {
			id: f.string.uuid(),
			title,
			summary: f.lorem.paragraph(),
			leadIn: f.helpers.maybe(
				() => {
					return f.lorem.paragraph();
				},
				{ probability: 0.75 },
			),
			image: f.helpers.arrayElement(assets),
			content: f.lorem.paragraphs(10),
			location: f.location.city(),
			startDate,
			startTime: f.helpers.maybe(
				() => {
					return f.date
						.between({
							from: new Date(Date.UTC(2025, 0, 1, 0, 0, 0)),
							to: new Date(Date.UTC(2025, 0, 1, 23, 59, 59)),
						})
						.toTimeString()
						.slice(0, 8);
				},
				{ probability: 0.1 },
			),
			endDate: f.helpers.maybe(
				() => {
					return f.date.soon({ refDate: startDate, days: 7 });
				},
				{ probability: 0.25 },
			),
			endTime: f.helpers.maybe(
				() => {
					return f.date
						.between({
							from: new Date(Date.UTC(2025, 0, 1, 0, 0, 0)),
							to: new Date(Date.UTC(2025, 0, 1, 23, 59, 59)),
						})
						.toTimeString()
						.slice(0, 8);
				},
				{ probability: 0.05 },
			),
			website: f.helpers.maybe(
				() => {
					return f.internet.url();
				},
				{ probability: 0.75 },
			),
			slug: f.helpers.slugify(title).toLowerCase(),
			publishedAt: f.date.recent(),
		};
	},
	{ count: 25 },
);

const impactCaseStudies = f.helpers.multiple(
	() => {
		const title = f.lorem.sentence();

		return {
			id: f.string.uuid(),
			title,
			summary: f.lorem.paragraph(),
			leadIn: f.helpers.maybe(
				() => {
					return f.lorem.paragraph();
				},
				{ probability: 0.75 },
			),
			image: f.helpers.arrayElement(assets),
			content: f.lorem.paragraphs(10),
			contributors: f.helpers.arrayElements(persons, { min: 0, max: 3 }),
			slug: f.helpers.slugify(title).toLowerCase(),
			publishedAt: f.date.recent(),
		};
	},
	{ count: 25 },
);

const news = f.helpers.multiple(
	() => {
		const title = f.lorem.sentence();

		return {
			id: f.string.uuid(),
			title,
			summary: f.lorem.paragraph(),
			leadIn: f.helpers.maybe(
				() => {
					return f.lorem.paragraph();
				},
				{ probability: 0.75 },
			),
			image: f.helpers.arrayElement(assets),
			content: f.lorem.paragraphs(10),
			slug: f.helpers.slugify(title).toLowerCase(),
			publishedAt: f.date.recent(),
		};
	},
	{ count: 25 },
);

const page = () => {
	const title = f.lorem.sentence();

	return {
		id: f.string.uuid(),
		title,
		// summary: f.lorem.paragraph(),
		leadIn: f.helpers.maybe(
			() => {
				return f.lorem.paragraph();
			},
			{ probability: 0.75 },
		),
		image: f.helpers.arrayElement(assets),
		content: f.lorem.paragraphs(10),
		slug: f.helpers.slugify(title).toLowerCase(),
		publishedAt: f.date.recent(),
	};
};

const projects = f.helpers.multiple(
	() => {
		const name = f.lorem.sentence();
		const startDate = f.date.past({ years: 5 });

		return {
			id: f.string.uuid(),
			name,
			image: f.helpers.arrayElement(assets),
			description: f.lorem.paragraphs(10),
			startDate,
			endDate: f.date.future({ refDate: startDate, years: 5 }),
			slug: f.helpers.slugify(name).toLowerCase(),
			publishedAt: f.date.recent(),
		};
	},
	{ count: 25 },
);

const spotlightArticles = f.helpers.multiple(
	() => {
		const title = f.lorem.sentence();

		return {
			id: f.string.uuid(),
			title,
			summary: f.lorem.paragraph(),
			leadIn: f.helpers.maybe(
				() => {
					return f.lorem.paragraph();
				},
				{ probability: 0.75 },
			),
			image: f.helpers.arrayElement(assets),
			content: f.lorem.paragraphs(10),
			slug: f.helpers.slugify(title).toLowerCase(),
			publishedAt: f.date.recent(),
		};
	},
	{ count: 25 },
);

export const client = {
	async navigation() {
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
					// "dariah-in-a-nutshell": {
					// 	type: "link",
					// 	label: "DARIAH in a nutshell",
					// 	href: "/about/dariah-in-a-nutshell",
					// },
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
					// "documents-and-policies": {
					// 	type: "link",
					// 	label: "Documents and policies",
					// 	href: "/about/documents-and-policies",
					// },
				},
			},
			// network: {
			// 	type: "menu",
			// 	label: "Network",
			// 	children: {
			// 		"members-and-partners": {
			// 			type: "link",
			// 			label: "Members and partners",
			// 			href: "/network/members-and-partners",
			// 		},
			// 		"regional-hubs": {
			// 			type: "link",
			// 			label: "Regional hubs",
			// 			href: "/network/regional-hubs",
			// 		},
			// 		"working-groups": {
			// 			type: "link",
			// 			label: "Working groups",
			// 			href: "/network/working-groups",
			// 		},
			// 		"partnerships-and-collaborations": {
			// 			type: "link",
			// 			label: "Partnerships and collaborations",
			// 			href: "/network/partnerships-and-collaborations",
			// 		},
			// 	},
			// },
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
					spotlight: {
						type: "link",
						label: "Spotlight",
						href: "/spotlight",
					},
					// "annual-events": {
					// 	type: "link",
					// 	label: "Annual events",
					// 	href: "/annual-events",
					// },
					// newsletters: {
					// 	type: "link",
					// 	label: "Newsletters",
					// 	href: "/newsletters",
					// },
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
				type: "link",
				label: "Contact",
				href: "/contact",
			},
			imprint: {
				type: "link",
				label: "Imprint",
				href: "/imprint",
			},
		} satisfies NavigationConfig;

		return {
			primary,
			secondary,
		};
	},
	events: {
		async slugs() {
			const slugs = events.map((item) => {
				return item.slug;
			});

			return slugs;
		},
		async list() {
			return {
				items: events.map((item) => {
					return {
						id: item.id,
						title: item.title,
						summary: item.summary,
						image: item.image,
						slug: item.slug,
						publishedAt: item.publishedAt,
					};
				}),
			};
		},
		async read(slug: string) {
			const item = events.find((item) => {
				return item.slug === slug;
			});

			if (item == null) {
				return null;
			}

			return { item };
		},
	},
	homePage: {
		async read() {
			const item = page();

			return {
				item: {
					...item,
					sections: {
						events: {
							title: "Upcoming events",
							items: events
								.toSorted((a, z) => {
									return z.startDate.getTime() - a.startDate.getTime();
								})
								.slice(0, 3)
								.map((item) => {
									return {
										id: item.id,
										title: item.title,
										summary: item.summary,
										image: item.image,
										slug: item.slug,
										publishedAt: item.publishedAt,
									};
								}),
						},
						news: {
							title: "Stay updated",
							items: news
								.toSorted((a, z) => {
									return z.publishedAt.getTime() - a.publishedAt.getTime();
								})
								.slice(0, 3)
								.map((item) => {
									return {
										id: item.id,
										title: item.title,
										summary: item.summary,
										image: item.image,
										slug: item.slug,
										publishedAt: item.publishedAt,
									};
								}),
						},
					},
				},
			};
		},
	},
	impactCaseStudies: {
		async slugs() {
			const slugs = impactCaseStudies.map((item) => {
				return item.slug;
			});

			return slugs;
		},
		async list() {
			return {
				items: impactCaseStudies.map((item) => {
					return {
						id: item.id,
						title: item.title,
						summary: item.summary,
						image: item.image,
						slug: item.slug,
						publishedAt: item.publishedAt,
					};
				}),
			};
		},
		async read(slug: string) {
			const item = impactCaseStudies.find((item) => {
				return item.slug === slug;
			});

			if (item == null) {
				return null;
			}

			return { item };
		},
	},
	news: {
		async slugs() {
			const slugs = news.map((item) => {
				return item.slug;
			});

			return slugs;
		},
		async list() {
			return {
				items: news.map((item) => {
					return {
						id: item.id,
						title: item.title,
						summary: item.summary,
						image: item.image,
						slug: item.slug,
						publishedAt: item.publishedAt,
					};
				}),
			};
		},
		async read(slug: string) {
			const item = news.find((item) => {
				return item.slug === slug;
			});

			if (item == null) {
				return null;
			}

			return { item };
		},
	},
	pages: {
		async read(_slug: string) {
			const item = page();

			// if (item == null) {
			// 	return null;
			// }

			return { item };
		},
	},
	projects: {
		async slugs() {
			const slugs = projects.map((item) => {
				return item.slug;
			});

			return slugs;
		},
		async list() {
			return {
				items: projects.map((item) => {
					return {
						id: item.id,
						name: item.name,
						image: item.image,
						startDate: item.startDate,
						endDate: item.endDate,
						slug: item.slug,
						publishedAt: item.publishedAt,
					};
				}),
			};
		},
		async read(slug: string) {
			const item = projects.find((item) => {
				return item.slug === slug;
			});

			if (item == null) {
				return null;
			}

			return { item };
		},
	},
	spotlightArticles: {
		async slugs() {
			const slugs = spotlightArticles.map((item) => {
				return item.slug;
			});

			return slugs;
		},
		async list() {
			return {
				items: spotlightArticles.map((item) => {
					return {
						id: item.id,
						title: item.title,
						summary: item.summary,
						image: item.image,
						slug: item.slug,
						publishedAt: item.publishedAt,
					};
				}),
			};
		},
		async read(slug: string) {
			const item = spotlightArticles.find((item) => {
				return item.slug === slug;
			});

			if (item == null) {
				return null;
			}

			return { item };
		},
	},
};
