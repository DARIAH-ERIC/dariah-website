"use client";

import { useExtracted as useTranslations } from "next-intl";
import { type ReactNode, useActionState, useId } from "react";

import {
	type ContactField,
	type ContactFormState,
	sendMessage,
} from "#/app/(app)/(default)/helpdesk/_actions/send-message.ts";
import {
	type ContactTopic,
	contactTopics,
	defaultContactTopic,
} from "#/app/(app)/(default)/helpdesk/_lib/contact-topics.ts";
import { Select, type SelectOption } from "#/components/ui/select.tsx";

const initialState: ContactFormState = { status: "idle" };

const fieldClassName =
	"block border-be-2 border-stroke-weak bg-background-field px-4 py-2.5 shadow-[0_0_4px_0_rgb(0_0_0/0.08)] inline-full focus-visible-outline hover:border-stroke-accent aria-invalid:border-stroke-error";

export function ContactForm(): ReactNode {
	const t = useTranslations();

	const [state, action, isPending] = useActionState(sendMessage, initialState);

	const topicLabels: Record<ContactTopic, string> = {
		"education-and-training": t("Education and training"),
		general: t("General"),
		"join-dariah": t("Join DARIAH"),
		"open-science": t("Open Science"),
		projects: t("Projects"),
		"technical-issues": t("Technical issues"),
		"tools-and-services": t("Tools and services"),
		"working-groups": t("Working groups"),
	};

	const topicOptions: Array<SelectOption<ContactTopic>> = contactTopics.map((topic) => {
		return { id: topic, label: topicLabels[topic] };
	});

	const id = useId();
	const errorId = `${id}-error`;

	const isSuccess = state.status === "success";
	const fieldErrors = state.status === "error" ? state.fieldErrors : {};
	const values = state.status === "error" ? state.values : undefined;

	function getFieldProps(name: ContactField) {
		const error = fieldErrors[name];

		return {
			"aria-describedby": error != null ? `${id}-${name}-error` : undefined,
			"aria-invalid": error != null ? true : undefined,
			className: fieldClassName,
			defaultValue: values?.[name],
			id: `${id}-${name}`,
			name,
			required: true,
		};
	}

	function renderFieldError(name: ContactField): ReactNode {
		const error = fieldErrors[name];

		if (error == null) {
			return null;
		}

		return (
			<p className="mbs-2 text-small text-text-error" id={`${id}-${name}-error`}>
				{error}
			</p>
		);
	}

	/**
	 * Both live regions stay mounted, because a screen reader only announces content changes inside an existing live
	 * region, never a region which is rendered together with its content. The errors of single fields are not live: the
	 * summary in the alert region announces that there are some, and each is read with its field.
	 */
	return (
		<form action={action} className="flex flex-col gap-y-6">
			{!isSuccess ? (
				<div className="flex flex-col gap-y-6">
					<div>
						<label className="block pbe-2 font-bold" htmlFor={`${id}-name`}>
							{t("Name")}
						</label>
						<input {...getFieldProps("name")} autoComplete="name" maxLength={200} type="text" />
						{renderFieldError("name")}
					</div>
					<div>
						<label className="block pbe-2 font-bold" htmlFor={`${id}-email`}>
							{t("Email address")}
						</label>
						<input {...getFieldProps("email")} autoComplete="email" maxLength={254} type="email" />
						{renderFieldError("email")}
					</div>
					{/* Without javascript only the default topic can be submitted, which the office sorts by hand. */}
					<Select
						defaultValue={values?.topic ?? defaultContactTopic}
						label={t("Topic")}
						name="topic"
						options={topicOptions}
						variant="field"
					/>
					<div>
						<label className="block pbe-2 font-bold" htmlFor={`${id}-subject`}>
							{t("Subject")}
						</label>
						<input {...getFieldProps("subject")} maxLength={200} type="text" />
						{renderFieldError("subject")}
					</div>
					<div>
						<label className="block pbe-2 font-bold" htmlFor={`${id}-message`}>
							{t("Message")}
						</label>
						<textarea {...getFieldProps("message")} maxLength={10_000} rows={8} />
						{renderFieldError("message")}
					</div>
					{/* A trap for bots, which fill in every input: hidden from people, and from assistive technology. */}
					<div aria-hidden={true} className="hidden">
						<label htmlFor={`${id}-website`}>{t("Website")}</label>
						<input autoComplete="off" id={`${id}-website`} name="website" tabIndex={-1} type="text" />
					</div>
					<div>
						<button
							className="border-2 border-stroke-accent bg-background-accent-strong px-6 py-3 font-heading font-bold text-text-inverse focus-visible-outline [text-box:trim-both_cap_alphabetic] enabled:hover:bg-background-base enabled:hover:text-text-accent disabled:opacity-70"
							disabled={isPending}
							type="submit"
						>
							{isPending ? t("Sending…") : t("Send message")}
						</button>
					</div>
				</div>
			) : null}
			<p className="text-small text-text-error empty:hidden" id={errorId} role="alert">
				{state.status === "error" ? state.message : null}
			</p>
			<p className="empty:hidden" role="status">
				{isSuccess ? state.message : null}
			</p>
		</form>
	);
}
