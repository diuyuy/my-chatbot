import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarSeparator,
} from "./ui/sidebar";

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div>My Agent</div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>즐겨찾기</SidebarGroupLabel>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>채팅 기록</SidebarGroupLabel>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
}
