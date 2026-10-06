"use client";

import { useExtracted as useTranslations } from "next-intl";
import { Fragment, type ReactNode, useActionState, useId } from "react";

import { type SubscribeFormState, subscribe } from "#/app/(app)/(default)/newsletters/_actions/subscribe.ts";

const initialState: SubscribeFormState = { status: "idle" };

export function SubscribeForm(): ReactNode {
	const t = useTranslations();

	const [state, action, isPending] = useActionState(subscribe, initialState);

	const emailId = useId();
	const errorId = useId();

	const hasError = state.status === "error";
	const isSuccess = state.status === "success";

	/**
	 * Both live regions stay mounted, because a screen reader only announces content changes inside an existing live
	 * region, never a region which is rendered together with its content.
	 */
	return (
		<form action={action}>
			{!isSuccess ? (
				<Fragment>
					{/* Padding, not a margin on the row: hovering the label hovers the input, so no gap may sit between them. */}
					<label className="block font-medium pbe-2" htmlFor={emailId}>
						{t("Email address")}
					</label>
					<div className="flex min-block-15 shadow-[0_0_4px_0_rgb(0_0_0/0.08)]">
						<div className="flex min-inline-0 flex-1 focus-within-outline-inset">
							<input
								aria-describedby={hasError ? errorId : undefined}
								aria-invalid={hasError ? true : undefined}
								autoComplete="email"
								className="min-inline-0 flex-1 border-be-2 border-stroke-weak bg-background-field px-4 py-2.5 outline-none hover:border-stroke-accent aria-invalid:border-stroke-error"
								defaultValue={hasError ? state.email : undefined}
								id={emailId}
								name="email"
								required={true}
								type="email"
							/>
						</div>
						<button
							className="relative border-2 border-stroke-accent bg-background-accent-strong px-6 font-heading font-bold text-text-inverse [text-box:trim-both_cap_alphabetic] enabled:hover:bg-background-base enabled:hover:text-text-accent disabled:opacity-70 focus-visible-outline"
							disabled={isPending}
							type="submit"
						>
							{isPending ? t("Subscribing…") : t("Subscribe")}
						</button>
					</div>
				</Fragment>
			) : null}
			<p className="text-small text-text-error not-empty:mbs-2" id={errorId} role="alert">
				{hasError ? state.message : null}
			</p>
			<p className="text-small not-empty:mbs-2" role="status">
				{isSuccess ? state.message : null}
			</p>
		</form>
	);
}
