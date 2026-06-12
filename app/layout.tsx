import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ThemeSync } from "@/components/theme-sync";
import "./globals.css";

export const metadata: Metadata = {
  title: "HVAC Portal",
  description: "Hot & Cool Command Center operations portal"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body><ThemeSync />{children}</body>
    </html>
  );
}
