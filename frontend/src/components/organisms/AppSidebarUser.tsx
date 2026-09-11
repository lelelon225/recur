import type { UserResponse } from "@/types/auth";
import {Popover, PopoverTrigger} from "@/components/ui/popover";

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
import AppSidebarUserPopover from "../molecules/AppSidebarUserPopover";


type AppSidebarUserProps = {
    user: UserResponse;
};

function AppSidebarUser({ user }: AppSidebarUserProps) {
  if (!user) {
    return null;
  }


  return (
    <SidebarMenu className="w-full border-t pt-2">
      <SidebarMenuItem>
        <Popover>
          <PopoverTrigger
            render={
              <SidebarMenuButton size="lg" className="w-full">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl} alt={user.firstName} />
                    <AvatarFallback>{user.firstName.charAt(0)}{user.lastName?.charAt(0) || ''}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.firstName} {user.lastName}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </SidebarMenuButton>
            }
          />
        <AppSidebarUserPopover />
        </Popover>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default AppSidebarUser
