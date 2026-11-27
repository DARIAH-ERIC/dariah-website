"use server";

import { getExtracted as getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import * as v from "valibot";

import {
	type ContactTopic,
	contactTopics,
	defaultContactTopic,
} from "#/app/(app)/(default)/helpdesk/_lib/contact-topics.ts";
import * as api from "#/lib/api/endpoints.ts";

export type ContactField = "email" | "message" | "name" | "subject";

export type ContactFormValues = Record<ContactField, string> & { topic: ContactTopic };

export type ContactFormState =
	| { status: "idle" }
	| {
			status: "error";
			message: string;
			fieldErrors: Partial<Record<ContactField, string>>;
			values: ContactFormValues;
	  }
	| { status: "success"; message: string };

const ContactTopicSchema = v.picklist(contactTopics);

/** The same limits the api enforces, so that a visitor learns about them here, next to the field. */
const ContactFormSchema = v.object({
	name: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.maxLength(200)),
	email: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.email(), v.maxLength(254)),
	topic: ContactTopicSchema,
	subject: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.maxLength(200)),
	message: v.pipe(v.string(), v.trim(), v.nonEmpty(), v.maxLength(10_000)),
});

function getString(formData: FormData, name: string): string {
	const value = formData.get(name);
	return typeof value === "string" ? value : "";
}

/**
 * The address of the visitor who submitted the form, which the api counts its rate limit against - every request to the
 * api comes from this server, so without it, all visitors would share one limit. Vercel sets `x-real-ip`, and puts the
 * client first in `x-forwarded-for`.
 */
async function getClientIp(): Promise<string | undefined> {
	const requestHeaders = await headers();

	const realIp = requestHeaders.get("x-real-ip")?.trim();
	if (realIp != null && realIp !== "") {
		return realIp;
	}

	const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
	if (forwardedFor != null && forwardedFor !== "") {
		return forwardedFor;
	}

	return undefined;
}

export async function sendMessage(_state: ContactFormState, formData: FormData): Promise<ContactFormState> {
	const t = await getTranslations();

	/**
	 * A field which is hidden from people, and which only a bot filling in every input would fill in. The bot is told it
	 * succeeded, so that it has no reason to try again differently.
	 */
	if (getString(formData, "website") !== "") {
		return { status: "success", message: t("Thank you! Your message has been sent.") };
	}

	const topic = getString(formData, "topic");

	const values: ContactFormValues = {
		name: getString(formData, "name"),
		email: getString(formData, "email"),
		topic: v.is(ContactTopicSchema, topic) ? topic : defaultContactTopic,
		subject: getString(formData, "subject"),
		message: getString(formData, "message"),
	};

	const input = v.safeParse(ContactFormSchema, values);

	if (!input.success) {
		const issues = v.flatten<typeof ContactFormSchema>(input.issues).nested ?? {};

		const fieldErrors: Partial<Record<ContactField, string>> = {};

		if (issues.name != null) {
			fieldErrors.name =
				values.name.trim() === ""
					? t("Please provide your name.")
					: t("Your name must be at most {count} characters long.", { count: "200" });
		}

		if (issues.email != null) {
			fieldErrors.email = t("Please provide a valid email address.");
		}

		if (issues.subject != null) {
			fieldErrors.subject =
				values.subject.trim() === ""
					? t("Please provide a subject.")
					: t("The subject must be at most {count} characters long.", { count: "200" });
		}

		if (issues.message != null) {
			fieldErrors.message =
				values.message.trim() === ""
					? t("Please enter a message.")
					: t("The message must be at most {count} characters long.", { count: "10,000" });
		}

		return { status: "error", message: t("Please correct the highlighted fields."), fieldErrors, values };
	}

	const clientIp = await getClientIp();

	const result = await api.sendContactMessage.request({
		body: input.output,
		headers: clientIp != null ? { "x-client-ip": clientIp } : undefined,
	});

	if (result.isErr()) {
		const error = result.error;

		if (error._tag === "HttpError" && error.response.status === 429) {
			return {
				status: "error",
				message: t("You have sent too many messages. Please try again later."),
				fieldErrors: {},
				values,
			};
		}

		return {
			status: "error",
			message: t("Sending your message failed. Please try again later, or write to {email}.", {
				email: "info@dariah.eu",
			}),
			fieldErrors: {},
			values,
		};
	}

	return { status: "success", message: t("Thank you! Your message has been sent.") };
}
