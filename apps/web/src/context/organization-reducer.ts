import type { Organization } from "@repo/db/schema";

type OrgState = {
	org: Organization | null; // Null when no organization is set
};

export type OrgAction =
	| { type: "SET_ORG"; payload: Organization }
	| { type: "UPDATE_ORG"; payload: Partial<Organization> }
	| { type: "CLEAR_ORG" }
	| { type: null };

export const orgReducer = (state: OrgState, action: OrgAction): OrgState => {
	switch (action.type) {
		case "SET_ORG":
			return { org: action.payload };
		case "UPDATE_ORG":
			return { org: { ...state.org, ...action.payload } as Organization };
		case "CLEAR_ORG":
			return { org: null };
		default:
			throw new Error(`Unknown action type: ${action.type}`);
	}
};
