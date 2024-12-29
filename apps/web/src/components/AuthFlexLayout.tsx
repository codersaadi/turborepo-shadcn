import type React from "react";
import AuthLayoutImage from "./auth-image";
const AuthFlexLayout = ({
	children,
}: { readonly children: React.ReactNode }) => {
	return (
		<div className="flex items-center justify-center   h-screen  w-full   ">
			<div className="w-full py-2  flex-1 flex relative flex-col   items-center mt-2   md:mt-0 px-2   ">
				<div className="bg-gray-50 dark:bg-gray-800/30 dark:lg:bg-transparent border lg:border-transparent lg:bg-transparent backdrop-blur-lg lg:backdrop-blur-0   p-4  mx-auto rounded-lg h-full w-full relative max-w-md ">
					{children}
				</div>
			</div>
			<AuthLayoutImage />
		</div>
	);
};

export default AuthFlexLayout;
