import type { Organization } from "@repo/db/schema";
// OrgContext.tsx
import { createContext, useContext, useReducer } from "react";
import { type OrgAction, orgReducer } from "./organization-reducer";

type OrgState = {
	org: Organization | null;
};

type OrgContextType = {
	state: OrgState;
	dispatch: React.Dispatch<OrgAction>;
};

const OrgContext = createContext<OrgContextType | undefined>(undefined);

const OrgProvider = ({
	children,
	org = null,
}: { children: React.ReactNode; org: OrgState["org"] }) => {
	const initialState: OrgState = { org };
	const [state, dispatch] = useReducer(orgReducer, initialState);

	return (
		<OrgContext.Provider value={{ state, dispatch }}>
			{children}
		</OrgContext.Provider>
	);
};

export const useOrgContext = () => {
	const context = useContext(OrgContext);
	if (!context) {
		throw new Error("useOrgContext must be used within an OrgProvider");
	}
	return context;
};

export { OrgProvider };
