import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { mockCurrentUser } from "@/mocks/data.ts";

const UserAvatar = () => {
  return (
    <Avatar className={`border border-muted-foreground`}>
      <AvatarFallback className={`uppercase`}>
        {mockCurrentUser.username.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
};
export default UserAvatar;
