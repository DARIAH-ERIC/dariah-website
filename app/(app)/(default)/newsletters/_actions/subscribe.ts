"use server";

import { getExtracted as getTranslations } from "next-intl/server";
import * as v from "valibot";

import * as api from "#/lib/api/endpoints.ts";

export type SubscribeFormState =
	| { status: "idle" }
	| { status: "error"; message: string; email: string }
	| { status: "success"; message: string };

const SubscribeFormSchema = v.object({
	email: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.email()),
});

export async function subscribe(_state: SubscribeFormState, formData: FormData): Promise<SubscribeFormState> {
	const t = await getTranslations();

	const raw = formData.get("email");
	const input = v.safeParse(SubscribeFormSchema, { email: raw });

	if (!input.success) {
		return {
			status: "error",
			message: t("Please provide a valid email address."),
			email: typeof raw === "string" ? raw : "",
		};
	}

	const { email } = input.output;

	const result = await api.subscribeToNewsletter.request({ body: { email } });

	if (result.isErr()) {
		const error = result.error;

		/** The api answers a duplicate subscription with a conflict. */
		if (error._tag === "HttpError" && error.response.status === 409) {
			return { status: "error", message: t("This email address is already subscribed."), email };
		}

		return {
			status: "error",
			message: t("Subscribing failed. Please try again later."),
			email,
		};
	}

	return { status: "success", message: t("Thank you! Please check your inbox to confirm your subscription.") };
}
