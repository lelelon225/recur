import { SidebarGroup, SidebarGroupLabel, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
function SidebarNavigation({ destinations, handleNavigation, activeValue }) {
    return (<SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <Separator className="my-2"/>
                <SidebarMenuItem>
                    {destinations.map((destination) => (<SidebarMenuButton isActive={activeValue === destination.path} onClick={() => handleNavigation(destination.path)} tooltip={destination.label} className="rounded-lg px-3 py-2 my-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                        <destination.icon className="h-4 w-4"/>
                        <span>{destination.label}</span>
                    </SidebarMenuButton>))}
                </SidebarMenuItem>
        </SidebarGroup>);
}
export default SidebarNavigation;
