import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Main } from "@/app/(default)/_components/main";
import { client } from "@/lib/data/api-client";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("DocumentsPoliciesPage");

	const title = t("meta.title");

	const metadata: Metadata = {
		title,
		// openGraph: {
		// 	title,
		// },
	};

	return metadata;
}

export default async function DocumentsPoliciesPage(): Promise<ReactNode> {
	const _t = await getTranslations("DocumentsPoliciesPage");

	const response = await client.documentsPolicies.list();

	const { data: items } = response.data;

	return (
		<Main className="container flex flex-1 flex-col gap-8">
			<ul role="list">
				{items.map((item) => {
					return (
						<li key={item.id}>
							<pre>{JSON.stringify(item, null, 2)}</pre>
						</li>
					);
				})}
			</ul>
		</Main>
	);
}
