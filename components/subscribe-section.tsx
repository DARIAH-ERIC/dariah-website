import { useExtracted as useTranslations } from "next-intl";
import { type ReactNode, useId } from "react";

interface SubscribeSectionProps {
	/** The way, or ways, to subscribe: a single control, at the end of the row from `md`. */
	children: ReactNode;
	/** What subscribing gets, e.g. which content, and in which apps. */
	description: string;
}

/**
 * Closes a list with the ways to subscribe to its content: a band across the page, between the list and the footer,
 * like the "Latest news" below a news item - rather than a lone control below the list, which reads as an afterthought.
 * So it is a direct child of `<Main>`, outside the `px-main` padding of the content above it, and aligned with the
 * page's header rather than with an inset list, e.g. the events timeline.
 */
export function SubscribeSection(props: Readonly<SubscribeSectionProps>): ReactNode {
	const { children, description } = props;

	const t = useTranslations();
	const headingId = useId();

	return (
		<section
			aria-labelledby={headingId}
			className="border-bs border-stroke-weak bg-background-subtle px-main pbs-12 pbe-14"
		>
			<div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between md:gap-x-columns">
				<div>
					<h2 className="text-title-4" id={headingId}>
						{t("Stay up to date")}
					</h2>
					<p className="mbs-2 text-text-weak">{description}</p>
				</div>
				{children}
			</div>
		</section>
	);
}
