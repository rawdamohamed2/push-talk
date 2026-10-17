import type { Channel, ConnectionStatus, User } from "@/types";
import { Badge } from "@/components/ui/badge.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import ConnectionBadge from "@/components/channelRoomPage/roomHeader/ConnectionBadge.tsx";
import { MembersStrip } from "@/components/channelRoomPage/roomHeader/MembersStrip.tsx";
import Banner from "@/components/channelRoomPage/roomHeader/Banner.tsx";

interface RoomHeaderProps {
  channel: Channel;
  members: User[];
  onlineIds: number[];
  status: ConnectionStatus;
}
const RoomHeader = ({
  channel,
  members,
  onlineIds,
  status,
}: RoomHeaderProps) => {
  return (
    <section className={``}>
      <div className={`px-3 py-2 flex flex-col gap-3 drop-shadow-md/10`}>
        <div className={`flex md:flex-row flex-col items-center gap-2`}>
          <div className={`flex items-center gap-2`}>
            <h2
              className={`text-xl font-semibold tracking-[-0.5px] leading-[28px]`}
            >
              # {channel.name}
            </h2>
            <Badge className={`text-[10px] font-semibold bg-chart-4/20`}>
              <svg
                width="10"
                height="11"
                viewBox="0 0 10 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.16667 8.66667V2.16667H3.25V8.66667H2.16667V8.66667M4.33333 10.8333V0H5.41667V10.8333H4.33333V10.8333M0 6.5V4.33333H1.08333V6.5H0V6.5M6.5 8.66667V2.16667H7.58333V8.66667H6.5V8.66667M8.66667 6.5V4.33333H9.75V6.5H8.66667V6.5"
                  fill="#4CD7F6"
                />
              </svg>
              VOICE NET
            </Badge>
          </div>
          <Separator orientation={"vertical"} />
          <p
            className={`text-[13px] sm:text-start text-center text-muted-foreground tracking-[0.06px] leading-[18px]`}
          >
            Team instant push-to-talk voice channel & synchronized audio bursts
          </p>
        </div>

        <div className={`flex md:flex-row flex-col items-center gap-2`}>
          <div className={`flex items-center gap-2`}>
            <ConnectionBadge status={status} />
            <p className="text-xs text-muted-foreground">
              {channel.memberCount} members
            </p>
          </div>
          <Separator orientation={"vertical"} />
          <MembersStrip members={members} onlineIds={onlineIds} />
        </div>
      </div>
      <Banner />
      <Separator className={`md:hidden block`} orientation={"horizontal"} />
    </section>
  );
};
export default RoomHeader;
