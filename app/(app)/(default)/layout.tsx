import type { ReactNode } from "react";

import { BackToTopLink } from "#/app/(app)/(default)/_components/back-to-top-link.tsx";
import { Footer } from "#/app/(app)/(default)/_components/footer.tsx";
import { Header } from "#/app/(app)/(default)/_components/header.tsx";
import { PageFrame } from "#/app/(app)/(default)/_components/page-frame.tsx";
import { SkipLink } from "#/app/(app)/(default)/_components/skip-link.tsx";

interface DefaultLayoutProps extends LayoutProps<"/"> {}

export default function DefaultLayout(props: Readonly<DefaultLayoutProps>): ReactNode {
	const { children } = props;

	return (
		<PageFrame>
			<SkipLink />
			<Header />
			{children}
			<Footer />
			<BackToTopLink />
		</PageFrame>
	);
}
