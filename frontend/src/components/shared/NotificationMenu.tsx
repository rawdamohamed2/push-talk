import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button.tsx";
import { Bell } from "lucide-react";
import { mockNotifications } from "@/mocks/notification.data.ts";

const NotificationMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" />}>
        <Bell />
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`min-w-80 flex flex-col justify-center`}>
        <DropdownMenuGroup className={`flex flex-col gap-2 py-2 px-1`}>
          <h3 className={`text-[15px] font-medium`}>New Notifications</h3>
          {mockNotifications.map((notification) => (
            <div className={`py-1 px-3 bg-muted rounded-md `}>
              <DropdownMenuLabel className={`text-secondary`}>
                {notification.title}
              </DropdownMenuLabel>
              <p className={`text-sm`}>{notification.message}</p>
            </div>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default NotificationMenu;
