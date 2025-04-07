"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebaseConfig";
import type { User } from "firebase/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-14 items-center border-b px-4">
          <SidebarTrigger />
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {user?.displayName ?? user?.email ?? "Guest"}
            </span>
          </div>
        </div>
        <div className="flex-1 p-6">{children}</div>
      </SidebarInset>
    </div>
  );
}