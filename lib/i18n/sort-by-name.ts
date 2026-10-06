import type { Locale } from "next-intl";

interface Named {
	name: string;
}

/**
 * Items sorted by name, as a reader looks one up in a list: by the locale's collation, word by word, and ignoring
 * leading punctuation, so e.g. `"Ivan Vazov" Public Library` is found under I rather than first. Only leading
 * punctuation is ignored: `ignorePunctuation` would ignore the spaces between words too, and put e.g. "Icelandic Film
 * Museum" before "Iceland University of the Arts".
 */
export function sortByName<T extends Named>(items: ReadonlyArray<T>, locale: Locale): Array<T> {
	const collator = new Intl.Collator(locale);

	return items
		.map((item) => {
			return { item, key: item.name.replace(/^[^\p{L}\p{N}]+/u, "") };
		})
		.toSorted((a, z) => collator.compare(a.key, z.key))
		.map(({ item }) => item);
}
