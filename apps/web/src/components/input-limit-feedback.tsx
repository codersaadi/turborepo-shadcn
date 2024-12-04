import type React from "react";

interface InputLimitFeedbackProps {
	maxLength: number;
	minLength?: number; // optional, since minLength might not be needed
	value: string;
	showWords?: boolean; // optional, controls if word count is displayed
}

export const InputLimitFeedback: React.FC<InputLimitFeedbackProps> = ({
	maxLength,
	minLength = 0,
	value,
	showWords = false,
}) => {
	const charCount = value.length;
	const isTooLong = charCount > maxLength;
	const isWarning = charCount < maxLength && charCount >= minLength;
	const isSuccess = charCount >= minLength && charCount <= maxLength;

	const feedbackClass = isTooLong
		? "text-red-600 bg-destructive/15"
		: isWarning
			? "text-yellow-600 bg-yellow-600/15"
			: isSuccess
				? "text-green-600"
				: "";

	return (
		<div className={`rounded-md ${feedbackClass}`}>
			{showWords ? (
				<span>{value.split(/\s+/).filter(Boolean).length} words</span>
			) : (
				<span>
					{charCount}/{maxLength}
				</span>
			)}
		</div>
	);
};
