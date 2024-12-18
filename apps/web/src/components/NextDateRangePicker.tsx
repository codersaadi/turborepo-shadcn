import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { DateRangePicker } from "repo-ui/components/date-range-picker";

export default function NextDateRangePicker() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const r = useRouter();
	return (
		<DateRangePicker
			pathname={pathname}
			searchParams={searchParams}
			onRouterReplace={(url) => r.replace(url)}
			triggerSize="sm"
			triggerClassName="ml-auto w-56 sm:w-60"
			align="end"
		/>
	);
}
