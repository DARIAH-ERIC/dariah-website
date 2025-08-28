export const hitsPerPage = 50;

export function filters() {
	return `(kind:[pages, events, news, projects]) || kind:![pages, events, news, projects]`;
}

export function resourcesFilters() {
	return `kind:![pages, events, news, projects]`;
}
