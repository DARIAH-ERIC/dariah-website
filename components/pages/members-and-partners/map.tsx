"use client";

import "leaflet/dist/leaflet.css";

import { useTranslations } from "next-intl";
import { type ReactNode, useMemo, useState } from "react";
import { type Key, TabPanel, TabPanels, Tabs } from "react-aria-components";
import { MapContainer, TileLayer } from "react-leaflet";

import { CountriesPanel } from "@/components/pages/members-and-partners/countries-panel";
import { MapGeoJson } from "@/components/pages/members-and-partners/map-geo-json";
import { MapLegend } from "@/components/pages/members-and-partners/map-legend";
import { ZoomButtons } from "@/components/pages/members-and-partners/zoom-buttons";
import { Tab } from "@/components/ui/tabs/tab";
import { TabList } from "@/components/ui/tabs/tab-list";
import type { MemberOrPartnerList } from "@/lib/data/api-client";
import type { CountryGeoJSON } from "@/types/map";
import { useMediaQuery } from "@/utils/hooks/use-media-query";

type ActiveCountry = MemberOrPartnerList["data"][number] | undefined | null;

interface MapProps {
	geoJson: CountryGeoJSON;
	countries: MemberOrPartnerList["data"];
}

export function Map(props: Readonly<MapProps>): ReactNode {
	const { geoJson, countries } = props;
	const t = useTranslations("MembersAndPartnersPage");

	const isLg = useMediaQuery("lg");

	const [activeCountry, setActiveCountry] = useState<ActiveCountry>(undefined);
	const [selectedTab, setSelectedTab] = useState<Key>("map");
	const currentTab = isLg ? "map" : selectedTab;

	const { members, partners } = useMemo(() => {
		const members = Object.values(countries).filter((country) => {
			return country.status === "is_member";
		});
		const partners = Object.values(countries).filter((country) => {
			return country.status === "is_cooperating_partner";
		});

		return { members, partners };
	}, [countries]);

	const handleActiveCountryChange = (country: ActiveCountry) => {
		setActiveCountry(country);
	};

	return (
		<Tabs onSelectionChange={setSelectedTab} selectedKey={currentTab}>
			<TabList aria-label="Tabs" className="lg:hidden">
				<Tab id="list">{t("tabs.list")}</Tab>
				<Tab id="map">{t("tabs.map")}</Tab>
			</TabList>
			<TabPanels>
				<TabPanel id="list">
					<CountriesPanel className="w-full lg:hidden" members={members} partners={partners} />
				</TabPanel>
				<TabPanel id="map">
					<MapContainer
						center={[55, -25]}
						className="w-full h-257 z-1 lg:h-216"
						scrollWheelZoom={false}
						worldCopyJump={true}
						zoom={4}
						zoomControl={false}
					>
						<CountriesPanel
							className="hidden absolute top-6 left-20 lg:flex"
							members={members}
							partners={partners}
						/>
						<ZoomButtons />
						<TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png" />
						<MapLegend />
						<MapGeoJson
							activeCountry={activeCountry}
							countries={countries}
							geoJson={geoJson}
							handleActiveCountryChange={handleActiveCountryChange}
						/>
					</MapContainer>
				</TabPanel>
			</TabPanels>
		</Tabs>
	);
}
