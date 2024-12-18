import env from '@repo/env';
import type { ReactNode } from 'react';
import React from 'react';
import { GoogleAnalytics } from './google';
import { PostHogProvider } from './posthog/client';
import { VercelAnalytics } from './vercel';

type AnalyticsProviderProps = {
  readonly children: ReactNode;
  options?: {
    vercel?: boolean,
    posthog?: boolean
  }
};

export const AnalyticsProvider = ({ children, options }: AnalyticsProviderProps) => {

  const Component = options?.posthog ? PostHogProvider : React.Fragment
  return (
    <Component>
      {children}
      {options?.vercel && <VercelAnalytics />}
      {env.NODE_ENV !== 'development' && env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <GoogleAnalytics gaId={env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      )}
    </Component>
  );
}
