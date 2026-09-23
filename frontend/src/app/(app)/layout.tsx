"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/organisms/ProtectedRoute";
import DefaultLayout from "@/components/templates/DefaultLayout";

function getPageTitle(pathname: string): string {
  if (pathname === "/") return "Deine Aufgaben";
  if (pathname === "/favorites") return "Deine Favoriten";
  if (pathname === "/calendar") return "Dein Kalender";
  if (pathname === "/archive") return "Dein Archiv";
  if (pathname === "/groups") return "Deine Gruppen";
  if (pathname.startsWith("/groups/join/")) return "Gruppe beitreten";
  if (pathname.startsWith("/groups/")) return "Gruppendetails";
  if (pathname === "/settings") return "Einstellungen";
  return "";
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <ProtectedRoute>
      <DefaultLayout pageTitle={getPageTitle(pathname)}>
        {children}
      </DefaultLayout>
    </ProtectedRoute>
  );
}
