import { type ReactNode, Suspense } from "react";

import { BackToTopLink } from "#/app/(app)/(default)/_components/back-to-top-link.tsx";
import { FocusOnNavigation } from "#/app/(app)/(default)/_components/focus-on-navigation.tsx";
import { Footer } from "#/app/(app)/(default)/_components/footer.tsx";
import { Header } from "#/app/(app)/(default)/_components/header.tsx";
import { PageFrame } from "#/app/(app)/(default)/_components/page-frame.tsx";
import { SkipLink } from "#/app/(app)/(default)/_components/skip-link.tsx";

interface DefaultLayoutProps extends LayoutProps<"/"> {}

export default function DefaultLayout(props: Readonly<DefaultLayoutProps>): ReactNode {
	const { children } = props;

	return (
		<PageFrame>
			{/* The pathname suspends on routes with a dynamic param not covered by `generateStaticParams`. */}
			<Suspense fallback={null}>
				<FocusOnNavigation />
			</Suspense>
			<SkipLink />
			<Header />
			{children}
			<Footer />
			<BackToTopLink />
		</PageFrame>
	);
}
