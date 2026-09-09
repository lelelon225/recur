import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CalendarCheck, Home } from "lucide-react";

function MinimalSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive tooltip="Today">
              <Home />
              <span>Today</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Calendar">
              <CalendarCheck />
              <span>Calendar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

export const Default = () => (
  <SidebarProvider>
    <MinimalSidebar />
    <SidebarInset>
      <div className="flex items-center gap-2 border-b p-4">
        <SidebarTrigger />
        <span className="text-sm font-medium">Recur</span>
      </div>
      <div className="p-4 text-sm text-muted-foreground">
        SidebarProvider sets up the open/collapsed state, mobile detection and
        the CSS width variables the sidebar and inset content rely on.
      </div>
    </SidebarInset>
  </SidebarProvider>
);

export const DefaultOpenFalse = () => (
  <SidebarProvider defaultOpen={false}>
    <MinimalSidebar />
    <SidebarInset>
      <div className="flex items-center gap-2 border-b p-4">
        <SidebarTrigger />
        <span className="text-sm font-medium">Recur</span>
      </div>
      <div className="p-4 text-sm text-muted-foreground">
        Starting collapsed via the provider's <code>defaultOpen</code> prop.
      </div>
    </SidebarInset>
  </SidebarProvider>
);
