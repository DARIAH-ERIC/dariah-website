export interface CountryGeoJSON {
	type: "FeatureCollection";
	features: Array<CountryFeature>;
}

export interface CountryFeature {
	type: "Feature";
	properties: CountryProperties;
	geometry: CountryGeometry;
}

export interface CountryProperties {
	featurecla: string;
	scalerank: number;
	labelrank: number;
	sovereignt: string;
	sov_a3: string;
	adm0_dif: number;
	level: number;
	type: string;
	admin: string;
	adm0_a3: string;
	geounit: string;
	name: string;
	name_long: string;
	formal_en: string;
	pop_est: number;
	pop_year: number;
	gdp_md: number;
	economy: string;
	income_grp: string;
	continent: string;
	subregion: string;
	wikidataid: string;

	name_ar?: string;
	name_de?: string;
	name_en?: string;
	name_fr?: string;
	name_pl?: string;

	mapcolor7: number;
	mapcolor8: number;
	mapcolor9: number;
	mapcolor13: number;

	iso_a2: string;
	iso_a3: string;
	iso_a3_eh: string;
	iso_n3: string;

	filename: string;
}

export interface CountryGeometry {
	type: "Polygon" | "MultiPolygon";
	coordinates: Array<Array<Array<number>>> | Array<Array<Array<Array<number>>>>;
}

export interface Country {
	id: number;
	coordinators: string;
	name: string;
	code: string;
	website: string;
	websitename: string;
	status: string | null;
	statusName: string | undefined;
	entities: Array<never>;
	capital: {
		latitude: string;
		longitude: string;
	};
	national: {
		persons: Array<never>;
		institutions: Array<never>;
	};
	partnerInstitutions: Array<never>;
	nationalInstitutions: Array<never>;
	cooperatingInstitutions: Array<never>;
	projects: Array<never>;
	countryDescription: string;
	countryLogo: null;
}
