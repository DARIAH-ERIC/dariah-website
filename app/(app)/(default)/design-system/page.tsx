import type { Metadata } from "next";
import type { ReactNode } from "react";

export function generateMetadata(): Metadata {
	const metadata: Metadata = {
		title: "Design system",
	};

	return metadata;
}

export default function DesignSystemPage(): ReactNode {
	return (
		<div className="mx-auto w-full max-w-(--breakpoint-2xl) px-6">
			<h1>{"Design system"}</h1>
		</div>
	);
}
