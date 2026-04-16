import { Skeleton } from '@/components/ui/skeleton';

export default function MoviesLoading() {
  return (
    <div className="container mx-auto px-4 pt-32 pb-20 max-w-7xl">
      <div className="space-y-4 mb-12">
        <Skeleton className="h-12 w-64 bg-secondary/50" />
        <Skeleton className="h-6 w-96 bg-secondary/50" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex flex-col space-y-4">
            <Skeleton className="h-[400px] w-full rounded-xl bg-secondary/50" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-3/4 bg-secondary/50" />
              <Skeleton className="h-4 w-1/2 bg-secondary/50" />
            </div>
            <Skeleton className="h-10 w-full rounded-md bg-secondary/50" />
          </div>
        ))}
      </div>
    </div>
  );
}
