import { logoUrl } from "@/constants";
import Link from "next/link";

const VerifyRequest = async ({
	searchParams,
}: {
	searchParams: Promise<{ email: string }>;
}) => {
	const { email } = await searchParams;

	return (
		<div className=" flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<img
						className="mx-auto h-12 w-auto "
						src={logoUrl}
						alt="Your Company"
					/>
					<h2 className="mt-6 text-center text-3xl font-extrabold ">
						Check your email
					</h2>
					<p className="mt-2 text-center text-sm ">
						We have sent a sign-in link to your email address.{" "}
						{email && (
							<span className="px-3 text-sky-600 font-semibold text-lg">
								{email}
							</span>
						)}
					</p>
				</div>
				<div className="mt-8 space-y-6">
					<div className="rounded-md shadow-sm -space-y-px">
						<div>
							<Link
								href={"/auth/signin"}
								className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Back to Sign In
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VerifyRequest;
