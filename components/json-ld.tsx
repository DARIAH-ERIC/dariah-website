import type { ReactNode } from "react";
import type { Thing, WithContext } from "schema-dts";

interface JsonLdProps {
	item: WithContext<Thing>;
}

/**
 * Characters which could end the script element or open markup inside it - `</script>`, `<!--` - escaped the way json
 * does, so that content from the api cannot break out of the element. A script's content is raw text, so html entities,
 * which the json-ld spec suggests, would stay in the data as written for any parser which does not undo them; json
 * escapes are decoded by every json parser. The line and paragraph separators are not needed in json, only in older
 * javascript, but cost nothing.
 */
const unsafeCharacters = /[<>&\u2028\u2029]/gu;

function serialize(item: WithContext<Thing>): string {
	return JSON.stringify(item).replaceAll(unsafeCharacters, (character) => {
		return `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`;
	});
}

/** Structured data for search engines - see `#/lib/json-ld.ts`. */
export function JsonLd(props: Readonly<JsonLdProps>): ReactNode {
	const { item } = props;

	return <script dangerouslySetInnerHTML={{ __html: serialize(item) }} type="application/ld+json" />;
}
