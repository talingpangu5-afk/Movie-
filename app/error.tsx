'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h2 className="text-3xl font-bold">Something went wrong!</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        An unexpected error occurred while loading this page.
      </p>
      <Button
        onClick={() => reset()}
        size="lg"
        className="mt-8 bg-primary hover:bg-primary/90 text-white font-bold px-8 rounded-full"
      >
        <RefreshCcw className="w-5 h-5 mr-2" />
        Try again
      </Button>
    </div>
  );
}
