import type { Metadata, ResolvingMetadata } from "next";
import type { ReactNode } from "react";

import { Card } from "@/components/card";
import { MainContent } from "@/components/main-content";
import { Button } from "@/components/ui/button/button";
import { Checkbox } from "@/components/ui/checkbox/checkbox";
import { AddIcon } from "@/components/ui/icons/add";
import { CalendarIcon } from "@/components/ui/icons/calendar";
import { CalendarDayIcon } from "@/components/ui/icons/calendar-day";
import { CalendarMonthIcon } from "@/components/ui/icons/calendar-month";
import { CheckIcon } from "@/components/ui/icons/check";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { ChevronForwardIcon } from "@/components/ui/icons/chevron-forward";
import { ChevronLeftIcon } from "@/components/ui/icons/chevron-left";
import { ChevronUpIcon } from "@/components/ui/icons/chevron-up";
import { DataRangeIcon } from "@/components/ui/icons/data-range.";
import { EventIcon } from "@/components/ui/icons/event";
import { InfoIcon } from "@/components/ui/icons/info";
import { ListIcon } from "@/components/ui/icons/list";
import { LocationIcon } from "@/components/ui/icons/location";
import { MailIcon } from "@/components/ui/icons/mail";
import { NewsIcon } from "@/components/ui/icons/news";
import { OpenInNewIcon } from "@/components/ui/icons/open-in-new";
import { OpportunityIcon } from "@/components/ui/icons/opportunity";
import { ProjectIcon } from "@/components/ui/icons/project";
import { SearchIcon } from "@/components/ui/icons/search";
import { SpotlightArticleIcon } from "@/components/ui/icons/spotlight-article";
import { ToolOrServiceIcon } from "@/components/ui/icons/tool-or-service";
import { WorkingGroupIcon } from "@/components/ui/icons/working-group";
import { MenuTab } from "@/components/ui/menu-tab/menu-tab";
import { NavTab } from "@/components/ui/nav-tab/nav-tab";
import { Pagination } from "@/components/ui/pagination/pagination";
import { Select } from "@/components/ui/select/select";
import { TextField } from "@/components/ui/text-field/text-field";
import { defaultLocale } from "@/lib/i18n/locales";
import { createCollectionResource, createSingletonResource } from "@/lib/keystatic/resources";

const TEST_SELECT_OPTIONS = [
	{ id: 1, name: "Aerospace" },
	{ id: 2, name: "Mechanical" },
	{ id: 3, name: "Civil" },
	{ id: 4, name: "Biomedical" },
	{ id: 5, name: "Nuclear" },
	{ id: 6, name: "Industrial" },
	{ id: 7, name: "Chemical" },
	{ id: 8, name: "Agricultural" },
	{ id: 9, name: "Electrical" },
];

interface DocumentAndPoliciesOverviewPageProps {}

export async function generateMetadata(
	_props: Readonly<DocumentAndPoliciesOverviewPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const documentsPoliciesOverview = await createSingletonResource(
		"documents-and-policies-overview",
		defaultLocale,
	).read();

	const metadata: Metadata = {
		title: documentsPoliciesOverview.data.title,
	};
	return metadata;
}

export default async function DocumentAndPoliciesOverviewPage(
	_props: Readonly<DocumentAndPoliciesOverviewPageProps>,
): Promise<ReactNode> {
	const documentsPoliciesOverview = await createSingletonResource(
		"documents-and-policies-overview",
		defaultLocale,
	).read();
	const documentsPolicies = await createCollectionResource(
		"documents-and-policies",
		defaultLocale,
	).all();

	return (
		<MainContent className="layout-grid content-start">
			<section className="layout-subgrid relative gap-y-12 py-16 xs:py-24">
				<header>
					<h1 className="text-balance font-heading text-heading-1 font-strong text-neutral-900">
						{documentsPoliciesOverview.data.title}
					</h1>
					<p className="mt-6 font-heading text-heading-4 text-neutral-600">
						{documentsPoliciesOverview.data.lead}
					</p>
				</header>
				<ul
					className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,18rem),1fr))] gap-8"
					role="list"
				>
					{documentsPolicies.map(async (documentspoliciesobj) => {
						const id = documentspoliciesobj.id;
						const documentsPolicyItem = await createCollectionResource(
							"documents-and-policies",
							defaultLocale,
						).read(id);
						const link = { label: "", href: `/documents-and-policies/${id}` };
						return (
							<li key={id}>
								<Card
									className="grid h-full grid-rows-[13rem_auto]"
									discriminent="document-or-policy"
									{...documentsPolicyItem.data}
									link={link}
								></Card>
							</li>
						);
					})}
				</ul>
				<div className="flex flex-col gap-4">
					<h1>TODO - delete later</h1>
					<div className="bg-white p-4">
						<h2 className="text-black">Button</h2>
						<p className="text-black">
							Props: <br />
							-variant=[primary/secondary]
							<br />
							-size=[sm/lg]
							<br />
							-startIcon=ReactElement
							<br />
							-endIcon=ReactElement
						</p>
						<div className="flex flex-wrap items-center justify-center gap-4 bg-white p-4">
							<Button size="lg" variant="primary">
								primary-lg
							</Button>
							<Button size="sm" variant="primary">
								primary-sm
							</Button>
							<Button isDisabled={true} size="lg" variant="primary">
								primary-lg-disabled
							</Button>
							<Button
								endIcon={<ChevronForwardIcon />}
								size="lg"
								startIcon={<ChevronLeftIcon />}
								variant="primary"
							>
								primary-lg-icons
							</Button>
						</div>
						<div className="flex flex-wrap items-center justify-center gap-4 bg-white p-4">
							<Button size="lg" variant="secondary">
								secondary-lg
							</Button>
							<Button size="sm" variant="secondary">
								secondary-sm
							</Button>
							<Button isDisabled={true} size="lg" variant="secondary">
								secondary-lg-disabled
							</Button>
							<Button
								endIcon={<ChevronForwardIcon />}
								size="lg"
								startIcon={<ChevronLeftIcon />}
								variant="secondary"
							>
								secondary-lg-icons
							</Button>
						</div>
					</div>
					<div className="bg-white p-4">
						<h2 className="text-black">Text Button</h2>
						<p className="text-black">
							Props: <br />
							-variant=[text-primary/text-standard]
							<br />
							-startIcon=ReactElement
							<br />
							-endIcon=ReactElement
						</p>
						<div className="flex flex-wrap items-center justify-center gap-4 bg-white p-4">
							<Button variant="text-primary">text-primary</Button>
							<Button
								endIcon={<ChevronForwardIcon />}
								startIcon={<ChevronLeftIcon />}
								variant="text-primary"
							>
								text-primary-icons
							</Button>
						</div>
						<div className="flex flex-wrap items-center justify-center gap-4 bg-white p-4">
							<Button variant="text-standard">text-standard</Button>
							<Button
								endIcon={<ChevronForwardIcon />}
								startIcon={<ChevronLeftIcon />}
								variant="text-standard"
							>
								text-standard-icons
							</Button>
						</div>
					</div>
					<div className="bg-white p-4">
						<h2 className="text-black">Icon Button</h2>
						<p className="text-black">
							Props: <br />
							-variant=icon
						</p>
						<div className="flex flex-wrap items-center justify-center gap-4 bg-white p-4">
							<Button variant="icon">
								<ChevronForwardIcon />
							</Button>
						</div>
					</div>
					<div className="bg-white p-4">
						<h2 className="text-black">Checkbox</h2>
						<p className="text-black"></p>
						<div className="flex flex-wrap items-center justify-center gap-4 bg-white p-4">
							<Checkbox />
							<Checkbox isSelected={true} />
							<Checkbox isDisabled={true} />
							<Checkbox isDisabled={true} isSelected={true} />
						</div>
					</div>
					<div className="bg-white p-4">
						<h2 className="text-black">Pagination</h2>
						<p className="text-black"></p>
						<div className="flex flex-col flex-wrap items-center justify-center gap-4 bg-white p-4">
							<Pagination pageCount={6} />
							<Pagination pageCount={6} pageUrlAlias="test" />
							<Pagination pageCount={1} pageUrlAlias="222" />
						</div>
					</div>
					<div className="bg-white p-4">
						<h2 className="text-black">TextField</h2>
						<p className="text-black"></p>
						<div className="flex flex-col flex-wrap items-center justify-center gap-4 bg-white p-4">
							<TextField
								endIcon={<ChevronDownIcon />}
								placeholder="test"
								startIcon={<SearchIcon />}
							/>
							<TextField label="Test label" />
							<TextField label="Test label" startIcon={<SearchIcon width="15px" />} />
						</div>
					</div>
					<div className="bg-white p-4">
						<h2 className="text-black">Select</h2>
						<p className="text-black"></p>
						<div className="flex flex-col flex-wrap items-center justify-center gap-4 bg-white p-4">
							<Select defaultItems={TEST_SELECT_OPTIONS} label="Test select" />
						</div>
					</div>
					<div className="bg-white p-4">
						<h2 className="text-black">MenuTab</h2>
						<p className="text-black"></p>
						<div className="flex flex-wrap items-center justify-center gap-4 bg-white p-4">
							<MenuTab as="button">Test</MenuTab>
							<MenuTab active={true} as="button">
								Test
							</MenuTab>
							<MenuTab as="link" href="/">
								Test
							</MenuTab>
						</div>
					</div>
					<div className="bg-white p-4">
						<h2 className="text-black">NavTab</h2>
						<p className="text-black"></p>
						<div className="flex flex-wrap items-center justify-center gap-4 bg-[linear-gradient(90deg,#00578F_0%,#6D8B7F_62.5%)] p-4">
							<NavTab>Test</NavTab>
							<NavTab>Test</NavTab>
							<NavTab href="/">Working Groups</NavTab>
						</div>
					</div>
					<div className="bg-white p-4 text-black">
						<h2 className="">Icons</h2>
						<div className="flex flex-wrap items-center justify-center gap-4 bg-white p-4">
							<AddIcon /> <CalendarDayIcon /> <CalendarMonthIcon />
							<CalendarIcon />
							<ChevronDownIcon />
							<ChevronForwardIcon />
							<ChevronLeftIcon />
							<ChevronUpIcon />
							<DataRangeIcon />
							<EventIcon />
							<InfoIcon />
							<ListIcon />
							<LocationIcon />
							<MailIcon />
							<NewsIcon />
							<OpenInNewIcon />
							<OpportunityIcon />
							<ProjectIcon />
							<SearchIcon />
							<SpotlightArticleIcon />
							<ToolOrServiceIcon />
							<WorkingGroupIcon />
							<CheckIcon />
						</div>
					</div>
				</div>
			</section>
		</MainContent>
	);
}
