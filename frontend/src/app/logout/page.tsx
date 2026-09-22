"use client";

import { Suspense } from "react";
import LogoutPage from "@/components/pages/LogoutPage";
import { Spinner } from "@/components/ui/spinner";

export default function LogoutRoutePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <LogoutPage />
    </Suspense>
  );
}
