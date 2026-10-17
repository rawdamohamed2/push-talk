import { SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import UserAvater from "@/components/shared/UserAvater.tsx";
import NotificationMenu from "@/components/channelsPage/NotificationMenu.tsx";

const ChannelHeader = () => {
  return (
    <header className="flex justify-between py-4 items-center gap-2 border-b px-3">
      <div className={`flex items-center gap-2`}>
        <p className={`font-semibold tracking-[-0.08px] leading-[24px]`}>
          Push<span className={`text-secondary`}>Talk</span>
        </p>
        <Separator orientation="vertical" />
        <p
          className={`tracking-[0.06px] leading-[18px] text-[13px] text-muted-foreground`}
        >
          High-bandwidth collaborative voice & stream discussion
        </p>
      </div>
      <div className={`flex items-center gap-2`}>
        <NotificationMenu />
        <Separator orientation="vertical" className={`me-2`} />
        <UserAvater />
        <SidebarTrigger />
      </div>
    </header>
  );
};
export default ChannelHeader;
