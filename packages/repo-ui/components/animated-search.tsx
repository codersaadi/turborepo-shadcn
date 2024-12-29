"use client";

import { Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "../hooks/use-mobile";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";

interface AnimatedSearchProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	className?: string;
	iconClassName?: string;
	containerClassName?: string;
	placeholder?: string;
	expanded?: boolean;
	defaultExpanded?: boolean;
	onSearch?: (value: string) => void;
	iconPosition?: "left" | "right";
	variant?: "sm" | "md" | "lg";
	renderResults?: (value: string) => React.ReactNode;
}

const sizeClasses = {
	sm: {
		container: "h-8",
		input: "text-sm h-8",
		icon: "w-4 h-4",
		expandedWidth: "w-48",
	},
	md: {
		container: "h-10",
		input: "text-base h-10",
		icon: "w-5 h-5",
		expandedWidth: "w-64",
	},
	lg: {
		container: "h-12",
		input: "text-lg h-12",
		icon: "w-6 h-6",
		expandedWidth: "w-72",
	},
};

export function AnimatedSearch({
	className,
	iconClassName,
	containerClassName,
	placeholder = "Search...",
	expanded: controlledExpanded,
	defaultExpanded = false,
	onSearch,
	iconPosition = "left",
	variant = "md",
	renderResults,
	...props
}: AnimatedSearchProps) {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);
	const [isFocused, setIsFocused] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [isFullScreen, setIsFullScreen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const expanded = controlledExpanded ?? isExpanded;
	const sizeConfig = sizeClasses[variant];
	const isMobile = useIsMobile();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		onSearch?.(searchValue);
	};

	const toggleExpand = () => {
		if (!controlledExpanded) {
			setIsExpanded(!isExpanded);
		}
		if (isMobile) {
			setIsFullScreen(true);
		}
	};

	const closeFullScreen = () => {
		setIsFullScreen(false);
		setSearchValue("");
		setIsExpanded(false);
	};

	useEffect(() => {
		if (isFullScreen && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isFullScreen]);

	const renderSearchInput = () => (
		<div
			className={cn(
				"relative overflow-hidden rounded-full",
				"transition-all duration-300 ease-in-out",
				"bg-background border border-input hover:border-accent",
				"flex items-center",
				sizeConfig.container,
				expanded ? sizeConfig.expandedWidth : "w-8",
				isFocused && "ring-1 ring-ring",
				expanded ? "px-3 gap-2" : iconPosition === "left",
				// ? 'pl-3 pr-2'
				// : 'pr-3 pl-2',
				!expanded && "justify-center",
				className
			)}
		>
			{iconPosition === "left" && (
				<MagnifyingGlassIcon
					className={cn(
						"cursor-pointer",
						sizeConfig.icon,
						"text-muted-foreground transition-colors hover:text-foreground",
						iconClassName
					)}
					onClick={toggleExpand}
				/>
			)}

			<input
				ref={inputRef}
				type="search"
				name="search"
				placeholder={expanded ? placeholder : ""}
				className={cn(
					"w-full bg-transparent outline-none placeholder:text-muted-foreground",
					"transition-all duration-300 ease-in-out",
					expanded ? "opacity-100" : "opacity-0 w-0",
					sizeConfig.input
				)}
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				{...props}
			/>

			{iconPosition === "right" && (
				<MagnifyingGlassIcon
					className={cn(
						"cursor-pointer",
						sizeConfig.icon,
						"text-muted-foreground transition-colors hover:text-foreground",
						iconClassName
					)}
					onClick={toggleExpand}
				/>
			)}
		</div>
	);

	if (isMobile && isFullScreen) {
		return (
			<div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
				<div className="container flex flex-col h-full p-4">
					<div className="flex items-center justify-between mb-4">
						{renderSearchInput()}
						<Button variant="ghost" size="icon" onClick={closeFullScreen}>
							<Cross2Icon className="h-4 w-4" />
						</Button>
					</div>
					<div className="flex-grow overflow-auto">
						{renderResults?.(searchValue)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={containerClassName}>
			<form
				onSubmit={handleSubmit}
				className="relative inline-flex items-center"
			>
				{renderSearchInput()}
				{expanded && renderResults && (
					<div className="absolute top-full left-0 w-full mt-2 bg-background border border-input rounded-md shadow-lg">
						{renderResults(searchValue)}
					</div>
				)}
			</form>
		</div>
	);
}
