import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CalendarCheck, Flame, Home, ListChecks, Settings } from "lucide-react";

function RecurSidebar() {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Flame className="h-5 w-5 text-primary" />
          <span className="text-base font-semibold">Recur</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive tooltip="Today">
                  <Home />
                  <span>Today</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Habits">
                  <ListChecks />
                  <span>Habits</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Calendar">
                  <CalendarCheck />
                  <span>Calendar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Account">
                  <Settings />
                  <span>Account</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
            MK
          </div>
          <span>Mara Keller</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export const Expanded = () => (
  <SidebarProvider defaultOpen>
    <RecurSidebar />
    <SidebarInset>
      <div className="flex items-center gap-2 border-b p-4">
        <SidebarTrigger />
        <span className="text-sm font-medium">Today's habits</span>
      </div>
      <div className="p-4 text-sm text-muted-foreground">
        3 of 5 habits completed today.
      </div>
    </SidebarInset>
  </SidebarProvider>
);

export const Collapsed = () => (
  <SidebarProvider defaultOpen={false}>
    <RecurSidebar />
    <SidebarInset>
      <div className="flex items-center gap-2 border-b p-4">
        <SidebarTrigger />
        <span className="text-sm font-medium">Today's habits</span>
      </div>
    </SidebarInset>
  </SidebarProvider>
);

export const Floating = () => (
  <SidebarProvider defaultOpen>
    <Sidebar variant="floating">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <Flame className="h-5 w-5 text-primary" />
          <span className="text-base font-semibold">Recur</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>
                  <Home />
                  <span>Today</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <ListChecks />
                  <span>Habits</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
    <SidebarInset>
      <div className="p-4 text-sm text-muted-foreground">Floating variant, ring + shadow.</div>
    </SidebarInset>
  </SidebarProvider>
);
