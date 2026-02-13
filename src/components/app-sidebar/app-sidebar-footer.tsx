"use client";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { AlertCircle, LogOut, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SidebarFooter, useSidebar } from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";

export default function AppSidebarFooter() {
  const { setTheme, theme } = useTheme();
  const { open } = useSidebar();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <SidebarFooter>
      <DropdownMenu>
        <div>
          <DropdownMenuTrigger className="w-full focus-visible:outline-none rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:font-medium hover:cursor-pointer">
            <div
              className={cn(
                "flex items-center overflow-hidden transition-all duration-200 ease-in-out",
                open ? "p-1 gap-2" : "p-0",
              )}
            >
              <UserAvartar />
            </div>
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent align="end">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Sun className="mr-2 size-4" />
              <span>테마 설정</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 size-4" />
                <span>라이트</span>
                {theme === "light" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 size-4" />
                <span>다크</span>
                {theme === "dark" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 size-4" />
                <span>시스템</span>
                {theme === "system" && <span className="ml-auto">✓</span>}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 size-4" />
            <span>로그아웃</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarFooter>
  );
}

function UserAvartar() {
  const { data, isPending, error } = authClient.useSession();

  if (isPending) {
    return (
      <>
        <Skeleton className="size-7 rounded-full" />
        <div className="whitespace-nowrap group-data-[collapsible=icon]:hidden space-y-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Avatar className="size-7">
          <AvatarFallback className="bg-destructive/10">
            <AlertCircle className="size-4 text-destructive" />
          </AvatarFallback>
        </Avatar>
        <div className="whitespace-nowrap group-data-[collapsible=icon]:hidden">
          <p className="text-sm text-start text-destructive">오류 발생</p>
          <p className="text-xs text-start text-gray-500">
            사용자 정보를 불러올 수 없습니다
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Avatar className="size-7">
        <AvatarImage
          src={data?.user.image ?? "https://github.com/shadcn.png"}
          alt="@shadcn"
        />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="whitespace-nowrap group-data-[collapsible=icon]:hidden">
        <p className="text-sm text-start">{data?.user.name ?? "Nickname"}</p>
        <p className="text-xs text-start text-gray-500">
          {data?.user.email ?? "example@example.com"}
        </p>
      </div>
    </>
  );
}
