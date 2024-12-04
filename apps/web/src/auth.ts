import { nextauth } from "./auth/auth";
export const {
	handlers,
	auth,
	signIn,
	signOut,
	unstable_update: updateSessionTrigger,
} = nextauth;
