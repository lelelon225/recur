import { Sidebar, SidebarContent, SidebarFooter, } from "@/components/ui/sidebar";
import { useNavigationBar } from "@/hooks/useNavigationBar";
import { useNavigate } from "react-router-dom";
import AppSidebarUser from "@/components/organisms/AppSidebarUser";
import SidebarNavigation from "@/components/molecules/SideBarNavigation";
import SidebarBrand from "@/components/molecules/SidebarBrand";
import { Settings, ClipboardPaste } from "lucide-react";
import SidebarSettingsGroup from "./SidebarSettingsGroup";
import useUserDetails from "@/hooks/useUserDetails";
import { useImportQuartalsplan } from "@/contexts/ImportQuartalsplanContext";
function AppSidebar({ destinations, ...props }) {
    const { activeValue, handleNavigation } = useNavigationBar(destinations);
    const navigate = useNavigate();
    const { user } = useUserDetails();
    const { openImportQuartalsplan } = useImportQuartalsplan();
    const settingsItems = [
        {
            label: "Account",
            Icon: Settings,
            onClick: () => {
                navigate("/setting/account");
            },
        },
        {
            label: "Quartalsplan importieren",
            Icon: ClipboardPaste,
            onClick: openImportQuartalsplan,
        },
    ];
    return (<Sidebar variant="inset" {...props}>    
      <SidebarBrand onClick={() => navigate("/")}/>
      <SidebarContent>
        <SidebarNavigation destinations={destinations} handleNavigation={handleNavigation} activeValue={activeValue}/>
        <SidebarSettingsGroup SettingsItem={settingsItems}/>
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarUser user={user}/>
      </SidebarFooter>
    </Sidebar>);
}
export default AppSidebar;
