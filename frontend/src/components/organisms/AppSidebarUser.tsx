import type { UserResponse } from "@/types/auth";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"


type AppSidebarUserProps = {
    user: UserResponse;
};

function AppSidebarUser({ user }: AppSidebarUserProps) {

  if (!user) {
    return null;
  }

    function handleUserMenuClick() {
        console.log("User menu clicked");
    }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" className="w-full" onClick={handleUserMenuClick}>
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatarUrl} alt={user.firstName} />
                  <AvatarFallback className="rounded-lg">{user.firstName.charAt(0)}{user.lastName?.charAt(0) || ''}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.firstName} {user.lastName}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default AppSidebarUser
