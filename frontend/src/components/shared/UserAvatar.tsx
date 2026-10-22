import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import { useSession } from "@/hooks/context/useSession.tsx";

const UserAvatar = () => {
  const { auth } = useSession();
  return (
    <Avatar className={`border border-muted-foreground`}>
      <AvatarFallback className={`uppercase`}>
        {auth?.user.username.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
};
export default UserAvatar;
