import { Suspense } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "../ui/sidebar";
import { Spinner } from "../ui/spinner";
import AppSidebarFavoritesMenu from "./app-sidebar-favorite-menu";
import AppSidebarFooter from "./app-sidebar-footer";
import AppSidebarHeader from "./app-sidebar-header";
import AppSidebarHistoryMenu from "./app-sidebar-history-menu";

export default function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <Suspense>
        <AppSidebarHeader />
      </Suspense>
      <SidebarContent className="whitespace-nowrap">
        <SidebarGroup>
          <SidebarGroupLabel>즐겨찾기</SidebarGroupLabel>
          <Suspense
            fallback={
              <div className="flex justify-center">
                <Spinner className="size-4" />
              </div>
            }
          >
            <AppSidebarFavoritesMenu />
          </Suspense>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>채팅 기록</SidebarGroupLabel>
          <AppSidebarHistoryMenu />
        </SidebarGroup>
      </SidebarContent>
      <AppSidebarFooter />
    </Sidebar>
  );
}
