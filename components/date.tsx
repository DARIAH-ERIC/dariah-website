import { format } from "date-fns";
import { enGB } from "date-fns/locale";
import type { ReactNode } from "react";

interface DateComponentProps {
	date: string;
}

const FORMAT = "d MMMM yyyy";

export function DateComponent(props: DateComponentProps): ReactNode {
	const { date } = props;
	return <>{format(new Date(date), FORMAT, { locale: enGB })}</>;
}
