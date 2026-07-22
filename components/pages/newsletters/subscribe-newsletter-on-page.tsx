"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";
import * as v from "valibot";

import { ContentBlocks } from "@/components/content-blocks";
import { Button } from "@/components/ui/button/button";
import { TextField } from "@/components/ui/text-field/text-field";
import { Typography } from "@/components/ui/typography/typography";
import type { components } from "@/lib/api/types";

const DEFAULT_400_ERROR_MESSAGE = "Bad Request";
const DEFAULT_500_ERROR_MESSAGE = "Internal Server Error";

interface SubscribeNewsletterOnPageProps {
	staticContent: components["schemas"]["Page"]["content"];
}

export function SubscribeNewsletterOnPage(
	props: Readonly<SubscribeNewsletterOnPageProps>,
): ReactNode {
	const { staticContent } = props;
	const [email, setEmail] = useState("");
	const [emailError, setEmailError] = useState<undefined | string>(undefined);
	const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success">("idle");
	const t = useTranslations("(default).Footer");

	const emailSchema = v.pipe(
		v.string(),
		v.nonEmpty(t("navigation.newsletter.error.emptyEmail")),
		v.email(t("navigation.newsletter.error.invalidEmail")),
	);

	const handleEmailChange = (value: string) => {
		setEmailError(undefined);
		setEmail(value);
	};

	const handleNewsletterSubscribe = async () => {
		const res = await fetch("/api/newsletter/subscribe", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email }),
		});

		if (!res.ok) {
			const data = (await res.json()) as { message?: string };
			const message = data.message ?? t("navigation.newsletter.error.subscriptionFailed");

			if (message === DEFAULT_400_ERROR_MESSAGE || message === DEFAULT_500_ERROR_MESSAGE) {
				setEmailError(t("navigation.newsletter.error.subscriptionFailed"));
			} else {
				setEmailError(message);
			}
			setSubscribeStatus("idle");
		} else {
			setSubscribeStatus("success");
			setEmail("");

			setTimeout(() => {
				setSubscribeStatus("idle");
			}, 3000);
		}
	};

	const handleNewsletterSubmit = () => {
		if (subscribeStatus !== "idle") return;

		setSubscribeStatus("loading");
		setEmailError(undefined);
		const result = v.safeParse(emailSchema, email);
		if (!result.success) {
			setEmailError(result.issues[0].message);
			return;
		}

		void (async () => {
			await handleNewsletterSubscribe();
		})();
	};

	return (
		<div className="flex flex-col gap-10 px-4 xl:px-12 xl:items-center">
			<div className="xl:w-[50%]">
				<ContentBlocks fields={staticContent} />
			</div>
			<div className="flex flex-col gap-8.5 xl:w-[50%]">
				<div className="flex flex-col gap-2">
					<div className="flex gap-0.5">
						<TextField
							aria-errormessage={emailError}
							className="flex-1"
							onChange={handleEmailChange}
							placeholder={t("navigation.newsletter.form.placeholder")}
							value={email}
						/>
						<Button
							isDisabled={subscribeStatus !== "idle"}
							isPending={subscribeStatus === "loading"}
							onClick={handleNewsletterSubmit}
							variant="secondary-blue"
						>
							{t("navigation.newsletter.form.button")}
						</Button>
					</div>
					{emailError !== undefined && (
						<Typography className="text-red-500" variant="small">
							{emailError}
						</Typography>
					)}
					{subscribeStatus === "success" && (
						<Typography variant="small">{t("navigation.newsletter.success")}</Typography>
					)}
				</div>
			</div>
		</div>
	);
}
