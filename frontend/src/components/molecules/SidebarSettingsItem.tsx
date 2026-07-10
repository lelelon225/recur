import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";

type SidebarSettingsItemProps = {
    onClick: () => void;
    label?: string;
    Icon?: LucideIcon;
};

function SidebarSettingsItem({label, Icon, onClick }: SidebarSettingsItemProps) {
    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                onClick={onClick}
                className="rounded-lg px-3 py-2 my-1 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{label}</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

export default SidebarSettingsItem;