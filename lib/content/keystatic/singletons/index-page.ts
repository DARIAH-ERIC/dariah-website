import { createAssetOptions, createSingleton, withI18nPrefix } from "@acdh-oeaw/keystatic-lib";
import { fields, singleton } from "@keystatic/core";

export const createIndexPage = createSingleton("/index-page/", (paths, locale) => {
	return singleton({
		label: "Home page",
		path: paths.contentPath,
		format: { data: "json" },
		entryLayout: "form",
		schema: {
			hero: fields.object(
				{
					title: fields.text({
						label: "Title",
						validation: { isRequired: true },
					}),
					lead: fields.text({
						label: "Lead",
						validation: { isRequired: true },
						multiline: true,
					}),
					image: fields.image({
						label: "Image",
						validation: { isRequired: true },
						...createAssetOptions(paths.assetPath),
					}),
				},
				{
					label: "Hero section",
				},
			),
			main: fields.object(
				{
					sections: fields.blocks(
						{
							cardsSection: {
								label: "Cards section",
								itemLabel(props) {
									return `${props.fields.title.value} (Cards)`;
								},
								schema: fields.object(
									{
										title: fields.text({
											label: "Title",
											validation: { isRequired: true },
										}),
										cards: fields.blocks(
											{
												custom: {
													label: "Custom card",
													itemLabel(props) {
														return props.fields.title.value;
													},
													schema: fields.object(
														{
															title: fields.text({
																label: "Title",
																validation: { isRequired: true },
															}),
															image: fields.object({
																src: fields.image({
																	label: "Image",
																	validation: { isRequired: true },
																	...createAssetOptions(paths.assetPath),
																}),
																caption: fields.mdx.inline({
																	label: "Image Caption",
																	options: {
																		heading: false,
																		orderedList: false,
																		unorderedList: false,
																		divider: false,
																		code: false,
																		codeBlock: false,
																		blockquote: false,
																		table: false,
																		image: false,
																		strikethrough: false,
																	},
																}),
															}),
															summary: fields.object({
																title: fields.text({
																	label: "Summary title",
																	validation: { isRequired: false },
																}),
																content: fields.mdx.inline({
																	label: "Summary content",
																	options: {
																		heading: false,
																		orderedList: false,
																		unorderedList: false,
																		divider: false,
																		code: false,
																		codeBlock: false,
																		blockquote: false,
																		table: false,
																		image: false,
																	},
																}),
															}),
															link: fields.object(
																{
																	label: fields.text({
																		label: "Label",
																		validation: { isRequired: true },
																	}),
																	href: fields.url({
																		label: "URL",
																		validation: { isRequired: true },
																	}),
																},
																{
																	label: "Link",
																},
															),
														},
														{
															label: "Custom card",
														},
													),
												},
												"document-or-policy": {
													label: "Document or Policy card",
													itemLabel(props) {
														return props.fields.title.value;
													},
													schema: fields.object(
														{
															title: fields.text({
																label: "Title",
																validation: { isRequired: true },
															}),
															reference: fields.relationship({
																label: "Document or Policy",
																validation: { isRequired: true },
																collection: withI18nPrefix("document-and-policies", locale),
															}),
														},
														{
															label: "Document or Policy card",
														},
													),
												},
												event: {
													label: "Event card",
													itemLabel(props) {
														return props.fields.title.value;
													},
													schema: fields.object(
														{
															title: fields.text({
																label: "Title",
																validation: { isRequired: true },
															}),
															reference: fields.relationship({
																label: "Event",
																validation: { isRequired: true },
																collection: withI18nPrefix("events", locale),
															}),
														},
														{
															label: "Event card",
														},
													),
												},
												"impact-case-study": {
													label: "Impact Case Study card",
													itemLabel(props) {
														return props.fields.title.value;
													},
													schema: fields.object(
														{
															title: fields.text({
																label: "Title",
																validation: { isRequired: true },
															}),
															reference: fields.relationship({
																label: "Impact Case Study",
																validation: { isRequired: true },
																collection: withI18nPrefix("impact-case-studies", locale),
															}),
														},
														{
															label: "Impact Case Study card",
														},
													),
												},
												news: {
													label: "News card",
													itemLabel(props) {
														return props.fields.title.value;
													},
													schema: fields.object(
														{
															title: fields.text({
																label: "Title",
																validation: { isRequired: true },
															}),
															reference: fields.relationship({
																label: "News",
																validation: { isRequired: true },
																collection: withI18nPrefix("news", locale),
															}),
														},
														{
															label: "News card",
														},
													),
												},
												organisation: {
													label: "Organisation card",
													itemLabel(props) {
														return props.fields.title.value;
													},
													schema: fields.object(
														{
															title: fields.text({
																label: "Title",
																validation: { isRequired: true },
															}),
															reference: fields.relationship({
																label: "Organisation",
																validation: { isRequired: true },
																collection: withI18nPrefix("organisations", locale),
															}),
														},
														{
															label: "Organisation card",
														},
													),
												},
												page: {
													label: "Page card",
													itemLabel(props) {
														return props.fields.title.value;
													},
													schema: fields.object(
														{
															title: fields.text({
																label: "Title",
																validation: { isRequired: true },
															}),
															reference: fields.relationship({
																label: "Page",
																validation: { isRequired: true },
																collection: withI18nPrefix("pages", locale),
															}),
														},
														{
															label: "Page card",
														},
													),
												},
												project: {
													label: "Project card",
													itemLabel(props) {
														return props.fields.title.value;
													},
													schema: fields.object(
														{
															title: fields.text({
																label: "Title",
																validation: { isRequired: true },
															}),
															reference: fields.relationship({
																label: "Project",
																validation: { isRequired: true },
																collection: withI18nPrefix("projects", locale),
															}),
														},
														{
															label: "Project card",
														},
													),
												},
												strategy: {
													label: "Strategy card",
													itemLabel(props) {
														return props.fields.title.value;
													},
													schema: fields.object(
														{
															title: fields.text({
																label: "Title",
																validation: { isRequired: true },
															}),
															reference: fields.relationship({
																label: "Strategy",
																validation: { isRequired: true },
																collection: withI18nPrefix("strategies", locale),
															}),
														},
														{
															label: "Strategy card",
														},
													),
												},
												"working-group": {
													label: "Working Group card",
													itemLabel(props) {
														return props.fields.title.value;
													},
													schema: fields.object(
														{
															title: fields.text({
																label: "Title",
																validation: { isRequired: true },
															}),
															reference: fields.relationship({
																label: "Working Group",
																validation: { isRequired: true },
																collection: withI18nPrefix("working-groups", locale),
															}),
														},
														{
															label: "Working Group card",
														},
													),
												},
											},
											{
												label: "Cards",
												validation: { length: { min: 1 } },
											},
										),
									},
									{
										label: "Cards section",
									},
								),
							},
						},
						{
							label: "Sections",
							validation: { length: { min: 1 } },
						},
					),
				},
				{ label: "Main content" },
			),
		},
	});
});
