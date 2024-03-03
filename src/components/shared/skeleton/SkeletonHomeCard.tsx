import { Skeleton } from "@/components/ui/skeleton";

const SkeletonHomeCard = () => {
  return (
    <div className="bg-dark-2/30 rounded-3xl border border-dark-4 p-5 lg:p-7 w-full max-w-screen-sm">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Skeleton className="rounded-full w-12 h-12" />
          <div className="flex flex-col">
            <Skeleton className="w-24 h-24" />
            <Skeleton className="w-36 h-36" />
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
