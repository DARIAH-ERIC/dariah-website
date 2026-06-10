export interface DocumentOrPolicy {
	id: string;
	title: string;
	summary: string | null;
	url: string | null;
	document: {
		url: string;
	};
	entity: {
		slug: string;
	};
	publishedAt: Date;
	type: "item";
}

export interface DocumentOrPolicyGroup {
	id: string;
	label: string;
	type: "group";
	items: Array<DocumentOrPolicy>;
}
