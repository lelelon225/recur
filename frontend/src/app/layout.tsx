import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Recur",
};

function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

export default RootLayout;
