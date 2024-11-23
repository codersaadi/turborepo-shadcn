import {
	CheckCircledIcon,
	ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
interface FormFeedbackProps {
	message?: string;
	type?: "error" | "success";
}
export function FormFeedback({ message, type }: FormFeedbackProps) {
	if (!message) {
		return null;
	}
	const errorClass = `
      bg-destructive/15 text-destructive
      `;
	const successClass = `
      bg-emerald-600/15 text-emerald-600
      `;

	return (
		<div
			className={`${type === "success" ? successClass : errorClass}
           px-2 py-1 text-sm rounded-md flex items-center mt-1  gap-x-3 
          `}
		>
			{type === "success" ? <CheckCircledIcon /> : <ExclamationTriangleIcon />}
			<span>{message}</span>
		</div>
	);
}
