import { Skeleton } from "@/components/ui/skeleton";

const SkeletonHomeCard = () => {
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Skeleton className="rounded-full w-12 h-12" />
          <div className="flex flex-col">
            <Skeleton className="w-24" />
            <Skeleton className="w-36" />
          </div>
        </div>
        <Skeleton className="w-5 h-5" />
      </div>
      <div className="small-medium lg:base-medium py-5">
        <Skeleton className="h-12" />
        <ul className="flex gap-1 mt-2">
          <Skeleton className="w-12" />
          <Skeleton className="w-12" />
          <Skeleton className="w-12" />
        </ul>
      </div>
      <Skeleton className="h-48" />
    </div>
  );
};

export default SkeletonHomeCard;
