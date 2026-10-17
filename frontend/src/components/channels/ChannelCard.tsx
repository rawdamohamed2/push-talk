import { Card, CardContent } from "@/components/ui/card";
import type { Channel } from "@/types";
import { Badge } from "@/components/ui/badge.tsx";
import { ArrowRight, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Link } from "react-router-dom";
interface ChannelCardProps {
  channel: Channel;
  onJoin?: (id: number) => void;
}
const ChannelCard = ({ channel, onJoin }: ChannelCardProps) => {
  return (
    <Card
      className={`grid md:grid-cols-3 grid-cols-1 px-3 items-center justify-center`}
    >
      <CardContent className={`w-full md:col-span-2 col-span-1 flex gap-4`}>
        <div className={`flex justify-center items-center`}>
          <div
            className={`bg-input w-[48px] h-[48px] flex justify-center items-center rounded-md text-secondary text-3xl`}
          >
            #
          </div>
        </div>
        <div className={`flex flex-col gap-2`}>
          <div className={`flex items-center gap-3`}>
            <h2 className={`font-semibold leading-[24px] tracking-[-0.08px]`}>
              {channel.name}
            </h2>
            {channel.isMember && <Badge>Joined</Badge>}
          </div>
          <p
            className={`max-w-[300px] text-[13px] tracking-[0.06px] leading-[18px] text-muted-foreground`}
          >
            Company-wide hub for daily broadcasts, spontaneous hangouts, and
            announcements.
          </p>
          <p
            className={`flex items-center text-muted-foreground gap-2 text-[12px]`}
          >
            <span className={``}>
              <Users size={16} />
            </span>
            <span> {channel.memberCount} members</span>
          </p>
        </div>
      </CardContent>
      <div className={` col-span-1`}>
        {channel.isMember ? (
          <Link
            className={`bg-secondary text-secondary-foreground 
            hover:bg-input hover:text-inverse-surface 
            flex gap-1 md:w-fit w-full md:h-8 h-10 px-2 justify-center items-center rounded-md
           `}
            to={`/channels/${channel.id}`}
          >
            Open Channel <ArrowRight size={15} />
          </Link>
        ) : onJoin !== undefined ? (
          <Button
            variant={"secondary"}
            className={`md:w-fit w-full md:py-1 h-10`}
            onClick={() => {
              onJoin(channel.id);
            }}
          >
            <Plus /> Join Channel
          </Button>
        ) : (
          ""
        )}
      </div>
    </Card>
  );
};
export default ChannelCard;
