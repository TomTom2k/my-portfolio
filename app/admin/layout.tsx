import { AppSidebar } from "@/components/admin/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio CRM",
  description: "Manage your portfolio website content",
};

import ThemeContextProvider from "@/context/theme-context";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeContextProvider>
      <AppSidebar>{children}</AppSidebar>
      <Toaster />
    </ThemeContextProvider>
  );
}
