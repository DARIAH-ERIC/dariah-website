import React, { type ReactNode } from "react";

import { ResourceBySourceCard } from "@/components/ui/resource-card/resource-by-source-card";
import type { ResourceCardProps } from "@/components/ui/resource-card/resource-card.types";
import { ResourceListCard } from "@/components/ui/resource-card/resource-list-card";

export function ResourceCard(props: Readonly<ResourceCardProps>): ReactNode {
	const { variant = "list" } = props;

	return variant === "list" ? <ResourceListCard {...props} /> : <ResourceBySourceCard {...props} />;
}
