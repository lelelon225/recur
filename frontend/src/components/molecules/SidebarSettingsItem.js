import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
function SidebarSettingsItem({ label, Icon, onClick, }) {
    return (<SidebarMenuItem>
      <SidebarMenuButton onClick={onClick} className="rounded-lg px-3 py-2 my-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
        {Icon && <Icon className="h-4 w-4"/>}
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>);
}
export default SidebarSettingsItem;
