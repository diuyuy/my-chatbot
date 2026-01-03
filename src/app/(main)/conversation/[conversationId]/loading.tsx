import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPage() {
  return (
    <div className="w-full mx-auto h-screen px-2 flex flex-col">
      <div className="flex-1 w-72 md:w-3xl mx-auto overflow-y-auto no-scrollbar p-6 space-y-8">
        {/* User message skeleton */}
        <div className="flex justify-end">
          <Skeleton className="max-w-md h-20 rounded-md" />
        </div>

        {/* AI message skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>

        {/* User message skeleton */}
        <div className="flex justify-end">
          <Skeleton className="max-w-md h-16 rounded-md" />
        </div>

        {/* AI message skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>

      {/* Input area skeleton */}
      <div className="p-4">
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </div>
  );
}
