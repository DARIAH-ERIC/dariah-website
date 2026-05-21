import type { MemberOrPartner, SpotlightArticle, WorkingGroup } from "@/lib/data/api-client";
import type { Person } from "@/types/global";

type AnyPerson =
	| Person
	| MemberOrPartner["contributors"][number]
	| WorkingGroup["chairs"][number]
	| SpotlightArticle["contributors"][number];

export const getGrouppedPersonMembers = (
	members: Array<AnyPerson>,
): Record<string, Array<AnyPerson>> => {
	return members.reduce<Record<string, Array<AnyPerson>>>((acc, person) => {
		acc[person.role] = [...(acc[person.role] ?? []), person];
		return acc;
	}, {});
};
