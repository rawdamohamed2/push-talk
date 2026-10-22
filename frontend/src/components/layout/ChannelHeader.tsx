import { SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import UserAvatar from "@/components/shared/UserAvatar.tsx";

const ChannelHeader = () => {
  return (
    <header className="bg-background/80 flex justify-between py-4 items-center gap-2 border-b px-3">
      <div className={`flex items-center gap-2`}>
        <p className={`font-semibold tracking-[-0.08px] leading-[24px]`}>
          Push<span className={`text-secondary`}>Talk</span>
        </p>
        <Separator
          orientation="vertical"
          className={`md:inline-block hidden`}
        />
        <p
          className={`md:inline-block hidden tracking-[0.06px] leading-[18px] text-[13px] text-muted-foreground`}
        >
          High-bandwidth collaborative voice & stream discussion
        </p>
      </div>
      <div className={`flex items-center gap-2`}>
        <UserAvatar />
        <Separator orientation="vertical" className={`me-2`} />
        <SidebarTrigger />
      </div>
    </header>
  );
};
export default ChannelHeader;
