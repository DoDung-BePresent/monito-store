import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, idx) => (
          <Skeleton key={idx} className="h-32 rounded-lg" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Skeleton className="h-64 lg:col-span-2 rounded-lg" />
        <Skeleton className="h-64 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, idx) => (
          <Skeleton key={idx} className="h-28 rounded-lg" />
        ))}
      </div>
    </div>
  );
};
