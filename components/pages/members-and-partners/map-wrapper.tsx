"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

import type { MemberOrPartnerList } from "@/lib/data/api-client";
import type { CountryGeoJSON } from "@/types/map";

const Map = dynamic(
	async () => {
		const module = await import("@/components/pages/members-and-partners/map");
		return module.Map;
	},
	{
		ssr: false,
		loading() {
			return (
				<div className="w-full z-1 h-257 flex items-center justify-center lg:h-216">
					{"Loading.."}
				</div>
			);
		},
	},
);

interface MapWrapperProps {
	geoJson: CountryGeoJSON;
	countries: MemberOrPartnerList["data"];
}

export function MapWrapper(props: Readonly<MapWrapperProps>): ReactNode {
	const { geoJson, countries } = props;
	return (
		<div className="w-full z-1 h-257 lg:h-216">
			<Map countries={countries} geoJson={geoJson} />
		</div>
	);
}
