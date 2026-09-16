"use client";

import { Suspense } from "react";
import ResetPasswordPage from "@/components/pages/ResetPasswordPage";
import { Spinner } from "@/components/ui/spinner";

export default function ResetPasswordRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner className="size-8 text-primary" />
        </div>
      }
    >
      <ResetPasswordPage />
    </Suspense>
  );
}
