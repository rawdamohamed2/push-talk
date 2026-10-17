import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { mockChannels, mockCurrentUser } from "@/mocks/data.ts";
import logo from "@/assets/logo.webp";
import { Button } from "@/components/ui/button.tsx";
import { LogOut } from "lucide-react";
import UserAvater from "@/components/shared/UserAvater.tsx";

export function AppSidebar() {
  const navigate = useNavigate();
  const myChannels = mockChannels.filter((c) => c.isMember);
  const logout = () => {
    navigate("/");
  };
  return (
    <Sidebar>
      <SidebarHeader className="flex-row items-center gap-4 px-4 py-3">
        <div>
          <img
            src={logo}
            alt="push talk logo"
            className={`object-cover object-center max-w-[40px] max-h-[40px]`}
          />
        </div>
        <div>
          <p className={`font-semibold leading-[24px] tracking-[-0.4px]`}>
            PushTalk
          </p>
          <span
            className={`text-[11px] text-secondary tracking-[0.28px] leading-[14px] font-medium flex items-center gap-2`}
          >
            <span
              className={`inline-block w-2 h-2 bg-secondary rounded-full`}
            ></span>
            LIVE VOICE NET
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className={`mt-1`}>
        <SidebarGroup className={`gap-2`}>
          <SidebarGroupLabel
            className={`text-[11px] tracking-[0.55px] leading-[14px] font-semibold`}
          >
            CHANNELS & FREQUENCIES
          </SidebarGroupLabel>
          <SidebarMenu className={`px-2 gap-4 mb-2`}>
            {myChannels.map((c) => (
              <SidebarMenuItem
                key={c.id}
                className={`bg-sidebar-accent px-2 rounded-md `}
              >
                <SidebarMenuButton>
                  <NavLink
                    to={`/channels/${c.id}`}
                    className={`text-sidebar-accent-foreground hover:text-secondary`}
                  >
                    # {c.name}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex-row justify-between items-center">
        <div
          className={`bg-muted flex items-center gap-2 py-2 px-3 rounded-4xl`}
        >
          <UserAvater />
          <span>{mockCurrentUser.username}</span>
        </div>
        <Button
          aria-label={`log out`}
          variant={"link"}
          onClick={logout}
          className={`uppercase font-bold`}
        >
          <span>
            <LogOut />
          </span>
          LOG OUT
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
