"use client";

import { useSearchParams } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { Button } from "@/components/ui/button/button";
import { ArrowBack } from "@/components/ui/icons/arrrow-back";
import { ArrowForward } from "@/components/ui/icons/arrrow-forward";
import { PaginationItem } from "@/components/ui/pagination/pagination-item";
import { useRouter } from "@/lib/navigation/navigation";

interface PaginationProps {
	pageCount: number;
	pageUrlAlias?: string;
	schouldScroll?: boolean;
}

export function Pagination(props: Readonly<PaginationProps>): ReactNode {
	const { pageCount, pageUrlAlias = "page", schouldScroll = false } = props;

	const [pagesArr, setPagesArr] = useState<Array<number>>([]);

	const router = useRouter();
	const searchParams = useSearchParams();
	const currentPage = parseInt(searchParams.get(pageUrlAlias) ?? "1");

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

	useEffect(() => {
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

		setPagesArr(getVisiblePages());
	}, [currentPage, pageCount]);

	return (
		<div className="flex w-full justify-end gap-2">
			<Button
				isDisabled={isFirstPage}
				onPress={() => {
					goToPage(currentPage - 1);
				}}
				variant="icon"
			>
				<ArrowBack />
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
				isDisabled={isLastPage}
				onPress={() => {
					goToPage(currentPage + 1);
				}}
				variant="icon"
			>
				<ArrowForward />
			</Button>
		</div>
	);
}
