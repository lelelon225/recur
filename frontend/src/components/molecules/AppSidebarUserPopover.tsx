import { PopoverContent} from "../ui/popover";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";



function AppSidebarUser() {
    const { logout } = useAuth();
    
    return (
            <PopoverContent className="w-auto min-w-auto p-0" align="end" sideOffset={8}>
                <Button variant="ghost" className="w-full justify-start rounded-none rounded-t-lg px-4 py-2 text-sm font-medium" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </PopoverContent>
    )
}

export default AppSidebarUser;