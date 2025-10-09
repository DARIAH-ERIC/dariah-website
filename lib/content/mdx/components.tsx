import { Callout } from "@/components/content/callout";
import { Disclosure } from "@/components/content/disclosure";
import { Embed } from "@/components/content/embed";
import { Figure } from "@/components/content/figure";
import { Grid, GridItem } from "@/components/content/grid";
import { Link as ContentLink } from "@/components/content/link";
import { LinkButton } from "@/components/content/link-button";
import { TableOfContents } from "@/components/content/table-of-contents";
import { Tab, Tabs } from "@/components/content/tabs";
import { Video } from "@/components/content/video";
import { Image } from "@/components/image";
import { Link } from "@/components/link";

export const components = {
	a: Link,
	Callout,
	Disclosure,
	Embed,
	Figure,
	Grid,
	GridItem,
	img: Image,
	Link: ContentLink,
	LinkButton,
	Tab,
	TableOfContents,
	Tabs,
	Video,
};

export function useMDXComponents(): MDXProvidedComponents {
	return components;
}
