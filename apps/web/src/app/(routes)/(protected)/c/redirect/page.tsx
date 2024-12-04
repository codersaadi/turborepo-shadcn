import { auth } from "@/auth";
import { getSearchParams } from "@/lib/getParams";
import { redirect } from "next/navigation";
import { z } from "zod";

export default async function page({
	searchParams: searchParamsPromise,
}: {
	searchParams: Promise<{
		page?: string;
	}>;
}) {
	const searchParams = await getSearchParams(
		searchParamsPromise,
		z.object({
			page: z.string().optional(),
		}),
	);
	const session = await auth();
	// resets the organizationId to the present one
	return redirect(
		`/c/${session?.user.activeOrgId}/${searchParams.page || "dashboard"}`,
	);
}
