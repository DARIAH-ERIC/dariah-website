import type { Person } from "@/lib/data/api-client";

type PersonPosition = NonNullable<Person["positions"]>;
type PersonPositionItem = PersonPosition[number];

export const filterPosition = (
	position: Person["positions"],
	role?: PersonPositionItem["role"],
	label?: PersonPositionItem["entity"]["label"],
	type?: PersonPositionItem["entity"]["type"],
): PersonPosition => {
	if (!position) return [];

	return position.filter((pos) => {
		return (
			(role != null ? pos.role === role : true) &&
			(label != null ? pos.entity.label?.toLowerCase() === label.toLowerCase() : true) &&
			(type != null ? pos.entity.type === type : true)
		);
	});
};

export const sortUserPosition = (position: Person["positions"]): Person["positions"] => {
	if (!position) return null;

	const sortedPosition: PersonPosition = [];

	sortedPosition.push(...filterPosition(position, "national_coordinator"));
	sortedPosition.push(...filterPosition(position, "national_coordinator_deputy"));
	sortedPosition.push(...filterPosition(position, "national_coordination_staff"));

	sortedPosition.push(...filterPosition(position, "national_representative"));
	sortedPosition.push(...filterPosition(position, "national_representative_deputy"));

	sortedPosition.push(...filterPosition(position, "is_chair_of", "General assembly"));
	sortedPosition.push(...filterPosition(position, "is_vice_chair_of", "General assembly"));

	sortedPosition.push(...filterPosition(position, "is_member_of", "Board of directors"));
	sortedPosition.push(...filterPosition(position, "is_chair_of", "Board of directors"));

	sortedPosition.push(
		...filterPosition(position, "is_chair_of", "National coordinators committee"),
	);
	sortedPosition.push(
		...filterPosition(position, "is_vice_chair_of", "National coordinators committee"),
	);

	sortedPosition.push(...filterPosition(position, "is_chair_of", "Senior management team"));
	sortedPosition.push(...filterPosition(position, "is_vice_chair_of", "Senior management team"));

	sortedPosition.push(...filterPosition(position, "is_chair_of", "DARIAH coordination office"));
	sortedPosition.push(
		...filterPosition(position, "is_vice_chair_of", "DARIAH coordination office"),
	);

	sortedPosition.push(...filterPosition(position, "is_chair_of", "Joint research committee"));
	sortedPosition.push(...filterPosition(position, "is_vice_chair_of", "Joint research committee"));

	sortedPosition.push(...filterPosition(position, "is_chair_of", "Scientific advisory board"));
	sortedPosition.push(...filterPosition(position, "is_vice_chair_of", "Scientific advisory board"));

	sortedPosition.push(...filterPosition(position, "is_member_of", "DARIAH coordination office"));

	sortedPosition.push(...filterPosition(position, "is_chair_of", undefined, "working_group"));
	sortedPosition.push(...filterPosition(position, "is_vice_chair_of", undefined, "working_group"));

	sortedPosition.push(...filterPosition(position, "is_affiliated_with"));

	return sortedPosition;
};
