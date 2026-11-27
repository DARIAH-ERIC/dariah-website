import type * as api from "#/lib/api/endpoints.ts";

/** The topics the api accepts, by which the dariah office sorts incoming messages. */
export type ContactTopic = api.sendContactMessage.Body["topic"];

/** In the order of the old website's helpdesk form, but with its default first. */
export const contactTopics = [
	"general",
	"education-and-training",
	"join-dariah",
	"open-science",
	"projects",
	"technical-issues",
	"tools-and-services",
	"working-groups",
] as const satisfies ReadonlyArray<ContactTopic>;

export const defaultContactTopic: ContactTopic = "general";
