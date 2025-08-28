import type { IntlLocale } from "@/lib/i18n/locales";
import { createCollectionResource } from "@/lib/keystatic/resources";
import type { Collection } from "@/types/keystatic";

export async function getRelatedEntities(
	slugs: Array<string>,
	collection: Collection,
	locale: IntlLocale,
): Promise<
	Array<Awaited<ReturnType<Awaited<ReturnType<typeof createCollectionResource>["read"]>>>["data"]>
> {
	return await Promise.all(
		slugs.map(async (slug) => {
			return (await createCollectionResource(collection, locale).read(slug)).data;
		}),
	);
}
