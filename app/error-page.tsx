"use client";

import { log } from "@acdh-oeaw/lib";
import { useTranslations } from "next-intl";
import { type ReactNode, useEffect } from "react";

import { Image } from "@/components/image";
import { Main } from "@/components/main";
import { Button } from "@/components/ui/button/button";
import { Link } from "@/components/ui/link/link";
import { Typography } from "@/components/ui/typography/typography";
import logoDariah from "@/public/assets/images/logo-dariah-eu.svg";

export { viewport } from "@/app/_lib/viewport.config";

interface ErrorPageProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export function ErrorPage(props: Readonly<ErrorPageProps>): ReactNode {
	const { error, reset } = props;

	const t = useTranslations("ErrorPage");

	useEffect(() => {
		// TODO: Log the error to an error reporting service.
		log.error(error);
	}, [error]);

	return (
		<div className="relative isolate flex min-h-full flex-col bg-white">
			<Main>
				<div className="flex flex-1 flex-col gap-8 px-4 pt-8 lg:px-8 lg:pb-12 xl:px-40">
					<div className="flex min-h-[30vw] flex-wrap flex-1 gap-6 px-4 items-center justify-center lg:px-8 lg:gap-15">
						<Image alt={t("title")} className={"h-22 w-72.5 lg:h-38.5 lg:w-107"} src={logoDariah} />
						<div className="flex flex-col gap-8 h-fit">
							<Typography className="font-bold" variant="h2">
								{t("title")}
							</Typography>
							<Typography variant="regular">{t("description")}</Typography>
							<div className="flex gap-10 justify-center">
								<Link href="/" variant="primary" withDefaultLeftIcon={true}>
									{t("button")}
								</Link>
								<Button onClick={reset} variant="link-primary">
									{t("reset")}
								</Button>
							</div>
						</div>
					</div>
				</div>
			</Main>
		</div>
	);
}
