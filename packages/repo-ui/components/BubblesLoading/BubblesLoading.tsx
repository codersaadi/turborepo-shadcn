import { forwardRef, memo } from 'react';
import { cn } from 'repo-ui/lib/utils';

type IconType = React.ForwardRefExoticComponent<
  React.SVGProps<SVGSVGElement> & { size?: string | number }
>;

// Keyframes need to be added to your global CSS or Tailwind config
// Add this to your globals.css or equivalent:
/*
@keyframes bubble {
  0% {
    opacity: 1;
  }
  25% {
    opacity: 0.5;
  }
  75% {
    opacity: 0.25;
  }
  100% {
    opacity: 1;
  }
}
*/

const BubblesLoadingIcon: IconType = forwardRef(
  ({ size = '1em', style, className, ...rest }, ref) => {
    return (
      // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
      <svg
        className={cn(className)}
        fill="currentColor"
        fillRule="evenodd"
        height={size}
        ref={ref}
        style={{ flex: 'none', lineHeight: 1, ...style }}
        viewBox="0 0 60 32"
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
      >
        <style>{`
          circle {
            animation: bubble 1.5s cubic-bezier(0.05, 0.2, 0.35, 1) infinite;
          }
          circle:nth-child(2) {
            animation-delay: 0.3s;
          }
          circle:nth-child(3) {
            animation-delay: 0.6s;
          }
        `}</style>
        <circle cx="7" cy="16" r="6" />
        <circle cx="30" cy="16" r="6" />
        <circle cx="53" cy="16" r="6" />
      </svg>
    );
  },
);
BubblesLoadingIcon.displayName = 'BubblesLoadingIcon';

const BubblesLoading = memo(() => {
  return (
    <div className="flex items-center justify-center h-6 w-8 text-muted-foreground">
      <BubblesLoadingIcon size={14} />
    </div>
  );
});
BubblesLoading.displayName = 'BubblesLoading';

export default BubblesLoading;