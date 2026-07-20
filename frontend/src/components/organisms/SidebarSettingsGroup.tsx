import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import DarkModeToggle from "@/components/atoms/DarkModeToggle";
import SidebarSettingsItem from "@/components/molecules/SidebarSettingsItem";
import type { LucideIcon } from "lucide-react";

type SidebarSettingsGroupProps = {
    SettingsItem: {
        label: string;
        Icon: LucideIcon;
        onClick: () => void;
    }[];
    };

function SidebarSettingsGroup({ SettingsItem }: SidebarSettingsGroupProps) {

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Einstellungen</SidebarGroupLabel>
                <Separator className="my-2" />
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DarkModeToggle />
                        </SidebarMenuItem>
                            {SettingsItem.map((item, index) => (
                                <SidebarSettingsItem
                                    key={index}
                                    label={item.label}
                                    Icon={item.Icon}
                                    onClick={item.onClick}
                                />
                            ))}
                    </SidebarMenu>
        </SidebarGroup>
    );
}

export default SidebarSettingsGroup;