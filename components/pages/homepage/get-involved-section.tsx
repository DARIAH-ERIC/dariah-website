import React, { type ReactNode } from "react";

import { Button } from "@/components/ui/button/button";

export function GetInvolvedSection(): ReactNode {
	return (
		<section className="bg-[url(/assets/images/background-get-involved.jpg)] bg-cover bg-position-[center_60%] w-full h-201 flex items-end justify-center mb-25.5">
			<div className="bg-event-card-details-bg flex flex-col gap-2 w-284.5 max-w-full items-center py-3.25">
				<p className="text-h3 text-[40px] text-text-link-bg">
					{"DARIAH-EU"}
					<span className="font-normal">{" thrives because of its network. "}</span>
					{"Be part of it!"}
				</p>
				<Button variant="primary">{"Get involved"}</Button>
			</div>
		</section>
	);
}
