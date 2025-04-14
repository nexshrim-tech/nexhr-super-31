
import React from "react";
import SidebarNav from "@/components/SidebarNav";
import UserHeader from "@/components/UserHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <SidebarNav />
        <div className={cn("flex-1 flex flex-col min-h-screen")}>
          <UserHeader />
          <main className={cn("flex-1", isMobile ? "p-3" : "p-6")}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
