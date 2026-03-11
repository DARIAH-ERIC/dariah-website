import type { ReactNode } from "react";
import { useInstantSearch } from "react-instantsearch";

export function SearchErrorBoundary({
	children,
	fallback,
}: Readonly<{ children: ReactNode; fallback: ReactNode }>): ReactNode {
	const { error } = useInstantSearch({ catchError: true });

	if (error) {
		return fallback;
	}

	return children;
}
