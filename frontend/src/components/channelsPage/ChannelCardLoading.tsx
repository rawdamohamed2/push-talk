import { Card, CardContent } from "@/components/ui/card.tsx";
import { Skeleton } from "@/components/ui/skeleton";

const ChannelCardLoading = () => {
  return (
    <Card
      className={`grid md:grid-cols-3 grid-cols-1 px-3 items-center justify-center`}
    >
      <CardContent className={`w-full md:col-span-2 col-span-1 flex gap-4`}>
        <Skeleton
          className={`bg-input w-[48px] h-[48px] flex justify-center items-center rounded-md text-secondary text-3xl`}
        ></Skeleton>
        <Skeleton className={`flex flex-col gap-2`}>
          <Skeleton className={`flex items-center gap-3`}>
            <Skeleton
              className={`font-semibold leading-[24px] tracking-[-0.08px]`}
            ></Skeleton>
          </Skeleton>
          <Skeleton
            className={`w-[250px] text-[13px] tracking-[0.06px] leading-[18px] text-muted-foreground`}
          ></Skeleton>
          <Skeleton
            className={`flex items-center text-muted-foreground gap-2 text-[12px]`}
          >
            <Skeleton className={`h-10 w-10`}></Skeleton>
          </Skeleton>
        </Skeleton>
      </CardContent>
      <Skeleton className={` col-span-1`}>
        <Skeleton
          className={`
            md:w-fit w-full md:h-8 h-10 px-2 rounded-md
           `}
        ></Skeleton>
      </Skeleton>
    </Card>
  );
};
export default ChannelCardLoading;
