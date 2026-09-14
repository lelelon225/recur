"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { TasksProvider } from "@/contexts/TasksContext";
import { GroupsProvider } from "@/contexts/GroupsContext";
import ReactErrorBoundary from "@/components/error/ReactErrorBoundary";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";

function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactErrorBoundary>
      <AuthProvider>
        <TooltipProvider>
          <SidebarProvider>
            <TasksProvider>
              <GroupsProvider>{children}</GroupsProvider>
            </TasksProvider>
          </SidebarProvider>
        </TooltipProvider>
      </AuthProvider>
    </ReactErrorBoundary>
  );
}

export default Providers;
