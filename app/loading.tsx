import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      {/* Hero Skeleton */}
      <div className="relative h-[85vh] w-full bg-secondary/20 animate-pulse">
        <div className="absolute inset-0 flex flex-col justify-end pb-20 container mx-auto px-4 space-y-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-16 md:h-24 w-full max-w-2xl" />
          <Skeleton className="h-20 w-full max-w-xl" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </div>
      </div>

      {/* Row Skeletons */}
      <div className="container mx-auto px-4 space-y-12 pb-20">
        {[1, 2].map((row) => (
          <div key={row} className="space-y-6">
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
