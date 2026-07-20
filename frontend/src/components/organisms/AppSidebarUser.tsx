import type { UserResponse } from "@/types/auth";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

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
import { Button } from "@base-ui/react";
import { useAuth } from "@/contexts/AuthContext";


type AppSidebarUserProps = {
    user: UserResponse;
};

function AppSidebarUser({ user }: AppSidebarUserProps) {
  const { logout } = useAuth();
  if (!user) {
    return null;
  }


  return (
    <SidebarMenu className="w-full border-t pt-2">
      <SidebarMenuItem>
        <Popover>
          <PopoverTrigger>
            <SidebarMenuButton size="lg" className="w-full">
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
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start" side="top" sideOffset={8}>
            <Button className="w-full rounded-none p-2 justify-start" onClick={() => logout()}>
              Logout
            </Button>
          </PopoverContent>
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default AppSidebarUser
