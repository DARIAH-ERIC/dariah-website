import { cn } from "@acdh-oeaw/style-variants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { type ReactNode, useRef, useState } from "react";
import { useInstantSearch, useSearchBox, type UseSearchBoxProps } from "react-instantsearch";

import { Button } from "@/components/ui/button/button";
import { SearchIcon } from "@/components/ui/icons/search";
import { TextField } from "@/components/ui/text-field/text-field";

export function SearchBox(props: Readonly<UseSearchBoxProps & { className?: string }>): ReactNode {
	const t = useTranslations("SearchPage");
	const { query, refine } = useSearchBox(props);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const { status } = useInstantSearch();
	const [inputValue, setInputValue] = useState(query);
	const inputRef = useRef<HTMLInputElement>(null);
	const { className } = props;

	const isSearchStalled = status === "stalled";

	const setQuery = (value: string) => {
		setInputValue(value);
		const params = new URLSearchParams(searchParams.toString());

		if (value !== "") params.set("query", value);
		else params.delete("query");

		params.delete("page");

		router.push(`${pathname}?${params.toString()}`, { scroll: false });

		refine(value);
	};

	return (
		<form
			action=""
			className={cn("flex w-full max-w-187 gap-0 items-end", className)}
			noValidate={true}
			onReset={(event) => {
				event.preventDefault();
				event.stopPropagation();

				setQuery("");

				if (inputRef.current) {
					inputRef.current.focus();
				}
			}}
			onSubmit={(event) => {
				event.preventDefault();
				event.stopPropagation();

				if (inputRef.current) {
					inputRef.current.blur();
				}
			}}
			role="search"
		>
			<TextField
				className="flex-1"
				onChange={(event) => {
					setQuery(event);
				}}
				placeholder={t("searchBox.placeholder")}
				startIcon={<SearchIcon className="size-5" />}
				value={inputValue}
			/>
			<Button isDisabled={inputValue.length === 0 || isSearchStalled} variant="secondary-blue">
				{t("searchBox.buttonLabel")}
			</Button>
		</form>
	);
}
