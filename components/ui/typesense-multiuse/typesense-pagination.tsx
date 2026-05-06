import type { ReactNode } from "react";
import { usePagination, type UsePaginationProps } from "react-instantsearch";

import { Pagination } from "@/components/ui/pagination/pagination";

type TypesensePaginationProps = UsePaginationProps & {
	pageUrlAlias: string;
};

export function TypesensePagination(props: Readonly<TypesensePaginationProps>): ReactNode {
	const { pageUrlAlias, ...rest } = props;
	const { nbPages, refine } = usePagination(rest);

	if (!nbPages || nbPages === 1) return <div className="mb-15" />;

	return (
		<div className="mb-15 pl-4 bg-pagination-bg max-w-full w-92 h-21 flex items-center sm:w-125 sm:pl-8 sm:max-w-125">
			<Pagination
				firstPageIndex={0}
				pageCount={nbPages - 1}
				pageUrlAlias={pageUrlAlias}
				refinePage={refine}
				shouldScroll={true}
			/>
		</div>
	);
}
