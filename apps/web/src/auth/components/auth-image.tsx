"use client";
import img from "@/assets/auth-bg.jpg";
import Image from "next/image";
import { useState } from "react";

export default function AuthLayoutImage() {
	const [loading, setLoading] = useState(true);
	return (
		<div
			className={`fixed left-0  top-0 brightness-[20%] lg:brightness-90 lg:relative bg-cover  lg:flex justify-center items-center  bg-center w-full md:flex-1 overflow-hidden  brightness-70   h-screen   -z-10  ${
				loading && "bg-gradient-to-r from-violet-400 to-primary "
			} `}
		>
			<Image
				src={img}
				width={700}
				height={800}
				alt="auth-image"
				onLoad={() => setLoading(false)}
				quality={75}
				className={`w-full  h-full object-cover ${loading && "blur"}`}
			/>
			<div className="bg-neutral-700/20 absolute top-0 h-screen w-full" />
		</div>
	);
}
