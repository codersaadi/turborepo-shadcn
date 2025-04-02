'use client';

import Link from 'next/link';
import { memo } from 'react';
import { Button } from '../ui/button';

const NotFound = memo(() => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full relative px-4">
      {/* Large blurred background 404 text */}
      <h1 className="absolute blur-lg text-8xl md:text-9xl font-bold m-0 opacity-10 z-0">
        404
      </h1>

      {/* Emoji */}
      <div className="text-6xl mb-2">👀</div>

      {/* Title */}
      <h2 className="font-bold mt-4 text-center text-2xl">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="leading-7 mb-8 text-center">
        The page you're looking for doesn't exist or has been moved.
        <br />
        <span className="block text-center">Please check the URL or try navigating from the home page.</span>
      </p>

      {/* Back home button */}
      <Link href="/">
        <Button variant="default">Back to Home</Button>
      </Link>
    </div>
  );
});

NotFound.displayName = 'NotFound';

export default NotFound;