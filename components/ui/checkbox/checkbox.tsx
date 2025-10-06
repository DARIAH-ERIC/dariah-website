"use client";

import { cn } from "@acdh-oeaw/style-variants";
import { mergeRefs } from "@react-aria/utils";
import { type ForwardedRef, forwardRef, type ReactNode, useMemo, useRef } from "react";
import { useObjectRef } from "react-aria";
import { Checkbox as AriaCheckbox, type CheckboxProps } from "react-aria-components";

import { CheckIcon } from "@/components/ui/icons/check";

export const Checkbox = forwardRef(function Checkbox(
	props: Readonly<CheckboxProps>,
	forwardedRef: ForwardedRef<HTMLInputElement>,
): ReactNode {
	const ref = useRef<HTMLInputElement>(null);
	const linkRef = useObjectRef(
		useMemo(() => {
			return mergeRefs(forwardedRef, ref);
		}, [forwardedRef, ref]),
	);

	return (
		<AriaCheckbox className="group" inputRef={linkRef} {...props}>
			<div
				className={cn(
					"m-1 flex size-10 items-center justify-center rounded-full bg-transparent",
					"hover:bg-gray-200",
					"group-data-focus-visible:bg-accent-300",
					"group-data-pressed:bg-primary-200",
					"group-data-disabled:bg-transparent",
				)}
			>
				<div
					className={cn(
						"flex size-[18px] items-center justify-center rounded-1 border border-gray-600 bg-white",
						"group-data-focus-visible:border-2 group-data-focus-visible:border-black",
						"group-data-pressed:border group-data-pressed:border-primary-500",
						"group-data-disabled:border-gray-400 group-data-disabled:bg-gray-100",
						"group-data-selected:bg-primary-500",
						"group-data-focus-visible:group-data-selected:bg-black",
						"group-data-disabled:group-data-selected:bg-gray-200",
					)}
				>
					<CheckIcon
						aria-hidden="true"
						className={cn(
							"fill-white",
							"group-data-disabled:group-data-selected:fill-gray-400",
						)}
					/>
				</div>
			</div>
		</AriaCheckbox>
	);
});
