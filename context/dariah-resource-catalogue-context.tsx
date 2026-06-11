"use client";

import React, { createContext, type ReactNode, use, useMemo, useState } from "react";

import type { NationalConsortiaList, WorkingGroupList } from "@/lib/data/api-client";

interface DariahResourceCatalogueContextType {
	workingGroups: WorkingGroupList["data"];
	setWorkingGroups: React.Dispatch<React.SetStateAction<WorkingGroupList["data"]>>;
	nationalConsortia: NationalConsortiaList["data"];
	setNationalConsortia: React.Dispatch<React.SetStateAction<NationalConsortiaList["data"]>>;
}

const DariahResourceCatalogueContext = createContext<
	DariahResourceCatalogueContextType | undefined
>(undefined);

interface ProviderProps {
	children: ReactNode;
	initialWorkingGroups: WorkingGroupList["data"];
	initialNationalConsortia: NationalConsortiaList["data"];
}

export function DariahResourceCatalogueContextrovider(props: Readonly<ProviderProps>): ReactNode {
	const { children, initialWorkingGroups, initialNationalConsortia } = props;
	const [workingGroups, setWorkingGroups] =
		useState<WorkingGroupList["data"]>(initialWorkingGroups);
	const [nationalConsortia, setNationalConsortia] =
		useState<NationalConsortiaList["data"]>(initialNationalConsortia);

	const value: DariahResourceCatalogueContextType = useMemo(() => {
		return { workingGroups, setWorkingGroups, nationalConsortia, setNationalConsortia };
	}, [workingGroups, setWorkingGroups, nationalConsortia, setNationalConsortia]);

	return <DariahResourceCatalogueContext value={value}>{children}</DariahResourceCatalogueContext>;
}

export const useDariahResourceCatalogueContext = (): DariahResourceCatalogueContextType => {
	const context = use(DariahResourceCatalogueContext);
	if (context === undefined) {
		throw new Error(
			"useWorkingGroups must be used within a DariahResourceCatalogueContextProvider",
		);
	}
	return context;
};
