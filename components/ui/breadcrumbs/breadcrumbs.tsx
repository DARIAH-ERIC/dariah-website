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
	const { className } = props;
	return <AriaBreadcrumbs className={cn("flex gap-2 items-center", className)} {...props} />;
}

export function Breadcrumb(
	props: Readonly<BreadcrumbProps & Omit<LinkProps, "className">>,
): ReactNode {
	const { id, className } = props;
	return (
		<AriaBreadcrumb
			className={composeRenderProps(className, (className) => {
				return cn("flex gap-2 items-center uppercase", className);
			})}
			id={id}
		>
			{({ isCurrent }) => {
				return (
					<>
						<Link variant={isCurrent ? "breadcrumb-current" : "tertiary"} {...props} />
						{!isCurrent && <BreadcrumbsSeparator />}
					</>
				);
			}}
		</AriaBreadcrumb>
	);
}

export function BreadcrumbsSeparator(): ReactNode {
	return (
		<Typography className="text-[14px]" variant="regular">
			{"/"}
		</Typography>
	);
}
