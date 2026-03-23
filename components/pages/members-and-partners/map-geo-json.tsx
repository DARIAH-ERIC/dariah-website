import {
	divIcon,
	type GeoJSON as GeoJSONType,
	type Layer,
	type LeafletEvent,
	marker as LeafletMarker,
} from "leaflet";
import type { ReactNode } from "react";
import { GeoJSON, Popup, useMap } from "react-leaflet";

import { CountryPopup } from "@/components/pages/members-and-partners/country-popup";
import type { Country, CountryGeoJSON, CountryProperties } from "@/types/map";

interface MapGeoJsonProps {
	activeCountry: Country | undefined | null;
	geoJson: CountryGeoJSON;
	countries: Record<string, Country>;
	handleActiveCountryChange: (country: Country | undefined | null) => void;
}

interface FeaturePropertiesProps extends CountryProperties {
	label_y: string;
	label_x: string;
}

const STATUS_PROPS = {
	members: { letter: "M", style: "fill-primary-600" },
	"cooperating-partners": { letter: "C", style: "fill-primary-400" },
};

export function MapGeoJson(props: Readonly<MapGeoJsonProps>): ReactNode {
	const { activeCountry, geoJson, countries, handleActiveCountryChange } = props;
	const map = useMap();

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
		const iso3 = featureProperties?.iso_a3_eh ?? "";
		let markerLetter = null;

		layer.setStyle({ fillOpacity: 1 });

		const layerCountry = countries[iso3];
		const target = event.target as { _path: HTMLElement };

		target._path.classList.add("stroke-2");
		if (
			layerCountry &&
			(layerCountry.status === "members" || layerCountry.status === "cooperating-partners")
		) {
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
		const iso3 = featureProperties?.iso_a3_eh ?? "";
		const layerCountry = iso3 ? countries[iso3] : undefined;
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

	const { name: activeName, statusName: activeStatus } = activeCountry ?? {};
	const href =
		activeCountry && activeCountry.status !== null
			? `/network/members-and-partners/${activeCountry.code}`
			: undefined;

	return (
		<GeoJSON data={geoJson} onEachFeature={onEachFeature}>
			<Popup>
				<CountryPopup href={href} label={activeStatus} title={activeName ?? ""} />
			</Popup>
		</GeoJSON>
	);
}
