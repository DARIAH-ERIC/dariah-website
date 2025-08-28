import type { Entry } from "@keystatic/core/reader";

import type keystaticConfig from "@/keystatic.config";
import type { IntlLocale } from "@/lib/i18n/locales";

declare module "@acdh-oeaw/keystatic-lib" {
	export interface KeystaticConfig {
		locales: IntlLocale;
	}
}

type InferredConfig = typeof keystaticConfig;

type ExtractCollectionType<T extends string> = T extends `${string}:${infer R}` ? R : never;

type Collection = ExtractCollectionType<keyof InferredConfig["collections"]>;

type Keyword = Entry<InferredConfig["collections"]["en-GB:keywords"]>;
type Person = Entry<InferredConfig["collections"]["en-GB:persons"]>;
type Organisation = Entry<InferredConfig["collections"]["en-GB:organisations"]>;

type IndexPage = Entry<InferredConfig["singletons"]["en-GB:index-page"]>;

export type HeroSectionProps = IndexPage["hero"];
export type FeatureSectionProps = IndexPage["main"];

type ExtractCardSection = Extract<
	FeatureSectionProps["sections"][number],
	{ discriminant: "cardsSection" }
>["value"];

export type CardSectionProps = Omit<ExtractCardSection, "id">;
export type CardProps = ExtractCardSection["cards"][number]["value"] & {
	discriminent: ExtractCardSection["cards"][number]["discriminant"];
};
