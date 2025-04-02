import { BRANDING_LOGO_URL, BRANDING_NAME } from "@repo/ui/const/branding";
import { cn } from "@repo/ui/lib/utils";
import Image from "next/image";
import { type ReactNode, forwardRef, memo } from "react";

// Types
type IconType = React.ForwardRefExoticComponent<
	React.SVGProps<SVGSVGElement> & { size?: string | number }
>;
type LogoProps = {
	extra?: string;
	size?: number;
	className?: string;
	style?: React.CSSProperties;
	type?: "3d" | "flat" | "mono" | "text" | "combine";
};

const CustomTextLogo = memo<{
	size: number;
	style?: React.CSSProperties;
	className?: string;
}>(({ size, style, className }) => {
	return (
		<div
			className={cn("font-bold select-none", className)}
			style={{
				height: size,
				fontSize: size / 1.5,
				...style,
			}}
		>
			{BRANDING_NAME}
		</div>
	);
});
CustomTextLogo.displayName = "CustomTextLogo";

const CustomImageLogo = memo<{
	size: number;
	style?: React.CSSProperties;
	className?: string;
}>(({ size, style, className }) => {
	return (
		<Image
			alt={BRANDING_NAME}
			height={size}
			width={size}
			src={BRANDING_LOGO_URL}
			unoptimized={true}
			className={className}
			style={style}
		/>
	);
});
CustomImageLogo.displayName = "CustomImageLogo";

const Divider: IconType = forwardRef(
	({ size = "1em", style, ...rest }, ref) => (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			fill="none"
			height={size}
			ref={ref}
			shapeRendering="geometricPrecision"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="flex-none leading-none"
			style={style}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		>
			<path d="M16.88 3.549L7.12 20.451" />
		</svg>
	)
);
Divider.displayName = "Divider";

const CustomLogo = memo<LogoProps>(
	({ extra, size = 32, className, style, type, ...rest }) => {
		let logoComponent: ReactNode;

		switch (type) {
			case "3d":
			case "flat": {
				logoComponent = <CustomImageLogo size={size} style={style} />;
				break;
			}
			case "mono": {
				logoComponent = (
					<CustomImageLogo
						size={size}
						style={{ filter: "grayscale(100%)", ...style }}
					/>
				);
				break;
			}
			case "text": {
				logoComponent = <CustomTextLogo size={size} style={style} />;
				break;
			}
			case "combine": {
				logoComponent = (
					<>
						<CustomImageLogo size={size} />
						<CustomTextLogo
							size={size}
							style={{ marginLeft: Math.round(size / 4) }}
						/>
					</>
				);

				if (!extra)
					logoComponent = (
						<div className="flex items-center flex-none" {...rest}>
							{logoComponent}
						</div>
					);

				break;
			}
			default: {
				logoComponent = <CustomImageLogo size={size} style={style} />;
				break;
			}
		}

		if (!extra) return logoComponent;

		const extraSize = Math.round((size / 3) * 1.9);

		return (
			<div className={cn("flex items-center flex-none", className)} {...rest}>
				{logoComponent}
				<Divider size={extraSize} style={{ color: "var(--color-fill)" }} />
				<div
					className="font-light whitespace-nowrap"
					style={{ fontSize: extraSize }}
				>
					{extra}
				</div>
			</div>
		);
	}
);

CustomLogo.displayName = "CustomLogo";

export default CustomLogo;
