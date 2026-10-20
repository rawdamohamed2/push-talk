import { Skeleton } from "@/components/ui/skeleton";

const ChannelRoomSkeleton = () => {
  return (
    <div className="flex h-full min-h-[calc(100vh-80px)] flex-col">
      <header className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-11 rounded-lg" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        <Skeleton className="size-9 rounded-md" />
      </header>

      <div className="flex flex-1 flex-col justify-end gap-6 overflow-hidden p-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              index % 2 === 0 ? "flex-row" : "flex-row-reverse"
            }`}
          >
            <Skeleton className="size-10 shrink-0 rounded-full" />

            <div
              className={`flex max-w-[75%] flex-col gap-2 ${
                index % 2 === 0 ? "items-start" : "items-end"
              }`}
            >
              <Skeleton className="h-3 w-24" />

              <Skeleton
                className={`h-12 rounded-xl ${
                  index % 2 === 0 ? "w-64" : "w-44"
                }`}
              />

              {index === 1 && <Skeleton className="h-10 w-48 rounded-lg" />}
            </div>
          </div>
        ))}
      </div>

      <footer className="flex items-center justify-center gap-4 border-t p-4">
        <Skeleton className="size-14 rounded-full" />
      </footer>
    </div>
  );
};

export default ChannelRoomSkeleton;
