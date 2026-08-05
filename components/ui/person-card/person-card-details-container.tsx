"use client";

import { cn } from "@acdh-oeaw/style-variants";
import type { JSONContent } from "@tiptap/core";
import { useTranslations } from "next-intl";
import { type ReactNode, useEffect, useRef } from "react";

import { Link } from "@/components/ui/link/link";
import { PersonCardDetails } from "@/components/ui/person-card/person-card-details";
import type { Person } from "@/lib/data/api-client";

interface PersonCardDetailsContainerProps {
	selectedPerson: Person;
	href: string;
	backToListText?: string;
	className?: string;
}

export function PersonCardDetailsContainer(
	props: Readonly<PersonCardDetailsContainerProps>,
): ReactNode {
	const t = useTranslations("(default).PersonCard");
	const { selectedPerson, href, backToListText, className } = props;
	const personHeaderRef = useRef<HTMLHeadingElement | null>(null);

	useEffect(() => {
		if (personHeaderRef.current) personHeaderRef.current.focus();
	}, [selectedPerson]);

	return (
		<div className={cn("flex flex-col flex-wrap gap-10 w-full", className)}>
			<Link href={href} variant="primary" withDefaultLeftIcon={true}>
				{backToListText ?? t("defaultBackToList")}
			</Link>
			<PersonCardDetails
				ref={personHeaderRef}
				description={
					selectedPerson.biography.find((content) => {
						return content.type === "rich_text";
					}) as JSONContent
				}
				email={selectedPerson.email ?? undefined}
				imageAlt={selectedPerson.image?.alt}
				imageUrl={selectedPerson.image?.url}
				name={selectedPerson.name}
				position={selectedPerson.positions}
				tabIndex={-1}
			/>
		</div>
	);
}
