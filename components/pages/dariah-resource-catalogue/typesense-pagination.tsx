import type { ReactNode } from "react";
import { usePagination, type UsePaginationProps } from "react-instantsearch";

import { Pagination } from "@/components/ui/pagination/pagination";

export function TypesensePagination(props: Readonly<UsePaginationProps>): ReactNode {
	const { nbPages, refine } = usePagination(props);

	if (!nbPages || nbPages === 1) return <div className="mb-15" />;

	return (
		<div className="mb-15 pl-8 bg-pagination-bg max-w-125 w-125 h-21 flex items-center">
			<Pagination
				firstPageIndex={0}
				pageCount={nbPages - 1}
				pageUrlAlias="dariah-resources[page]"
				refinePage={refine}
				schouldScroll={true}
			/>
		</div>
	);
}
