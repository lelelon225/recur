import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { NavigationDestination } from "@/hooks/useNavigationBar";
import { useNavigationBar } from "@/hooks/useNavigationBar";
import DarkModeToggle from "@/components/atoms/DarkModeToggle";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import AppSidebarUser from "@/components/organisms/AppSidebarUser";
import SidebarNavigation from "@/components/molecules/SideBarNavigation";
import SidebarBrand from "@/components/molecules/SidebarBrand";
import SidebarSettingsItem from "@/components/molecules/SidebarSettingsItem";
import { Settings } from "lucide-react";
import SidebarSettingsGroup from "./SidebarSettingsGroup";

    const user = {
    firstName: "Leonardo",
    lastName: "Disma",
    email: "dismami@gmail.com",
    avatar: "https://github.com/shadcn.png",
    };


type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  destinations: NavigationDestination[];
};



function AppSidebar({
  destinations,
  ...props
}: AppSidebarProps) {
  const { activeValue, handleNavigation } = useNavigationBar(destinations);
  const navigate = useNavigate();

  const settingsItems = [
  {
    label: "Account",
    Icon: Settings,
    onClick: () => {
      navigate("/setting/account");
    },
  },
];

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarBrand onClick={() => navigate("/")} />
      <SidebarContent>
            <SidebarNavigation
                destinations={destinations}
                handleNavigation={handleNavigation}
                activeValue={activeValue}
            />
        <SidebarSettingsGroup SettingsItem={settingsItems} />

      </SidebarContent>
      <SidebarFooter>
        <AppSidebarUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;