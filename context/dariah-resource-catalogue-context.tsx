"use client";

import React, { createContext, type ReactNode, use, useMemo, useState } from "react";

import type { WorkingGroupList } from "@/lib/data/api-client";

interface DariahResourceCatalogueContextType {
	workingGroups: WorkingGroupList["data"];
	setWorkingGroups: React.Dispatch<React.SetStateAction<WorkingGroupList["data"]>>;
}

const WorkingGroupsContext = createContext<DariahResourceCatalogueContextType | undefined>(
	undefined,
);

interface ProviderProps {
	children: ReactNode;
	initialWorkingGroups: WorkingGroupList["data"];
}

export function DariahResourceCatalogueContextrovider(props: Readonly<ProviderProps>): ReactNode {
	const { children, initialWorkingGroups } = props;
	const [workingGroups, setWorkingGroups] =
		useState<WorkingGroupList["data"]>(initialWorkingGroups);

	const value: DariahResourceCatalogueContextType = useMemo(() => {
		return { workingGroups, setWorkingGroups };
	}, [workingGroups, setWorkingGroups]);

	return <WorkingGroupsContext value={value}>{children}</WorkingGroupsContext>;
}

export const useDariahResourceCatalogueContext = (): DariahResourceCatalogueContextType => {
	const context = use(WorkingGroupsContext);
	if (context === undefined) {
		throw new Error(
			"useWorkingGroups must be used within a DariahResourceCatalogueContextProvider",
		);
	}
	return context;
};
