import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/Sidebar";
import ChannelHeader from "@/components/layout/ChannelHeader.tsx";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ChannelHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
