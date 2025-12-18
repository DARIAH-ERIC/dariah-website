import { useTranslations } from "next-intl";
import { Fragment, type ReactNode } from "react";

import { Footer } from "@/app/(default)/_components/footer";
import { Header } from "@/app/(default)/_components/header";
import { mainContentId } from "@/app/(default)/_components/main";
import { SkipLink } from "@/components/skip-link";

interface DefaultLayoutProps extends LayoutProps<"/"> {}

export default function DefaultLayout(props: Readonly<DefaultLayoutProps>): ReactNode {
	const { children } = props;

	const t = useTranslations("DefaultLayout");

	return (
		<Fragment>
			<SkipLink href={`#${mainContentId}`}>{t("skip-link")}</SkipLink>

			<div className="relative isolate flex min-h-full flex-col">
				<Header />

				{children}

				<Footer />
			</div>
		</Fragment>
	);
}
