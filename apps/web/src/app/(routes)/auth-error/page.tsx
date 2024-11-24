"use client";

enum AppError {
	Configuration = "Configuration",
	AccessDenied = "AccessDenied",
	Verification = "Verification",
	Default = "Default",
}

const errorMap = {
	[AppError.Configuration]: (
		<p>
			There was a problem when trying to authenticate. Please contact us if this
			error persists. Unique error code:{" "}
			<code className="rounded bg-yellow-100 p-1 text-xs text-yellow-800">
				Configuration
			</code>
		</p>
	),
	[AppError.AccessDenied]: (
		<p>
			Access was denied. If you believe this is an error, please contact
			support. Unique error code:{" "}
			<code className="rounded bg-red-100 p-1 text-xs text-red-800">
				AccessDenied
			</code>
		</p>
	),
	[AppError.Verification]: (
		<p>
			The verification link has expired or was already used. Please request a
			new one. Unique error code:{" "}
			<code className="rounded bg-blue-100 p-1 text-xs text-blue-800">
				Verification
			</code>
		</p>
	),
	[AppError.Default]: (
		<p>
			An unexpected error occurred. Please try again later or contact support.
			Unique error code:{" "}
			<code className="rounded bg-gray-100 p-1 text-xs text-gray-800">
				Default
			</code>
		</p>
	),
};

export default function AuthErrorPage({
	searchParams,
}: {
	searchParams: unknown & {
		error?: string;
	};
}) {
	if (!searchParams?.error) {
		return null;
	}
	const error = searchParams?.error as AppError;

	return (
		<div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 dark:bg-transparent p-4">
			<div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 text-center border border-gray-200 dark:border-gray-700">
				<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
					Oops! Something went wrong
				</h1>
				<div className="text-gray-700 dark:text-gray-400 mb-6">
					{errorMap[error] || errorMap[AppError.Default]}
				</div>
				<a
					href="/"
					className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors duration-300"
				>
					Go to Homepage
				</a>
			</div>
		</div>
	);
}
