import React, { type ReactNode } from "react";

import type { EventCardProps } from "@/components/ui/event-card/event-card.types";
import { EventCardHomepage } from "@/components/ui/event-card/event-card-homepage";
import { EventCardList } from "@/components/ui/event-card/event-card-list";

export function EventCard(props: Readonly<EventCardProps>): ReactNode {
	const { variant } = props;

	return variant === "homepage" ? <EventCardHomepage {...props} /> : <EventCardList {...props} />;
}
