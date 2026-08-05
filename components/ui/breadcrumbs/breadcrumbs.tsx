"use client";

import { cn } from "@acdh-oeaw/style-variants";
import React, { type ReactNode } from "react";
import {
	Breadcrumb as AriaBreadcrumb,
	type BreadcrumbProps,
	Breadcrumbs as AriaBreadcrumbs,
	type BreadcrumbsProps,
	composeRenderProps,
} from "react-aria-components";

import { Link, type LinkProps } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";

export function Breadcrumbs<T extends object>(props: Readonly<BreadcrumbsProps<T>>): ReactNode {
	const { className, ...rest } = props;
	return (
		<AriaBreadcrumbs className={cn("flex flex-wrap gap-2 items-center", className)} {...rest} />
	);
}

export function Breadcrumb(
	props: Readonly<BreadcrumbProps & Omit<LinkProps, "className">>,
): ReactNode {
	const { id, className, href } = props;
	return (
		<AriaBreadcrumb
			className={composeRenderProps(className, (className) => {
				return cn(
					"flex gap-2 items-center uppercase not-last:after:content-['/'] not-last:after:text-[0.875rem]",
					className,
				);
			})}
			id={id}
		>
			{({ isCurrent }) => {
				const { children } = props;
				return (
					<>
						{!isCurrent ? (
							<Link isDisabled={href === undefined} variant={"tertiary"} {...props} />
						) : (
							<Typography
								aria-current="page"
								className="text-regular text-black text-[0.875rem] cursor-default!"
							>
								{children}
							</Typography>
						)}
					</>
				);
			}}
		</AriaBreadcrumb>
	);
}
