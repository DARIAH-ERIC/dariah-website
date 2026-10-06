import { useExtracted as useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Main } from "#/app/(app)/(default)/_components/main.tsx";
import { Breadcrumbs } from "#/components/breadcrumbs.tsx";
import { href } from "#/lib/navigation/href.ts";

interface NewsLayoutProps extends LayoutProps<"/news"> {}

/**
 * The first page of the news list is at `/news`, each later one at `/news/page/<n>`, so every page is prerendered whole
 * and has a single url (see `lib/navigation/page-segment.ts`). The breadcrumbs are shared, here; the title is not,
 * since the first page leads with the featured announcement above it.
 */
export default function NewsLayout(props: Readonly<NewsLayoutProps>): ReactNode {
	const { children } = props;

	const t = useTranslations();

	return (
		<Main>
			<div className="px-main pbs-8">
				<Breadcrumbs current={href({ pathname: "/news" })} label={t("News")} />
			</div>
			{children}
		</Main>
	);
}
