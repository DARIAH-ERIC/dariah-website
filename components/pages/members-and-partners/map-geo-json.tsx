import {
	divIcon,
	type GeoJSON as GeoJSONType,
	type Layer,
	type LeafletEvent,
	marker as LeafletMarker,
} from "leaflet";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { GeoJSON, Popup, useMap } from "react-leaflet";

import { CountryPopup } from "@/components/pages/members-and-partners/country-popup";
import type { MemberOrPartnerList } from "@/lib/data/api-client";
import type { CountryGeoJSON, CountryProperties } from "@/types/map";

type ActiveCountry = MemberOrPartnerList["data"][number] | undefined | null;

interface MapGeoJsonProps {
	activeCountry: ActiveCountry;
	geoJson: CountryGeoJSON;
	countries: MemberOrPartnerList["data"];
	handleActiveCountryChange: (country: ActiveCountry) => void;
}

interface FeaturePropertiesProps extends CountryProperties {
	label_y: string;
	label_x: string;
}

const STATUS_PROPS = {
	is_member: { letter: "M", style: "fill-primary-600" },
	is_cooperating_partner: {
		letter: "C",
		style: "fill-primary-400",
	},
};

export function MapGeoJson(props: Readonly<MapGeoJsonProps>): ReactNode {
	const { activeCountry, geoJson, countries, handleActiveCountryChange } = props;
	const map = useMap();
	const t = useTranslations("MembersAndPartnersPage");

	const createCountryLetterIcon = (letter: string) => {
		return divIcon({
			html: `<div class="text-white text-[12px]">
            ${letter}
           </div>`,
			className: "clear-marker",
			iconSize: [14, 14],
		});
	};

	const onCountryAdded = (event: LeafletEvent, layer: GeoJSONType) => {
		const featureProperties =
			layer.feature?.type === "Feature"
				? (layer.feature.properties as FeaturePropertiesProps)
				: null;
		const name = featureProperties?.name ?? "";
		let markerLetter = null;

		layer.setStyle({ fillOpacity: 1 });

		const layerCountry = countries.find((country) => {
			return country.name === name;
		});
		const target = event.target as { _path: HTMLElement };

		target._path.classList.add("stroke-2");
		if (layerCountry) {
			const countryProps = STATUS_PROPS[layerCountry.status];
			markerLetter = countryProps.letter;
			target._path.classList.add(countryProps.style, "stroke-white");

			if (featureProperties) {
				const marker = LeafletMarker(
					[Number(featureProperties.label_y), Number(featureProperties.label_x)],
					{
						icon: createCountryLetterIcon(markerLetter),
						interactive: false,
					},
				);

				marker.addTo(map);
			}
		} else {
			target._path.classList.add("fill-primary-100", "stroke-gray-400");
			layer.options.interactive = false;
		}
	};

	const onCountryClick = (event: LeafletEvent, layer: GeoJSONType) => {
		const featureProperties =
			layer.feature?.type === "Feature" ? (layer.feature.properties as CountryProperties) : null;
		const name = featureProperties?.name ?? "";
		const layerCountry = countries.find((country) => {
			return country.name === name;
		});
		const target = event.target as { _path: HTMLElement };

		if (target._path.classList.contains("fill-primary-400")) {
			target._path.classList.add("fill-primary-500");
		} else if (target._path.classList.contains("fill-primary-600")) {
			target._path.classList.add("fill-primary-700");
		}
		handleActiveCountryChange(layerCountry);
	};

	const onPopupClose = (event: LeafletEvent) => {
		const target = event.target as { _path?: HTMLElement };
		if (target._path) {
			target._path.classList.remove("fill-primary-500");
			target._path.classList.remove("fill-primary-700");
		}
	};

	const onEachFeature = (_feature: GeoJSON.Feature, layer: Layer) => {
		layer.on("add", (event) => {
			onCountryAdded(event, layer as GeoJSONType);
		});

		layer.on("click", (event) => {
			onCountryClick(event, layer as GeoJSONType);
		});

		layer.on("popupclose", onPopupClose);
	};

	const { name: activeName, status, entity } = activeCountry ?? {};
	const slug = entity?.slug;
	const href = slug !== undefined ? `/network/members-and-partners/${slug}` : undefined;

	return (
		<GeoJSON data={geoJson} onEachFeature={onEachFeature}>
			<Popup>
				<CountryPopup
					href={href}
					label={status ? t(`status.${status}`) : ""}
					title={activeName ?? ""}
				/>
			</Popup>
		</GeoJSON>
	);
}
