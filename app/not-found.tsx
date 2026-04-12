import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-9xl font-black text-primary tracking-tighter">404</h1>
      <h2 className="text-3xl font-bold mt-4">Page Not Found</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        The movie you&apos;re looking for might have been deleted, renamed, or is temporarily unavailable.
      </p>
      <Link href="/" className="mt-8">
        <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold px-8 rounded-full">
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
