import { AppSidebar } from "@/components/admin/app-sidebar";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio CRM",
  description: "Manage your portfolio website content",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppSidebar>{children}</AppSidebar>
      <Toaster />
    </>
  );
}
