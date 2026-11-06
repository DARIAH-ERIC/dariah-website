import { NextIntlClientProvider, useLocale } from "next-intl";
import type { ReactNode } from "react";

import { ClientProviders } from "#/app/(app)/_components/client-providers.tsx";

interface ProvidersProps {
	children: ReactNode;
}

export function Providers(props: Readonly<ProvidersProps>): ReactNode {
	const { children } = props;

	const locale = useLocale();

	return (
		<NextIntlClientProvider>
			<ClientProviders locale={locale}>{children}</ClientProviders>
		</NextIntlClientProvider>
	);
}
