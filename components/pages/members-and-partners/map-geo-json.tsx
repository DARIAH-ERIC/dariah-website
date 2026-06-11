import {
	divIcon,
	type GeoJSON as GeoJSONType,
	type LatLng,
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

type ActiveCountry =
	| (MemberOrPartnerList["data"][number] & { location: LatLng })
	| undefined
	| null;

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
	is_member_of: { letter: "M", style: "fill-primary-600" },
	is_cooperating_partner_of: {
		letter: "C",
		style: "fill-primary-400",
	},
	is_observer_of: { letter: "O", style: "fill-resource-training-material" },
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
		const nameLong = featureProperties?.name_long ?? "";
		let markerLetter = null;

		layer.setStyle({ fillOpacity: 1 });

		const layerCountry = countries.find((country) => {
			return country.name === name || country.name === nameLong;
		});
		const target = event.target as { _path: HTMLElement };

		target._path.classList.add("stroke-1");
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
			target._path.classList.add("fill-primary-100", "stroke-gray-400", "pointer-events-none!");
			layer.options.interactive = false;
		}
	};

	const onCountryClick = (event: LeafletEvent, layer: GeoJSONType) => {
		const featureProperties =
			layer.feature?.type === "Feature" ? (layer.feature.properties as CountryProperties) : null;
		const name = featureProperties?.name ?? "";
		const nameLong = featureProperties?.name_long ?? "";

		const layerCountry = countries.find((country) => {
			return country.name === name || country.name === nameLong;
		});

		const target = event.target as { _path: HTMLElement };

		if (target._path.classList.contains("fill-primary-400")) {
			target._path.classList.add("fill-primary-500");
		} else if (target._path.classList.contains("fill-primary-600")) {
			target._path.classList.add("fill-primary-700");
		} else if (target._path.classList.contains("fill-resource-training-material")) {
			target._path.classList.add("fill-governance-body-card-executive-body!");
		}

		if (layerCountry) {
			handleActiveCountryChange({
				...layerCountry,
				location: {
					lat: Number(featureProperties?.label_y),
					lng: Number(featureProperties?.label_x),
				} as LatLng,
			});
		}
	};

	const onPopupClose = () => {
		document.querySelector(".fill-primary-500")?.classList.remove("fill-primary-500");
		document.querySelector(".fill-primary-700")?.classList.remove("fill-primary-700");
		document
			.querySelector(String.raw`.fill-governance-body-card-executive-body\!`)
			?.classList.remove("fill-governance-body-card-executive-body!");
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

	const { name: activeName, status, entity, location } = activeCountry ?? {};
	const slug = entity?.slug;
	const href = slug !== undefined ? `/network/members-and-partners/${slug}` : undefined;

	return (
		<>
			<GeoJSON data={geoJson} onEachFeature={onEachFeature}></GeoJSON>
			{location && (
				<Popup
					eventHandlers={{
						popupclose: onPopupClose,
						layerremove: onPopupClose,
						remove: onPopupClose,
					}}
					offset={[205, 130]}
					position={[location.lat, location.lng]}
				>
					<CountryPopup
						href={href}
						label={status ? t(`status.${status}`) : ""}
						title={activeName ?? ""}
					/>
				</Popup>
			)}
		</>
	);
}
