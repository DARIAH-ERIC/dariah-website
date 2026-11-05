import cn from "clsx/lite";
import { ExternalLinkIcon } from "lucide-react";
import { useExtracted as useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { unsafeHref } from "#/lib/navigation/href.ts";
import { Link } from "#/lib/navigation/link.tsx";

/** Smaller than a website's link in the content, being secondary to the name above it. */
const institutionLinkClassName =
	"inline-flex items-center gap-x-1.5 text-small font-medium text-text-accent underline-offset-4 hover:underline focus-visible-outline";

/** For a link's text which only a screen reader is to hear (see `InstitutionLinks`). */
function hidden(chunks: ReactNode): ReactNode {
	return <span className="sr-only">{chunks}</span>;
}

interface InstitutionLinksProps {
	/** The institution's name, which each link names for a screen reader. */
	name: string;
	website: string | null;
	/** Its record in ROR, the Research Organization Registry. */
	ror: string | null;
	className?: string;
}

/**
 * An institution's website and its record in ROR, the Research Organization Registry, below its name - rather than the
 * name linking to its website, so an institution with links reads as one without them does. Each link names the
 * institution for a screen reader, which would otherwise hear a list of links all called "Website" or "ROR". Nothing
 * renders for an institution with neither.
 */
export function InstitutionLinks(props: Readonly<InstitutionLinksProps>): ReactNode {
	const { name, website, ror, className } = props;

	const t = useTranslations();

	if (website == null && ror == null) {
		return null;
	}

	return (
		<ul className={cn("flex flex-wrap gap-x-5 gap-y-1", className)} role="list">
			{website != null ? (
				<li>
					<Link className={institutionLinkClassName} href={unsafeHref(website, true)}>
						{t.rich("Website<hidden> of {name}</hidden>", { name, hidden })}
						<span className="sr-only"> {t("(external website)")}</span>
						<ExternalLinkIcon aria-hidden={true} className="shrink-0 block-4 inline-4" />
					</Link>
				</li>
			) : null}
			{ror != null ? (
				<li>
					<Link className={institutionLinkClassName} href={unsafeHref(ror, true)}>
						{t.rich("ROR<hidden> record of {name}</hidden>", { name, hidden })}
						<span className="sr-only"> {t("(external website)")}</span>
						<ExternalLinkIcon aria-hidden={true} className="shrink-0 block-4 inline-4" />
					</Link>
				</li>
			) : null}
		</ul>
	);
}
