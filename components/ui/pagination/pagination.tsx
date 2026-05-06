"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button/button";
import { ChevronForwardIcon } from "@/components/ui/icons/chevron-forward";
import { ChevronLeftIcon } from "@/components/ui/icons/chevron-left";
import { PaginationItem } from "@/components/ui/pagination/pagination-item";

interface PaginationProps {
	pageCount: number;
	pageUrlAlias?: string;
	shouldScroll?: boolean;
	defaultCurrentPage?: number;
	firstPageIndex?: number;
	refinePage?: (page: number) => void;
}

export function Pagination(props: Readonly<PaginationProps>): ReactNode {
	const {
		pageCount,
		pageUrlAlias = "page",
		shouldScroll = false,
		defaultCurrentPage,
		firstPageIndex = 1,
		refinePage,
	} = props;

	const router = useRouter();
	const searchParams = useSearchParams();
	const pagesToTextDiff = firstPageIndex === 0 ? 1 : 0;
	const pageUrlValue = searchParams.get(pageUrlAlias);
	const currentPage =
		pageUrlValue !== null
			? Math.max(Number.parseInt(pageUrlValue) - pagesToTextDiff, 0)
			: (defaultCurrentPage ?? firstPageIndex);

	const isFirstPage = currentPage === firstPageIndex;
	const isLastPage = currentPage === pageCount;

	const goToPage = (pageNum: number | string) => {
		let value = Number(pageNum);
		if (!value) value = firstPageIndex;
		if (value < firstPageIndex) value = firstPageIndex;
		if (value > pageCount) value = pageCount;

		const params = new URLSearchParams(searchParams.toString());

		if (value === firstPageIndex) params.delete(pageUrlAlias);
		else params.set(pageUrlAlias, (value + pagesToTextDiff).toString());

		refinePage?.(value);

		router.replace(`?${params.toString()}`, { scroll: shouldScroll });
	};

	const getVisiblePages = () => {
		let surrounding = 2;

		if (currentPage === firstPageIndex || (currentPage === pageCount && pageCount >= 5)) {
			surrounding = 4;
		} else if (
			currentPage === 2 - pagesToTextDiff ||
			(pageCount === 4 && currentPage === 4 - pagesToTextDiff) ||
			(pageCount > 4 && currentPage === pageCount - (1 - pagesToTextDiff))
		) {
			surrounding = 3;
		}

		const start = Math.max(firstPageIndex, currentPage - surrounding);
		const end = Math.min(pageCount, currentPage + surrounding);

		return Array.from({ length: end - start + 1 }, (_, i) => {
			return start + i;
		});
	};

	const pagesArr = getVisiblePages();

	if (pageCount <= 0) return null;

	return (
		<div className="flex gap-4 md:gap-5">
			<Button
				className={cn("[&_svg]:size-10.75", isFirstPage ? "hidden" : "")}
				isDisabled={isFirstPage}
				onPress={() => {
					goToPage(currentPage - 1);
				}}
				variant="icon-button-color-bg"
			>
				<ChevronLeftIcon />
			</Button>

			{pagesArr.map((page) => {
				return (
					<PaginationItem
						key={page}
						active={page === currentPage}
						onPress={() => {
							goToPage(page);
						}}
						value={(page + pagesToTextDiff).toString()}
					/>
				);
			})}

			<Button
				className={cn("[&_svg]:size-10.75", isLastPage ? "hidden" : "")}
				isDisabled={isLastPage}
				onPress={() => {
					goToPage(currentPage + 1);
				}}
				variant="icon-button-color-bg"
			>
				<ChevronForwardIcon />
			</Button>
		</div>
	);
}
