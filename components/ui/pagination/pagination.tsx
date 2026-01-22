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
	schouldScroll?: boolean;
	defaultCurrentPage?: string;
}

export function Pagination(props: Readonly<PaginationProps>): ReactNode {
	const {
		pageCount,
		pageUrlAlias = "page",
		schouldScroll = false,
		defaultCurrentPage = "1",
	} = props;

	const router = useRouter();
	const searchParams = useSearchParams();
	const currentPage = Number.parseInt(searchParams.get(pageUrlAlias) ?? defaultCurrentPage);

	const isFirstPage = currentPage === 1;
	const isLastPage = currentPage === pageCount;

	const goToPage = (pageNum: number | string) => {
		let value = Number(pageNum);
		if (!value) value = 1;
		if (value < 1) value = 1;
		if (value > pageCount) value = pageCount;

		const params = new URLSearchParams(searchParams.toString());

		if (value === 1) params.delete(pageUrlAlias);
		else params.set(pageUrlAlias, value.toString());

		router.replace(`?${params.toString()}`, { scroll: schouldScroll });
	};

	const getVisiblePages = () => {
		let surrounding = 2;

		if (currentPage === 1 || (currentPage === pageCount && pageCount >= 5)) {
			surrounding = 4;
		} else if (
			currentPage === 2 ||
			(pageCount === 4 && currentPage === 4) ||
			(pageCount > 4 && currentPage === pageCount - 1)
		) {
			surrounding = 3;
		}

		const start = Math.max(1, currentPage - surrounding);
		const end = Math.min(pageCount, currentPage + surrounding);

		return Array.from({ length: end - start + 1 }, (_, i) => {
			return start + i;
		});
	};

	const pagesArr = getVisiblePages();

	return (
		<div className="flex gap-5">
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
						value={page.toString()}
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
